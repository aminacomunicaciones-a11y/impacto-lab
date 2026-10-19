"""Cambia la URL pública de la web (canonical, Open Graph, JSON-LD, sitemap, robots, 404).

Uso, al pasar a Netlify o a un dominio propio:
    python herramientas/cambiar-url.py https://impacto-lab.netlify.app/

Si la copia de GitHub Pages sigue publicada, apunta su canonical a la URL nueva
y Google se queda con la nueva.
"""
import re, sys
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent

if len(sys.argv) != 2 or not sys.argv[1].startswith('https://'):
    sys.exit(__doc__)
nueva = sys.argv[1].rstrip('/') + '/'
vieja = re.search(r'<link rel="canonical" href="([^"]+)"', (WEB / 'index.html').read_text(encoding='utf-8')).group(1)
cambios = 0
for f in ['index.html', 'privacidad/index.html', '404.html', 'sitemap.xml', 'robots.txt', 'README.md']:
    p = WEB / f
    s = p.read_text(encoding='utf-8')
    if vieja in s:
        p.write_text(s.replace(vieja, nueva), encoding='utf-8')
        cambios += 1
print(f'{vieja} -> {nueva} en {cambios} ficheros')
