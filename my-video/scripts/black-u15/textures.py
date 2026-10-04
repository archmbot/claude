"""Génère les textures de l'intro BLACK U15 : nappes de fumée et grain cinéma.
Usage : python3 scripts/black-u15/textures.py  (écrit dans public/black-u15/)
"""
import cv2
import numpy as np

rng = np.random.default_rng(15)
out = "public/black-u15/"


def fractal(h, w, octaves=6):
    acc = np.zeros((h, w), np.float32)
    amp, total = 1.0, 0.0
    for o in range(octaves):
        gh, gw = max(2, h >> (7 - o)), max(2, w >> (7 - o))
        layer = cv2.resize(rng.random((gh, gw), dtype=np.float32), (w, h), interpolation=cv2.INTER_CUBIC)
        acc += layer * amp
        total += amp
        amp *= 0.55
    acc /= total
    return (acc - acc.min()) / (acc.max() - acc.min())


for i in range(3):
    h, w = 640, 1600
    n = fractal(h, w)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    fall = np.clip(1 - (((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2), 0, 1) ** 1.4
    a = np.clip((n - 0.35) * 1.9, 0, 1) ** 1.3 * fall
    rgba = np.zeros((h, w, 4), np.uint8)
    rgba[..., 0], rgba[..., 1], rgba[..., 2] = 255, 185, 120  # OpenCV écrit en BGRA : bleu acier
    rgba[..., 3] = (a * 255).astype(np.uint8)
    cv2.imwrite(f"{out}fog{i + 1}.png", rgba)

# grain plus grand que l'image (1920×1080 + marge) : il est décalé au hasard à chaque image
g = np.clip(rng.normal(128, 40, (1080 + 128, 1920 + 128)), 0, 255).astype(np.uint8)
cv2.imwrite(f"{out}grain.jpg", g, [cv2.IMWRITE_JPEG_QUALITY, 85])
print("ok")
