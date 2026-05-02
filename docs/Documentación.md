# 📚 Documentación: Sistema de Guías "Español Para Todos"

Este sistema utiliza una arquitectura basada en **datos dinámicos**. Esto significa que el diseño (`index.html`, `style.css`, `main.js`) es una **plantilla fija** y todo el contenido se controla desde el archivo `contenido.json`.

---

## 🛠️ Estructura del Proyecto

- `index.html`: La cáscara del sitio en la raíz. No se toca.
- `css/style.css`: El diseño y colores. No se toca.
- `js/main.js`: El motor que lee el JSON y dibuja las fichas. No se toca.
- `data/contenido.json`: **¡Aquí es donde trabajas!** Contiene todos los textos del video.
- `assets/`: Carpeta para imágenes y logos.

---

## 📝 Guía del archivo `contenido.json`

### 1. Cabecera (`meta`)
Configura los datos generales del video:
- `titulo_pagina`: Nombre en la pestaña del navegador.
- `titulo_hero`: Título grande que aparece en el fondo azul.
- `objetivo`: Frase descriptiva de la lección (aparece debajo del título).
- `video_label`: Texto del botón del video (ej: "Video: La cita a ciegas").
- `video_url`: Enlace directo al video en YouTube.
- `ilustracion`: Nombre del archivo de imagen que debe estar en `assets/ilustraciones/` (ej: `foto.png`).

### 2. Las Fichas (`fichas`)
Cada ficha es un objeto en la lista. Puedes tener entre 10 y 14.

#### Tipos de Ficha (`tipo`)
Esto cambia el color de la parte superior y del icono:
- `expresiones` (Azul/Índigo)
- `gramatica` (Verde/Esmeralda)
- `vocabulario` (Ámbar/Amarillo)
- `reglas` (Verde/Esmeralda)
- `ortografia` (Rosa/Rojo)

#### Formatos de Ejemplos (`ejemplos.formato`)
Solo existen **3 formatos** permitidos:

| Formato | Estructura de `items` | Uso ideal |
| :--- | :--- | :--- |
| **`lista`** | `["Texto 1", "Texto 2"]` | Frases, reglas de ortografía, notas rápidas. |
| **`dialogo`** | `[{"pregunta": "...", "respuesta": "..."}]` | Conversaciones, funciones de comunicación. |
| **`grid`** | `["Palabra 1", "Palabra 2", "..."]` | Vocabulario, opuestos, listas largas. |

---

## 🚀 Cómo crear un nuevo video (Paso a Paso)

1. **Clona la carpeta de la plantilla** completa.
2. **Genera el contenido con IA** siguiendo los 3 pasos en la carpeta `docs/`:
   - **Paso 1:** Generar guion y análisis (`1. A1_Generado_Contenido_PCIC.md`).
   - **Paso 2:** Generar las fichas didácticas (`2. A1_Generador_Fichas_Didacticas.md`).
   - **Paso 3:** Generar el JSON y las 4 traducciones (`3. A1_Traductor_JSON_Principal.md`).
3. **Guarda los archivos JSON** resultantes en la carpeta `data/`.
4. **Sube la carpeta** a tu repositorio de GitHub.
5. **¡Listo!** GitHub Pages publicará la nueva guía automáticamente.

---

## 💡 Trucos de Formato
Dentro de cualquier texto del JSON puedes usar estas etiquetas HTML para resaltar palabras:
- `<strong>Texto</strong>` para **Negrita**.
- `<em>Texto</em>` para *Cursiva*.
- `<u>Texto</u>` para <u>Subrayado</u>.
- `<br>` para un salto de línea.
