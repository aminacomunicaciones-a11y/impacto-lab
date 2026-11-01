# Impacto Lab · web oficial

Web de lanzamiento de **Impacto Lab**, el juego de acción para Android de Aminan.
Publicada con GitHub Pages en <https://aminacomunicaciones-a11y.github.io/impacto-lab/>.

- Una sola página (`index.html`) con CSS y JS propios, sin librerías, sin cookies, sin analítica ni formularios.
- Dirección de arte sacada del juego: asfalto, amarillo de seguridad, tipografías Big Shoulders Stencil Display e IBM Plex Mono (autoalojadas en `fonts/`).
- Los datos del arsenal (nombres, textos, daño, precio, usos y recarga) salen de la tienda del propio juego.
- `video/`: clips y montajes recortados de los tres vídeos largos, más los tres vídeos completos a 720p. Se cargan solo al verse; con `prefers-reduced-motion` o ahorro de datos no arranca nada solo.
- `?quieto` en la URL quita animaciones y deja todo a la vista (sirve para capturas); `&ir=arena` salta a una sección.

Las herramientas con las que se monta (plantilla, script de montaje, recortes de vídeo) se guardan fuera de este repositorio.

© Aminan

La política de privacidad vive en `privacidad/` y no se toca desde el montaje de la web.
