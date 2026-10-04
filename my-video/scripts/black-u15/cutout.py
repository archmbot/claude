"""Détoure les photos des joueurs (BiRefNet via rembg) et repère les visages.

Usage : python3 scripts/black-u15/cutout.py <dossier_photos> <fichier_numeros.json>
Écrit public/black-u15/players/pXX.png (XX = numéro de maillot) et players.json.
Les photos restent locales : ce dossier est exclu de Git.
Chaque photo est traitée dans un processus séparé : BiRefNet ne rend pas sa mémoire.
"""
import json
import subprocess
import sys
from pathlib import Path

if len(sys.argv) == 3:
    for name in json.loads(Path(sys.argv[2]).read_text()):
        subprocess.run([sys.executable, __file__, sys.argv[1], sys.argv[2], name], check=True)
    sys.exit(0)

import cv2
import numpy as np
from PIL import Image, ImageOps
from rembg import new_session, remove

src_dir = Path(sys.argv[1])
numbers = json.loads(Path(sys.argv[2]).read_text())  # {"IMG_...jpg": 6, ...}
numbers = {sys.argv[3]: numbers[sys.argv[3]]}
out_dir = Path("public/black-u15/players")
out_dir.mkdir(parents=True, exist_ok=True)

session = new_session("birefnet-general")
faces = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
meta_file = out_dir / "players.json"
meta = json.loads(meta_file.read_text()) if meta_file.exists() else []

for name, number in numbers.items():
    im = ImageOps.exif_transpose(Image.open(src_dir / name)).convert("RGB")
    cut = remove(im, session=session, post_process_mask=False)
    rgba = np.array(cut)
    alpha = rgba[:, :, 3]

    # Atténue le reflet orange du mur sur les bords détourés
    edge = (alpha > 0) & (alpha < 240)
    hsv = cv2.cvtColor(rgba[:, :, :3], cv2.COLOR_RGB2HSV)
    orange = edge & (hsv[:, :, 0] < 22) & (hsv[:, :, 1] > 110)
    hsv[:, :, 1] = np.where(orange, hsv[:, :, 1] * 0.45, hsv[:, :, 1]).astype(np.uint8)
    rgba[:, :, :3] = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)

    ys, xs = np.where(alpha > 24)
    pad = 12
    x0, x1 = max(0, xs.min() - pad), min(im.width, xs.max() + pad)
    y0, y1 = max(0, ys.min() - pad), min(im.height, ys.max() + pad)
    crop = rgba[y0:y1, x0:x1]
    file = f"p{number:02d}.png"
    Image.fromarray(crop).save(out_dir / file, optimize=True)

    gray = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2GRAY)
    found = faces.detectMultiScale(gray, scaleFactor=1.08, minNeighbors=6, minSize=(50, 50))
    # garde le visage le plus haut situé dans la silhouette
    face = None
    for fx, fy, fw, fh in sorted(found, key=lambda f: f[1]):
        cx, cy = fx + fw // 2, fy + fh // 2
        if alpha[cy, cx] > 128:
            face = {"x": int(fx - x0), "y": int(fy - y0), "w": int(fw), "h": int(fh)}
            break
    meta = [m for m in meta if m["number"] != number]
    meta.append({"number": number, "file": file, "width": int(x1 - x0), "height": int(y1 - y0), "face": face})
    print(f"#{number}: {file} {x1 - x0}x{y1 - y0} face={face}", flush=True)

meta_file.write_text(json.dumps(sorted(meta, key=lambda m: m["number"]), indent=2))
