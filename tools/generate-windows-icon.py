from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]


def font(size: int) -> ImageFont.FreeTypeFont:
    for candidate in [
        Path("C:/Windows/Fonts/NotoSerifSC-VF.ttf"),
        Path("C:/Windows/Fonts/NotoSansSC-VF.ttf"),
        Path("C:/Windows/Fonts/msyhbd.ttc"),
        Path("C:/Windows/Fonts/simhei.ttf"),
    ]:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def make_icon() -> Image.Image:
    size = 256
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((10, 10, 246, 246), radius=42, fill="#eef6df", outline="#7a583e", width=8)
    draw.ellipse((58, 80, 198, 220), fill="#fff0c8", outline="#7a583e", width=8)
    draw.arc((78, 22, 154, 112), 190, 350, fill="#286f58", width=18)
    draw.arc((118, 28, 220, 118), 200, 335, fill="#48a868", width=16)
    draw.ellipse((96, 142, 112, 158), fill="#17231d")
    draw.ellipse((154, 142, 170, 158), fill="#17231d")
    draw.arc((104, 166, 174, 204), 20, 160, fill="#8b4c37", width=7)
    draw.text((42, 30), "仙农", fill="#17231d", font=font(34))
    return img


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: generate-windows-icon.py <output.ico>", file=sys.stderr)
        return 2
    out = ROOT / sys.argv[1]
    out.parent.mkdir(parents=True, exist_ok=True)
    icon = make_icon()
    icon.save(out, sizes=[(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)])
    print(str(out))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
