#!/usr/bin/env python3
"""Generate Open Graph share cards for status.bwengr.com.

Outputs 1200x630 PNGs to public/og/. Re-run after brand or copy changes.
"""
from __future__ import annotations

import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
BG = (10, 10, 15)
TEAL = (45, 212, 191)
WHITE = (241, 245, 249)
MUTED = (139, 155, 176)
DIM = (111, 128, 146)
PANEL = (14, 22, 32)
EDGE = (26, 39, 51)

FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"
OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "og")


def font(path, size):
    return ImageFont.truetype(path, size)


def backdrop():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    for x in range(0, W, 48):
        d.line([(x, 0), (x, H)], fill=(18, 24, 34), width=1)
    for y in range(0, H, 48):
        d.line([(0, y), (W, y)], fill=(18, 24, 34), width=1)
    glow = Image.new("RGB", (W, H), BG)
    gd = ImageDraw.Draw(glow)
    gd.ellipse([-260, -300, 620, 460], fill=(16, 66, 62))
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    return Image.blend(img, glow, 0.5)


def chip(d, x, y, label, value):
    pad_x, pad_y = 18, 14
    f_lbl, f_val = font(FONT_BOLD, 15), font(FONT_BOLD, 30)
    vw = d.textlength(value, font=f_val)
    lw = d.textlength(label, font=f_lbl)
    w = int(max(vw, lw)) + pad_x * 2
    h = 92
    d.rounded_rectangle([x, y, x + w, y + h], radius=12, fill=PANEL, outline=EDGE, width=1)
    d.text((x + pad_x, y + pad_y), label.upper(), font=f_lbl, fill=DIM)
    d.text((x + pad_x, y + pad_y + 26), value, font=f_val, fill=TEAL)
    return w


def card(title, sub, lede, chips, path, out):
    img = backdrop()
    d = ImageDraw.Draw(img)

    box = (64, 56, 108, 100)
    d.rounded_rectangle(box, radius=10, fill=TEAL)
    f_mark = font(FONT_BOLD, 15)
    mw = d.textlength("B+W", font=f_mark)
    d.text((box[0] + (box[2] - box[0] - mw) / 2, box[1] + 15), "B+W", font=f_mark, fill=(4, 18, 15))

    d.text((118, 62), "B+W ENGINEERING", font=font(FONT_BOLD, 17), fill=MUTED)
    d.text((118, 84), "status.bwengr.com", font=font(FONT_REG, 15), fill=DIM)

    d.text((64, 140), title, font=font(FONT_BOLD, 76), fill=WHITE)
    d.text((64, 236), sub, font=font(FONT_BOLD, 30), fill=TEAL)

    y = 300
    for line in lede:
        d.text((64, y), line, font=font(FONT_REG, 23), fill=MUTED)
        y += 34

    cx = 64
    for label, value in chips:
        cx += chip(d, cx, 424, label, value) + 14

    d.line([(64, 556), (W - 64, 556)], fill=EDGE, width=1)
    d.text((64, 574), path, font=font(FONT_BOLD, 19), fill=TEAL)
    tagline = "Thermals, throughput, and node health"
    tw = d.textlength(tagline, font=font(FONT_REG, 18))
    d.text((W - 64 - tw, 575), tagline, font=font(FONT_REG, 18), fill=DIM)

    os.makedirs(OUT_DIR, exist_ok=True)
    dest = os.path.join(OUT_DIR, out)
    img.save(dest, "PNG", optimize=True)
    print("wrote", dest)


def main():
    card(
        title="B+W Inference",
        sub="DGX cluster \u00b7 live status",
        lede=[
            "Two DGX Spark nodes behind api.bwengr.com.",
            "GPU thermals, power, memory, and decode throughput.",
        ],
        chips=[("nodes", "2 / 2 online"), ("throughput", "140 tok/s"), ("hottest gpu", "68 \u00b0C")],
        path="status.bwengr.com/inference",
        out="inference.png",
    )
    card(
        title="System Status",
        sub="B+W Engineering web properties",
        lede=[
            "Live availability and response times for every",
            "B+W Engineering site, checked continuously.",
        ],
        chips=[("sites", "monitored"), ("checks", "every 30 min"), ("uptime", "public")],
        path="status.bwengr.com",
        out="home.png",
    )


if __name__ == "__main__":
    main()
