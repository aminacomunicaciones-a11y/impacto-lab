# Impacto Lab · web pública

Web del juego **Impacto Lab** (acción y supervivencia gore para Android, PEGI 18).
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
- **Correo de contacto** en `privacidad/index.html` (lo exige Google Play).
- Capturas nuevas sin textos de la Constitución (las de `tienda/` del kit aún los tienen).

No subir aquí nunca la carpeta `firma/` ni la APK.
