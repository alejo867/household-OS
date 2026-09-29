from PIL import Image, ImageDraw
import math

def rounded_gradient(size, radius_ratio=0.22, pad_ratio=0.0):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    top = (92, 122, 94, 255)      # moss-500
    bottom = (67, 33, 23, 255)    # deep clay-ish brown for depth
    # build vertical gradient
    grad = Image.new("RGBA", (1, size), 0)
    for y in range(size):
        t = y / (size - 1)
        r = int(top[0] + (bottom[0] - top[0]) * t * 0.55)
        g = int(top[1] + (bottom[1] - top[1]) * t * 0.55)
        b = int(top[2] + (bottom[2] - top[2]) * t * 0.55)
        grad.putpixel((0, y), (r, g, b, 255))
    grad = grad.resize((size, size))

    mask = Image.new("L", (size, size), 0)
    mdraw = ImageDraw.Draw(mask)
    pad = int(size * pad_ratio)
    mdraw.rounded_rectangle([pad, pad, size - 1 - pad, size - 1 - pad], radius=int(size * radius_ratio), fill=255)

    img = Image.composite(grad, img, mask)
    return img

def draw_leaf_nest(img, size):
    draw = ImageDraw.Draw(img)
    cx, cy = size / 2, size / 2
    r = size * 0.30

    # simple stylized leaf/nest mark: overlapping soft petals forming a nest-like circle
    petal_color = (250, 247, 240, 255)
    for i in range(6):
        angle = math.pi * 2 * i / 6
        px = cx + math.cos(angle) * r * 0.42
        py = cy + math.sin(angle) * r * 0.42
        w = r * 0.95
        h = r * 0.55
        bbox = [px - w / 2, py - h / 2, px + w / 2, py + h / 2]
        petal = Image.new("RGBA", img.size, (0, 0, 0, 0))
        pd = ImageDraw.Draw(petal)
        pd.ellipse(bbox, fill=(petal_color[0], petal_color[1], petal_color[2], 235))
        petal = petal.rotate(math.degrees(angle) + 90, center=(px, py), resample=Image.BICUBIC)
        img.alpha_composite(petal)

    # center dot
    dot_r = r * 0.28
    draw.ellipse([cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r], fill=(196, 99, 59, 255))

def make_icon(size, path, pad_ratio=0.0):
    img = rounded_gradient(size, pad_ratio=pad_ratio)
    draw_leaf_nest(img, size)
    img.save(path)

make_icon(192, "public/icons/icon-192.png")
make_icon(512, "public/icons/icon-512.png")
make_icon(512, "public/icons/icon-maskable-512.png", pad_ratio=0.0)
make_icon(180, "public/icons/apple-touch-icon.png", pad_ratio=0.0)
print("icons written")
