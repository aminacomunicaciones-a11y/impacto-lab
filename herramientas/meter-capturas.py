"""Mete capturas nuevas en la galería de la web de Impacto Lab.

Uso (desde la carpeta de la web):
    python herramientas/meter-capturas.py C:/Users/fauss/Desktop/impacto-capturas

- Coge los .jpg/.png/.webp de esa carpeta en orden alfabético (máx. 9).
- Crea img/cap/<nombre>-480.webp y -960.webp (proporción original, sin recortar).
- Reescribe la galería entre <!-- CAPTURAS:INICIO --> y <!-- CAPTURAS:FIN -->,
  la lista "screenshot" del JSON-LD y las imágenes del sitemap.
- Pie y texto alternativo: salen del nombre del fichero ("03-calle-helada.jpg" ->
  "Calle helada"), o de un textos.json en la carpeta de capturas con la forma
  {"03-calle-helada.jpg": {"pie": "Calle helada", "alt": "Oficinistas congelados..."}}.
"""
import json, re, sys, unicodedata
from pathlib import Path
from PIL import Image

WEB = Path(__file__).resolve().parent.parent
BASE = re.search(r'<link rel="canonical" href="([^"]+)"', (WEB / 'index.html').read_text(encoding='utf-8')).group(1)


def slug(t):
    t = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')


def main(origen):
    origen = Path(origen)
    fotos = sorted(p for p in origen.iterdir() if p.suffix.lower() in ('.jpg', '.jpeg', '.png', '.webp'))[:9]
    if not fotos:
        sys.exit(f'No hay capturas en {origen}')
    textos = {}
    if (origen / 'textos.json').exists():
        textos = json.loads((origen / 'textos.json').read_text(encoding='utf-8'))
    dest = WEB / 'img' / 'cap'
    dest.mkdir(parents=True, exist_ok=True)
    for viejo in dest.glob('*.webp'):
        viejo.unlink()
    botones, grandes = [], []
    for f in fotos:
        nombre = slug(f.stem)
        im = Image.open(f).convert('RGB')
        for w in (480, 960):
            h = round(im.height * w / im.width)
            im.resize((w, h), Image.LANCZOS).save(dest / f'{nombre}-{w}.webp', quality=78, method=6)
        h480 = round(im.height * 480 / im.width)
        auto = re.sub(r'^\d+[-_ ]*', '', f.stem).replace('-', ' ').replace('_', ' ').strip().capitalize()
        t = textos.get(f.name, {})
        pie = t.get('pie', auto)
        alt = t.get('alt', f'Captura de Impacto Lab: {pie[0].lower() + pie[1:]}.')
        esc = lambda x: x.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;')
        botones.append(
            f'      <button type="button" data-full="img/cap/{nombre}-960.webp"><img src="img/cap/{nombre}-480.webp" '
            f'width="480" height="{h480}" loading="lazy" alt="{esc(alt)}"><figcaption>{esc(pie)}</figcaption></button>')
        grandes.append(f'{BASE}img/cap/{nombre}-960.webp')

    p = WEB / 'index.html'
    s = p.read_text(encoding='utf-8')
    s = re.sub(r'(<!-- CAPTURAS:INICIO[^>]*-->\n).*?(\s*<!-- CAPTURAS:FIN -->)',
               lambda m: m.group(1) + '\n'.join(botones) + m.group(2), s, flags=re.S)
    lista = ',\n'.join(f'        "{u}"' for u in grandes[:6])
    s = re.sub(r'("screenshot": \[\n).*?(\n      \])', lambda m: m.group(1) + lista + m.group(2), s, flags=re.S)
    p.write_text(s, encoding='utf-8')

    p = WEB / 'sitemap.xml'
    s = p.read_text(encoding='utf-8')
    imgs = ''.join(f'\n    <image:image><image:loc>{u}</image:loc></image:image>' for u in [f'{BASE}img/og-impacto-lab.jpg'] + grandes)
    s = re.sub(r'(<loc>' + re.escape(BASE) + r'</loc>\n    <lastmod>[^<]*</lastmod>)(\s*<image:image>.*?</image:image>)*',
               lambda m: m.group(1) + imgs, s, count=1, flags=re.S)
    p.write_text(s, encoding='utf-8')
    print(f'{len(fotos)} capturas metidas en la galería.')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
