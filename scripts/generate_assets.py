import os
import math
import shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = r"c:\My works\2026 Work\Netvision\frontend\public"
os.makedirs(os.path.join(OUTPUT_DIR, "courses"), exist_ok=True)
os.makedirs(os.path.join(OUTPUT_DIR, "textures"), exist_ok=True)

# Colors
BG_DARK = (11, 15, 23, 255)       # #0b0f17
CARD_BG = (15, 23, 42, 255)       # #0f172a
EMERALD = (16, 185, 129, 255)     # #10b981
EMERALD_LIGHT = (52, 211, 153, 255) # #34d399
CYAN = (6, 182, 212, 255)         # #06b6d4
CYAN_LIGHT = (34, 211, 238, 255)  # #22d3ee
AMBER = (245, 158, 11, 255)       # #f59e0b
PURPLE = (168, 85, 247, 255)      # #a855f7
TEXT_WHITE = (244, 245, 247, 255)
TEXT_MUTED = (142, 149, 165, 255)

def draw_glow_line(draw, x1, y1, x2, y2, color, width=2):
    r, g, b, _ = color
    for i in range(3, 0, -1):
        alpha = int(60 / i)
        draw.line([x1, y1, x2, y2], fill=(r, g, b, alpha), width=width + i*3)
    draw.line([x1, y1, x2, y2], fill=(r, g, b, 255), width=width)

def generate_net101_art():
    w, h = 800, 450
    img = Image.new("RGBA", (w, h), BG_DARK)
    draw = ImageDraw.Draw(img, "RGBA")
    
    # Grid
    for x in range(0, w, 40):
        draw.line([x, 0, x, h], fill=(255, 255, 255, 8), width=1)
    for y in range(0, h, 40):
        draw.line([0, y, w, y], fill=(255, 255, 255, 8), width=1)
        
    # Central Processor Box
    cx, cy = w // 2, h // 2
    pw, ph = 160, 160
    draw.rectangle([cx - pw//2 - 4, cy - ph//2 - 4, cx + pw//2 + 4, cy + ph//2 + 4], outline=(16, 185, 129, 100), width=2)
    draw.rectangle([cx - pw//2, cy - ph//2, cx + pw//2, cy + ph//2], fill=(15, 26, 46, 255), outline=EMERALD, width=3)
    
    # Inner core
    draw.rectangle([cx - 40, cy - 40, cx + 40, cy + 40], fill=(6, 182, 212, 40), outline=CYAN_LIGHT, width=2)
    
    # Radiating circuit lines
    for i in range(-60, 70, 20):
        # North
        draw_glow_line(draw, cx + i, cy - ph//2, cx + i, 40, EMERALD_LIGHT, 2)
        # South
        draw_glow_line(draw, cx + i, cy + ph//2, cx + i, h - 40, CYAN_LIGHT, 2)
        # West
        draw_glow_line(draw, cx - pw//2, cy + i, 50, cy + i, EMERALD, 2)
        # East
        draw_glow_line(draw, cx + pw//2, cy + i, w - 50, cy + i, CYAN, 2)

    # Floating binary dots
    for i in range(12):
        bx = 80 + (i * 55) % (w - 160)
        by = 60 + (i * 37) % (h - 120)
        draw.ellipse([bx-4, by-4, bx+4, by+4], fill=CYAN_LIGHT)

    out_path = os.path.join(OUTPUT_DIR, "courses", "net-101.png")
    img.save(out_path, "PNG")
    print(f"Generated {out_path}")

def generate_net201_art():
    w, h = 800, 450
    img = Image.new("RGBA", (w, h), BG_DARK)
    draw = ImageDraw.Draw(img, "RGBA")
    
    # Grid
    for x in range(0, w, 40):
        draw.line([x, 0, x, h], fill=(255, 255, 255, 8), width=1)
    for y in range(0, h, 40):
        draw.line([0, y, w, y], fill=(255, 255, 255, 8), width=1)
        
    # 24-Port Switch Chassis
    cx, cy = w // 2, h // 2
    sw_w, sw_h = 440, 100
    draw.rectangle([cx - sw_w//2, cy - sw_h//2, cx + sw_w//2, cy + sw_h//2], fill=(15, 23, 42, 255), outline=CYAN, width=2)
    
    # Switch Port Grid (2 rows of 12 ports)
    start_x = cx - sw_w//2 + 40
    for row in range(2):
        py = cy - 25 + row * 35
        for col in range(12):
            px = start_x + col * 30
            draw.rectangle([px, py, px + 18, py + 18], fill=(9, 13, 22, 255), outline=(51, 65, 85, 255), width=1)
            # Blinking LED
            led_color = EMERALD_LIGHT if (col + row) % 3 != 0 else AMBER
            draw.ellipse([px + 6, py - 6, px + 12, py], fill=led_color)

    # Patch cables connecting to top/bottom
    for i in range(6):
        px = start_x + i * 60 + 10
        draw_glow_line(draw, px, cy + sw_h//2, px - 30 + i*10, h - 30, EMERALD, 2)
        draw_glow_line(draw, px, cy - sw_h//2, px + 20 - i*10, 40, CYAN_LIGHT, 2)

    out_path = os.path.join(OUTPUT_DIR, "courses", "net-201.png")
    img.save(out_path, "PNG")
    print(f"Generated {out_path}")

def generate_net301_art():
    w, h = 800, 450
    img = Image.new("RGBA", (w, h), BG_DARK)
    draw = ImageDraw.Draw(img, "RGBA")
    
    # Grid
    for x in range(0, w, 40):
        draw.line([x, 0, x, h], fill=(255, 255, 255, 8), width=1)
    for y in range(0, h, 40):
        draw.line([0, y, w, y], fill=(255, 255, 255, 8), width=1)

    cx, cy = w // 2, h // 2
    
    # Globe / Circular Network Mesh
    r = 120
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(16, 185, 129, 120), width=2)
    draw.ellipse([cx - r*0.6, cy - r, cx + r*0.6, cy + r], outline=(6, 182, 212, 100), width=1)
    draw.line([cx - r, cy, cx + r, cy], fill=(6, 182, 212, 100), width=1)
    draw.line([cx, cy - r, cx, cy + r], fill=(6, 182, 212, 100), width=1)

    # Subnet Tree Nodes
    nodes = [
        (cx - 240, cy - 80, "10.0.0.0/16"),
        (cx - 200, cy + 90, "10.0.1.0/24"),
        (cx + 220, cy - 70, "172.16.0.0/12"),
        (cx + 240, cy + 80, "192.168.1.0/24"),
    ]
    
    for nx, ny, label in nodes:
        draw_glow_line(draw, cx, cy, nx, ny, CYAN_LIGHT, 2)
        draw.rectangle([nx - 50, ny - 16, nx + 50, ny + 16], fill=(15, 26, 46, 255), outline=EMERALD_LIGHT, width=2)

    out_path = os.path.join(OUTPUT_DIR, "courses", "net-301.png")
    img.save(out_path, "PNG")
    print(f"Generated {out_path}")

def generate_net401_art():
    w, h = 800, 450
    img = Image.new("RGBA", (w, h), BG_DARK)
    draw = ImageDraw.Draw(img, "RGBA")
    
    # Grid
    for x in range(0, w, 40):
        draw.line([x, 0, x, h], fill=(255, 255, 255, 8), width=1)
    for y in range(0, h, 40):
        draw.line([0, y, w, y], fill=(255, 255, 255, 8), width=1)

    cx, cy = w // 2, h // 2
    
    # 3 Autonomous Systems (AS65001, AS65002, AS65003) Triangle Mesh
    as_nodes = [
        (cx, cy - 100, PURPLE, "AS 65001 (Core BGP)"),
        (cx - 180, cy + 90, CYAN, "AS 65002 (Cloud Edge)"),
        (cx + 180, cy + 90, EMERALD, "AS 65003 (Carrier Mesh)"),
    ]
    
    # BGP Peering Links
    draw_glow_line(draw, as_nodes[0][0], as_nodes[0][1], as_nodes[1][0], as_nodes[1][1], PURPLE, 3)
    draw_glow_line(draw, as_nodes[1][0], as_nodes[1][1], as_nodes[2][0], as_nodes[2][1], CYAN_LIGHT, 3)
    draw_glow_line(draw, as_nodes[2][0], as_nodes[2][1], as_nodes[0][0], as_nodes[0][1], EMERALD_LIGHT, 3)

    for nx, ny, color, title in as_nodes:
        draw.ellipse([nx - 40, ny - 40, nx + 40, ny + 40], fill=(15, 23, 42, 255), outline=color, width=2)
        draw.ellipse([nx - 15, ny - 15, nx + 15, ny + 15], fill=color)

    out_path = os.path.join(OUTPUT_DIR, "courses", "net-401.png")
    img.save(out_path, "PNG")
    print(f"Generated {out_path}")

def generate_certificate_seal():
    w, h = 400, 400
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, "RGBA")
    
    cx, cy = w // 2, h // 2
    
    # Outer notched seal ring
    points = []
    num_teeth = 36
    for i in range(num_teeth * 2):
        angle = (i * math.pi) / num_teeth
        radius = 175 if i % 2 == 0 else 160
        x = cx + radius * math.cos(angle)
        y = cy + radius * math.sin(angle)
        points.append((x, y))
        
    draw.polygon(points, fill=(16, 185, 129, 30), outline=(16, 185, 129, 220))
    draw.ellipse([cx - 145, cy - 145, cx + 145, cy + 145], fill=(11, 15, 23, 255), outline=(52, 211, 153, 255), width=3)
    draw.ellipse([cx - 130, cy - 130, cx + 130, cy + 130], outline=(6, 182, 212, 180), width=2)
    
    # Center Emblem (N glyph with checkmark)
    draw.line([cx - 35, cy + 30, cx - 35, cy - 30], fill=(52, 211, 153, 255), width=5)
    draw.line([cx - 35, cy - 30, cx + 35, cy + 30], fill=(34, 211, 238, 255), width=5)
    draw.line([cx + 35, cy + 30, cx + 35, cy - 30], fill=(52, 211, 153, 255), width=5)

    out_path = os.path.join(OUTPUT_DIR, "certificate-seal.png")
    img.save(out_path, "PNG")
    print(f"Generated {out_path}")

def generate_textures():
    # 1. CRT Scanlines (256x256 seamless)
    img = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, "RGBA")
    for y in range(0, 256, 4):
        draw.line([0, y, 256, y], fill=(0, 0, 0, 140), width=1)
        draw.line([0, y+1, 256, y+1], fill=(34, 211, 238, 20), width=1)
    crt_path = os.path.join(OUTPUT_DIR, "textures", "crt_scanlines.png")
    img.save(crt_path, "PNG")
    print(f"Generated {crt_path}")

    # 2. Tech Grid (80x80 seamless)
    grid_img = Image.new("RGBA", (80, 80), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(grid_img, "RGBA")
    gdraw.line([0, 0, 80, 0], fill=(255, 255, 255, 12), width=1)
    gdraw.line([0, 0, 0, 80], fill=(255, 255, 255, 12), width=1)
    grid_path = os.path.join(OUTPUT_DIR, "textures", "tech_grid.png")
    grid_img.save(grid_path, "PNG")
    print(f"Generated {grid_path}")

def copy_ai_generated_assets():
    # Copy generated NET-101 photo if exists
    src101 = r"C:\Users\Qamar Abbas\.gemini\antigravity-ide\brain\27464d9c-ec4a-4c69-9016-fcb6185e636b\course_net101_foundations_1788085893864.jpg"
    src_og = r"C:\Users\Qamar Abbas\.gemini\antigravity-ide\brain\27464d9c-ec4a-4c69-9016-fcb6185e636b\netvision_homepage_mockup_1788080691514.jpg"
    
    if os.path.exists(src101):
        dst = os.path.join(OUTPUT_DIR, "courses", "net-101-hero.jpg")
        shutil.copyfile(src101, dst)
        print(f"Copied AI asset to {dst}")
        
    if os.path.exists(src_og):
        dst_og = os.path.join(OUTPUT_DIR, "og-image.png")
        shutil.copyfile(src_og, dst_og)
        print(f"Copied OG image to {dst_og}")

if __name__ == "__main__":
    generate_net101_art()
    generate_net201_art()
    generate_net301_art()
    generate_net401_art()
    generate_certificate_seal()
    generate_textures()
    copy_ai_generated_assets()
    print("All visual assets successfully generated in public!")
