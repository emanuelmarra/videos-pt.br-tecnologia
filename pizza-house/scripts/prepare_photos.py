"""
Recorta as fotografias individuais a partir dos materiais originais enviados.

- assets/originals/instagram-grid.jpg  -> montagem 3x4 do Instagram (12 posts)
- assets/originals/brand-hero.jpg      -> peça de marca (logo + pizza marguerita)

Remove os ícones de interface do Instagram (fixado / reels / carrossel) e os
textos sobrepostos, sem alterar a aparência das fotos. Gera PNGs sem perdas em
assets/photos/, que depois são otimizados por scripts/optimize-images.mjs.

Uso:  python3 scripts/prepare_photos.py   (requer pillow, numpy, opencv-python-headless)

Quando o cliente enviar as fotos originais em alta resolução, basta colocá-las
diretamente em assets/photos/ com os mesmos nomes e rodar `npm run images`.
"""
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "originals"
OUT = ROOT / "assets" / "photos"
OUT.mkdir(parents=True, exist_ok=True)

grid = cv2.imread(str(SRC / "instagram-grid.jpg"))
brand = cv2.imread(str(SRC / "brand-hero.jpg"))

# Grade do Instagram: separadores de 3px detectados em x=391/785 e y=521/1045/1569
COLS = [(0, 391), (394, 785), (788, 1179)]
ROWS = [(0, 521), (524, 1045), (1048, 1569), (1572, 2093)]


def tile(n: int) -> np.ndarray:
    """Retorna o post n (1..12, da esquerda para a direita, de cima para baixo)."""
    r, c = divmod(n - 1, 3)
    (x0, x1), (y0, y1) = COLS[c], ROWS[r]
    return grid[y0:y1, x0:x1].copy()


def crop(img: np.ndarray, x0: int, y0: int, x1: int, y1: int) -> np.ndarray:
    return img[y0:y1, x0:x1].copy()


def save(name: str, img: np.ndarray) -> None:
    cv2.imwrite(str(OUT / f"{name}.png"), img)
    print(f"  {name}.png  {img.shape[1]}x{img.shape[0]}")


def repair_sign_ring(img: np.ndarray) -> np.ndarray:
    """Post 6 (fachada): o ícone de carrossel cobre parte do anel da placa.
    Preenche a área e redesenha o arco da elipse ajustada ao anel visível."""
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    bright = ((hsv[..., 2] > 120) & (hsv[..., 1] < 90)).astype(np.uint8)
    region = np.zeros_like(bright)
    region[5:235, 180:391] = 1
    icon = np.zeros_like(bright)
    icon[16:80, 312:376] = 1
    candidates = bright * region * (1 - icon)
    _, labels, stats, _ = cv2.connectedComponentsWithStats(candidates, 8)
    # maior componente com caixa larga = anel da placa
    best = max(
        range(1, stats.shape[0]),
        key=lambda i: stats[i, cv2.CC_STAT_WIDTH] * stats[i, cv2.CC_STAT_HEIGHT],
    )
    ys, xs = np.nonzero(labels == best)
    ellipse = cv2.fitEllipse(np.stack([xs, ys], 1).astype(np.float32))
    ring_color = np.median(img[ys, xs], 0)

    mask = np.zeros(img.shape[:2], np.uint8)
    mask[14:82, 310:378] = 1
    filled = cv2.inpaint(img, mask * 255, 7, cv2.INPAINT_TELEA)

    alpha = np.zeros(img.shape[:2], np.float32)
    cv2.ellipse(alpha, ellipse, 1.0, thickness=4, lineType=cv2.LINE_AA)
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0.8)
    soft = cv2.GaussianBlur(mask.astype(np.float32), (9, 9), 3)
    a = (alpha * soft)[..., None]
    out = filled * (1 - a) + ring_color[None, None, :] * a
    grain = np.random.default_rng(1).normal(0, 3, out.shape)
    return np.clip(out + grain * soft[..., None], 0, 255).astype(np.uint8)


def patch_wall(img: np.ndarray, dy: int = 95) -> np.ndarray:
    """Post 12: ícone sobre parede lisa — copia a textura da própria parede logo abaixo."""
    f = img.astype(np.float32)
    y0, y1, x0, x1 = 10, 86, 306, 382
    src = f[y0 + dy : y1 + dy, x0:x1]
    ring = np.concatenate(
        [
            f[y0 - 6 : y0, x0:x1].reshape(-1, 3),
            f[y1 : y1 + 6, x0:x1].reshape(-1, 3),
            f[y0:y1, x0 - 6 : x0].reshape(-1, 3),
        ]
    )
    src = src - src.reshape(-1, 3).mean(0) + ring.mean(0)
    m = np.zeros(img.shape[:2], np.float32)
    m[y0:y1, x0:x1] = 1
    m = cv2.GaussianBlur(m, (15, 15), 5)[y0:y1, x0:x1][..., None]
    f[y0:y1, x0:x1] = src * m + f[y0:y1, x0:x1] * (1 - m)
    return np.clip(f, 0, 255).astype(np.uint8)


print("Gerando fotos em assets/photos/")

# --- Peça de marca (1179x873, fundo preto) ---------------------------------
save("hero-pizza", crop(brand, 556, 0, 1179, 873))           # hero
save("marguerita", crop(brand, 680, 200, 1110, 630))          # cardápio (quadrado)
save("brand-full", brand)                                     # base da imagem Open Graph
save("logo-source", crop(brand, 110, 300, 560, 562))          # usado para vetorizar o logo

# --- Posts do Instagram ------------------------------------------------------
t1, t2, t3, t4 = tile(1), tile(2), tile(3), tile(4)
t6, t7, t9, t10, t11, t12 = tile(6), tile(7), tile(9), tile(10), tile(11), tile(12)

save("nutella", crop(t1, 0, 85, 391, 521))                     # sem o ícone "fixado"
save("nutella-thumb", crop(t1, 10, 130, 381, 501))
save("mesa-pizzas", crop(t2, 0, 82, 391, 521))
save("portuguesa", crop(t2, 95, 271, 345, 521))
save("queijo-derretido", crop(t3, 0, 82, 391, 521))
save("salao", crop(t4, 0, 82, 391, 521))
save("fachada", repair_sign_ring(crop(t6, 0, 0, 391, 258)))    # sem o texto do post
save("pizza-catupiry", crop(t7, 10, 158, 391, 440))            # sem textos e logo
save("carne-seca", crop(t7, 60, 160, 330, 430))
save("fatia-presunto", crop(t9, 0, 82, 391, 521))
save("doces-trio", crop(t10, 0, 118, 391, 448))                # sem o balão de mensagem
save("brigadeiro", crop(t10, 62, 112, 262, 312))
save("mesclada", crop(t10, 0, 240, 210, 450))
save("oreo", crop(t10, 195, 205, 391, 401))
save("pizza-entrega", crop(t11, 0, 0, 391, 452))               # sem o logo
save("frango-catupiry", crop(t11, 70, 90, 390, 410))
save("pedido-telefone", patch_wall(t12))

print("Pronto.")
