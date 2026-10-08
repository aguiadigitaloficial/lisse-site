"""Create responsive delivery copies of the approved portrait; preserve the source."""
from pathlib import Path
from PIL import Image, ImageOps

folder = Path(__file__).resolve().parents[1] / 'src/assets/photography'
with Image.open(folder / 'kelly-brunette-hero-original.jpeg') as source:
    portrait = ImageOps.exif_transpose(source).convert('RGB')
    for width in (480, 640, 900):
        if width > portrait.width:
            raise ValueError('Do not upscale the portrait')
        height = round(portrait.height * width / portrait.width)
        output = folder / f'kelly-brunette-hero-{width}.webp'
        portrait.resize((width, height), Image.Resampling.LANCZOS).save(
            output, 'WEBP', quality=88, method=6,
        )
        print(f'{output.name}: {width}x{height}, {output.stat().st_size} bytes')
