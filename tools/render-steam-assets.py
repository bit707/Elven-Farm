from __future__ import annotations

import json
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "steam-ready" / "png"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        Path("C:/Windows/Fonts/NotoSerifSC-VF.ttf"),
        Path("C:/Windows/Fonts/NotoSansSC-VF.ttf"),
        Path("C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc"),
        Path("C:/Windows/Fonts/simhei.ttf"),
        Path("C:/Windows/Fonts/simsun.ttc"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def lerp(a: int, b: int, t: float) -> int:
    return round(a + (b - a) * t)


def gradient(size: tuple[int, int], start: tuple[int, int, int], mid: tuple[int, int, int], end: tuple[int, int, int]) -> Image.Image:
    width, height = size
    img = Image.new("RGB", size)
    px = img.load()
    for y in range(height):
        for x in range(width):
            t = (x / max(1, width - 1) + y / max(1, height - 1)) / 2
            if t < 0.5:
                k = t / 0.5
                color = tuple(lerp(start[i], mid[i], k) for i in range(3))
            else:
                k = (t - 0.5) / 0.5
                color = tuple(lerp(mid[i], end[i], k) for i in range(3))
            px[x, y] = color
    return img


def draw_shadow_text(draw: ImageDraw.ImageDraw, pos: tuple[int, int], text: str, fill: str, font_obj: ImageFont.FreeTypeFont, shadow: str = "#17231d") -> None:
    x, y = pos
    offset = max(2, font_obj.size // 18)
    draw.text((x + offset, y + offset), text, fill=shadow, font=font_obj)
    draw.text((x, y), text, fill=fill, font=font_obj)


def hill(draw: ImageDraw.ImageDraw, w: int, h: int, fill: str) -> None:
    points = [
        (0, int(h * 0.72)),
        (int(w * 0.18), int(h * 0.55)),
        (int(w * 0.34), int(h * 0.84)),
        (int(w * 0.5), int(h * 0.66)),
        (int(w * 0.68), int(h * 0.48)),
        (int(w * 0.78), int(h * 0.64)),
        (w, int(h * 0.52)),
        (w, h),
        (0, h),
    ]
    draw.polygon(points, fill=fill)


def spirit(draw: ImageDraw.ImageDraw, cx: int, cy: int, rx: int, ry: int, scale: float = 1.0) -> None:
    width = max(4, int(rx * 0.08))
    draw.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill="#fff0c8", outline="#7a583e", width=width)
    draw.arc((cx - int(rx * 0.55), cy - int(ry * 1.65), cx + int(rx * 0.55), cy - int(ry * 0.35)), 190, 350, fill="#286f58", width=max(6, int(rx * 0.12)))
    draw.arc((cx - int(rx * 0.05), cy - int(ry * 1.7), cx + int(rx * 1.05), cy - int(ry * 0.35)), 200, 335, fill="#48a868", width=max(5, int(rx * 0.1)))
    eye = max(3, int(rx * 0.08 * scale))
    draw.ellipse((cx - int(rx * 0.35) - eye, cy - int(ry * 0.05) - eye, cx - int(rx * 0.35) + eye, cy - int(ry * 0.05) + eye), fill="#17231d")
    draw.ellipse((cx + int(rx * 0.3) - eye, cy - int(ry * 0.05) - eye, cx + int(rx * 0.3) + eye, cy - int(ry * 0.05) + eye), fill="#17231d")
    draw.arc((cx - int(rx * 0.28), cy + int(ry * 0.12), cx + int(rx * 0.32), cy + int(ry * 0.55)), 20, 160, fill="#8b4c37", width=max(3, int(rx * 0.06)))


def shop(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int) -> None:
    roof = [(x, y + h // 4), (x + w // 2, y), (x + w, y + h // 4), (x + w, y + h), (x, y + h)]
    draw.polygon(roof, fill="#8b6a48")
    draw.line([(x + int(w * 0.12), y + int(h * 0.28)), (x + w // 2, y + int(h * 0.08)), (x + int(w * 0.88), y + int(h * 0.28))], fill="#583f30", width=max(5, w // 22), joint="curve")
    draw.rectangle((x + int(w * 0.17), y + int(h * 0.42), x + int(w * 0.4), y + int(h * 0.86)), fill="#fff6d8")
    draw.rectangle((x + int(w * 0.57), y + int(h * 0.42), x + int(w * 0.8), y + int(h * 0.86)), fill="#286f58")


def farm_grid(draw: ImageDraw.ImageDraw, x: int, y: int, cols: int, rows: int, cell: int, fill: str) -> None:
    gap = max(4, cell // 6)
    for row in range(rows):
        for col in range(cols):
            px = x + col * (cell + gap)
            py = y + row * (cell + gap)
            draw.rounded_rectangle((px, py, px + cell, py + int(cell * 0.75)), radius=max(3, cell // 8), fill=fill)


def title_asset(spec: dict) -> Image.Image:
    w, h = spec["width"], spec["height"]
    vertical = h > w
    wide = w / h > 2
    img = gradient((w, h), (214, 241, 226), (247, 240, 216), (143, 177, 115))
    draw = ImageDraw.Draw(img)
    hill(draw, w, h, "#668a52")
    draw.ellipse((int(w * 0.7), int(h * 0.05), int(w * 0.98), int(h * 0.35)), outline="#d6a546", width=max(6, int(w * 0.012)))
    draw.ellipse((int(w * 0.76), int(h * 0.11), int(w * 0.92), int(h * 0.29)), outline="#286f58", width=max(4, int(w * 0.006)))
    shop(draw, int(w * (0.1 if vertical else 0.08)), int(h * (0.42 if vertical else 0.46)), int(w * (0.38 if vertical else 0.28)), int(h * (0.2 if vertical else 0.3)))
    spirit(draw, int(w * (0.5 if vertical else 0.69)), int(h * (0.63 if vertical else 0.66)), int(w * (0.2 if vertical else 0.12)), int(h * (0.12 if vertical else 0.18)))
    farm_grid(draw, int(w * (0.18 if vertical else 0.34)), int(h * (0.76 if vertical else 0.74)), 4 if vertical else 10, 3 if vertical else 2, int(w * (0.11 if vertical else 0.04)), "#704c36")
    title_size = int(w * (0.088 if vertical else 0.058))
    subtitle_size = int(w * (0.05 if vertical else 0.031))
    label_size = int(w * (0.034 if vertical else 0.022))
    x = int(w * (0.1 if vertical else 0.065))
    y = int(h * (0.13 if vertical else 0.18))
    draw_shadow_text(draw, (x, y), "仙农洞天", "#17231d", font(title_size, True))
    draw_shadow_text(draw, (x, y + int(title_size * 1.18)), "精怪工坊", "#286f58", font(subtitle_size, True), "#f7f0d8")
    label = "种下灵植 · 唤醒精怪 · 经营修仙小镇"
    draw.text((x, int(h * 0.88) if wide else y + int(title_size * 1.86)), label, fill="#f7f0d8" if wide else "#5d6f65", font=font(label_size))
    return img


def screenshot_asset(spec: dict) -> Image.Image:
    w, h = spec["width"], spec["height"]
    scene = spec["scene"]
    palette = {
        "farm": ((217, 239, 223), "#8da462", "#704c36"),
        "spirit": ((216, 240, 223), "#7fab79", "#577f80"),
        "shop": ((246, 240, 207), "#b2875c", "#8b6a48"),
        "term": ((201, 231, 222), "#7fab79", "#48a868"),
        "ecology": ((223, 234, 211), "#7fab79", "#e7c36f"),
        "dungeon": ((38, 50, 58), "#4d5b4f", "#c88b37"),
        "trade": ((201, 231, 222), "#7fab79", "#8b6a48"),
        "final": ((32, 43, 53), "#30414a", "#e7c36f"),
    }
    start, hill_color, accent = palette.get(scene, palette["farm"])
    dark = scene in {"dungeon", "final"}
    img = gradient((w, h), start, (247, 240, 216) if not dark else (37, 48, 58), (143, 177, 115) if not dark else (24, 36, 43))
    draw = ImageDraw.Draw(img)
    draw.ellipse((int(w * 0.72), int(h * 0.05), int(w * 0.95), int(h * 0.26)), fill=accent)
    hill(draw, w, h, hill_color)
    if scene == "shop":
        shop(draw, int(w * 0.12), int(h * 0.28), int(w * 0.66), int(h * 0.48))
    elif scene == "dungeon":
        draw.rounded_rectangle((int(w * 0.09), int(h * 0.28), int(w * 0.41), int(h * 0.65)), radius=int(w * 0.025), fill="#6b6b5d", outline=accent, width=int(w * 0.008))
        draw.ellipse((int(w * 0.18), int(h * 0.36), int(w * 0.31), int(h * 0.58)), fill="#8b6a48", outline="#e7c36f", width=int(w * 0.006))
    elif scene == "trade":
        draw.arc((int(w * 0.16), int(h * 0.22), int(w * 0.76), int(h * 0.7)), 195, 330, fill="#f7f0d8", width=int(w * 0.018))
        draw.polygon([(int(w * 0.34), int(h * 0.46)), (int(w * 0.51), int(h * 0.35)), (int(w * 0.69), int(h * 0.46)), (int(w * 0.52), int(h * 0.58))], fill="#8b6a48", outline="#583f30")
    elif scene == "final":
        draw.ellipse((int(w * 0.34), int(h * 0.25), int(w * 0.66), int(h * 0.75)), outline="#e7c36f", width=int(w * 0.01))
        draw.ellipse((int(w * 0.4), int(h * 0.34), int(w * 0.6), int(h * 0.66)), outline="#48a868", width=int(w * 0.006))
    else:
        farm_grid(draw, int(w * 0.25), int(h * 0.36), 8, 4, int(w * 0.038), accent)
    spirit(draw, int(w * 0.68), int(h * 0.58), int(w * 0.08), int(h * 0.13))
    box = (int(w * 0.025), int(h * 0.055), int(w * 0.55), int(h * 0.23))
    draw.rounded_rectangle(box, radius=int(w * 0.018), fill="#17231d" if dark else "#fff8e8")
    draw_shadow_text(draw, (int(w * 0.045), int(h * 0.086)), spec["title"], "#f7f0d8" if dark else "#17231d", font(int(w * 0.032), True))
    draw.text((int(w * 0.045), int(h * 0.172)), spec["subtitle"], fill="#e7c36f" if dark else "#286f58", font=font(int(w * 0.018)))
    return img


SCENES = {
    "screenshot-farm": ("farm", "荒废洞天初始", "从第一块灵田开始修复洞天"),
    "screenshot-spirit": ("spirit", "第一只精怪浇水", "从手忙脚乱到自动化解放"),
    "screenshot-shop": ("shop", "旧铺开门经营", "定价、陈列、顾客反馈串起前店后厂"),
    "screenshot-term": ("term", "节气影响农田", "二十四节气改变作物、天气和风险"),
    "screenshot-ecology": ("ecology", "精怪生态庭院", "多精怪组合触发生态共鸣"),
    "screenshot-dungeon": ("dungeon", "青云矿洞战斗", "精怪随行挑战秘境 Boss"),
    "screenshot-trade": ("trade", "跨界商路启航", "商队利润、补给风险与隐藏秘境轮换"),
    "screenshot-final-support": ("final", "终章支援建阵", "NPC 支援和二十四节气大阵收束主线"),
}


def render(spec: dict) -> dict:
    name = spec["name"]
    png_path = OUT / f"{name}.png"
    OUT.mkdir(parents=True, exist_ok=True)
    scene_key = name.rsplit("-", 1)[0]
    if scene_key in SCENES:
        scene, title, subtitle = SCENES[scene_key]
        img = screenshot_asset({**spec, "scene": scene, "title": title, "subtitle": subtitle})
    else:
        img = title_asset(spec)
    img.save(png_path)
    return {"id": spec["id"], "png": str(png_path.relative_to(ROOT)).replace("\\", "/"), "bytes": png_path.stat().st_size}


def main() -> int:
    specs = json.loads(sys.argv[1])
    rendered = [render(spec) for spec in specs]
    print(json.dumps(rendered, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
