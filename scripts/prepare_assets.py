"""Prepare the supplied logo and the scroll animation for the website."""

from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
BRAND_DIR = ROOT / "public" / "brand"
FRAME_DIR = ROOT / "public" / "video-split"


def is_background(pixel: tuple[int, int, int]) -> bool:
    red, green, blue = pixel
    return min(red, green, blue) >= 224 and max(pixel) - min(pixel) <= 30


def extract_logo() -> None:
    source = BRAND_DIR / "mundo-print-3d-original.jpeg"
    destination = BRAND_DIR / "mundo-print-3d-logo.png"
    image = Image.open(source).convert("RGB")
    width, height = image.size
    pixels = image.load()
    exterior = Image.new("L", image.size, 0)
    exterior_pixels = exterior.load()
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        queue.extend(((x, 0), (x, height - 1)))
    for y in range(height):
        queue.extend(((0, y), (width - 1, y)))

    while queue:
        x, y = queue.popleft()
        if exterior_pixels[x, y] or not is_background(pixels[x, y]):
            continue
        exterior_pixels[x, y] = 255
        if x:
            queue.append((x - 1, y))
        if x + 1 < width:
            queue.append((x + 1, y))
        if y:
            queue.append((x, y - 1))
        if y + 1 < height:
            queue.append((x, y + 1))

    matte = exterior.filter(ImageFilter.GaussianBlur(0.55))
    alpha = matte.point(lambda value: 255 - value)
    alpha_pixels = alpha.load()
    for y in range(height):
        for x in range(width):
            if exterior_pixels[x, y] == 255 or x < 2 or y < 2 or x >= width - 2 or y >= height - 2:
                alpha_pixels[x, y] = 0
    result = image.convert("RGBA")
    result.putalpha(alpha)
    result.save(destination, optimize=True)


def convert_scroll_frames() -> None:
    for source in sorted(FRAME_DIR.glob("ffout*.gif")):
        number = source.stem.removeprefix("ffout")
        destination = FRAME_DIR / f"frame_{number}.webp"
        with Image.open(source) as image:
            image.convert("RGB").save(
                destination,
                "WEBP",
                quality=76,
                method=6,
            )


if __name__ == "__main__":
    extract_logo()
    convert_scroll_frames()
