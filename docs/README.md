# 🗺️ Mapa del Proyecto: Sistema de Guías Web ELE

Este documento explica la función de cada archivo en esta carpeta para que sepas qué es cada cosa y qué puedes tocar.

## 🏗️ Núcleo del Sistema (El "Motor")
Estos archivos crean el diseño y la funcionalidad. **No necesitas tocarlos** a menos que quieras cambiar el aspecto visual de todas tus guías.

*   **`index.html`**: En la raíz. Es el esqueleto de la página.
*   **`css/style.css`**: Contiene todo el diseño visual (Glassmorphism, gradientes, animaciones).
*   **`js/main.js`**: El cerebro del sistema. Lee los archivos JSON y dibuja las fichas.

## 📝 Contenido y Datos (Lo que sí se cambia)
Aquí es donde vive la información pedagógica de cada lección.

*   **`data/contenido.json`**: El archivo base en español con textos, ejemplos y consejos.
*   **`data/contenido_en.json` (y otros)**: Archivos de traducción para el sistema de *Ghost Text*.
*   **`assets/ilustraciones/`**: Aquí van las imágenes que aparecen en la parte superior (Hero).

## 🤖 Inteligencia Artificial (Prompts)
Archivos diseñados para ser copiados y pegados en Gemini para automatizar el trabajo.

*   **`1. A1_Generado_Contenido_PCIC.md`**: Crea guiones, diálogos y análisis pedagógico inicial.
*   **`2. A1_Generador_Fichas_Didacticas.md`**: Transforma el análisis en el formato de fichas.
*   **`3. A1_Traductor_JSON_Principal.md`**: Genera el JSON final y las 4 traducciones automáticas.

## 📖 Guías y Manuales
Documentación para el usuario y futuros desarrolladores.

*   **`INSTRUCCIONES_COPIAR.md`**: Guía rápida de 5 pasos para duplicar esta carpeta y crear una guía nueva.
*   **`DOCUMENTACION.md`**: Documentación técnica detallada sobre la arquitectura y el sistema de renderizado.
*   **`README.md`**: (Este archivo) El mapa general del proyecto.

## 🎨 Recursos de Marca
*   **`assets/img/Logo...`**: Los logotipos oficiales del canal en formato normal y transparente.

---
*Organizado por Antigravity para "Español Para Todos".*
