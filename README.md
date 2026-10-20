# Impacto Lab · web pública

Web del juego **Impacto Lab** (acción y supervivencia por oleadas para Android, PEGI 18, con anuncios AdMob).
Publicada con GitHub Pages en **https://aminacomunicaciones-a11y.github.io/impacto-lab/**

- `index.html` — portada (hero, modos, arsenal, galería, vídeos, descarga, preguntas).
- `privacidad/` — política de privacidad (URL para Google Play: `.../impacto-lab/privacidad/`).
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, `404.html`.
- `img/` — capturas recortadas para no enseñar la parte antigua de la Constitución.

## Pendiente

- **Vídeos**: en `index.html`, sección `#videos`, rellenar `data-yt="ID_DE_YOUTUBE"` en cada hueco.
  Al añadirlos conviene meter también un `VideoObject` en el JSON-LD.
- **Botón de Google Play**: cuando el juego esté publicado, cambiar los dos botones «Próximamente»
  por enlaces a la ficha y añadir `"offers"` al JSON-LD.
- **Capturas nuevas (v62, sin Constitución)**: `python herramientas/meter-capturas.py C:/Users/fauss/Desktop/impacto-capturas`
  (pies y alt opcionales en un `textos.json` dentro de esa carpeta; ver el propio script).
- **Cambio de hosting** (Netlify o dominio propio): `python herramientas/cambiar-url.py https://NUEVA-URL/`
  y volver a enviar el sitemap en Search Console con la URL nueva.

No subir aquí nunca la carpeta `firma/` ni la APK.
