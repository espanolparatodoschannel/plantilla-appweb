# Instrucciones: Cómo crear una nueva Guía Web

Este proyecto funciona como una **plantilla universal**. Para crear una nueva página de estudio para otro video o nivel, sigue estos pasos:

## 1. Duplicar la Estructura
Copiar la carpeta de la plantilla completa (ejemplo: `Plantilla_Web`) en una nueva ubicación con el nombre de tu lección (ejemplo: `Guia_A1_Leccion2`).

## 2. Generar el Contenido
1.  Usa el **Paso 1** (`1. A1_Generado_Contenido_PCIC.md`) para crear el guion y el análisis.
2.  Usa el **Paso 2** (`2. A1_Generador_Fichas_Didacticas.md`) para crear las fichas.
3.  Usa el **Paso 3** (`3. A1_Traductor_JSON_Principal.md`) para generar el JSON final y las 4 traducciones.

## 3. Actualizar `contenido.json`
Abre la carpeta `data/` en la nueva ubicación y actualiza los archivos `contenido.json`, `contenido_en.json`, etc.

### Bloque A: "meta"
Actualiza la información general:
- `titulo_pagina`: El nombre que aparecerá en la pestaña del navegador.
- `titulo_hero`: El título principal que se ve al abrir la web.
- `objetivo`: El texto que explica qué aprenderá el alumno (puedes usar HTML como `<strong>`).
- `video_url`: El enlace al video de YouTube.
- `ilustracion`: El nombre del archivo de imagen (ej: `foto.png`) que debes guardar en `assets/ilustraciones/`.

### Bloque B: "fichas"
- Borra las fichas anteriores y pega el array de fichas que te entregó Gemini.
- Asegúrate de que las categorías coincidan con los nombres oficiales del PCIC.

## 4. Archivos que NO se tocan
Para mantener la consistencia visual y técnica, **NO modifiques** estos archivos (a menos que quieras cambiar el diseño de TODAS tus guías):
- `index.html` (Raíz)
- `js/main.js` (Motor de renderizado)
- `css/style.css` (Diseño y animaciones)
- `assets/img/Logo Español para todos_transp.png`

## 5. Publicación
Si usas GitHub Pages:
1.  Sube la nueva carpeta a tu repositorio.
2.  La URL será: `tu-usuario.github.io/nombre-repo/nombre-carpeta/`

---
*Documento generado para el canal "Español Para Todos".*
