/**
 * main.js — Español Para Todos
 * Motor de renderizado de fichas desde contenido.json.
 * No modificar para crear nuevas guías — edita solo contenido.json.
 */

// =============================================
// Configuración visual por categoría PCIC
// =============================================
const CATEGORIA = {
    'Funciones': {
        gradient: 'card-gradient-1', badge: 'text-indigo-600 dark:text-indigo-400',
        bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-800', icono: 'fas fa-comments'
    },
    'Gramática': {
        gradient: 'card-gradient-2', badge: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800', icono: 'fas fa-book'
    },
    'Ortografía': {
        gradient: 'card-gradient-3', badge: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800', icono: 'fas fa-pen'
    },
    'Pronunciación y prosodia': {
        gradient: 'card-gradient-4', badge: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-100 dark:border-rose-800', icono: 'fas fa-volume-up'
    },
    'Nociones generales': {
        gradient: 'card-gradient-1', badge: 'text-indigo-600 dark:text-indigo-400',
        bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-800', icono: 'fas fa-lightbulb'
    },
    'Nociones específicas': {
        gradient: 'card-gradient-2', badge: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800', icono: 'fas fa-tag'
    },
    'Tácticas y estrategias pragmáticas': {
        gradient: 'card-gradient-3', badge: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800', icono: 'fas fa-chess'
    },
    'Géneros discursivos y productos textuales': {
        gradient: 'card-gradient-4', badge: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-100 dark:border-rose-800', icono: 'fas fa-file-alt'
    },
    'Objetivos generales': {
        gradient: 'card-gradient-3', badge: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800', icono: 'fas fa-globe'
    }
};

const DEFAULT_CFG = CATEGORIA['Funciones'];

// =============================================
// Estado Global
// =============================================
let baseData    = null;
let transData   = null;
let currentLang = 'es';

// =============================================
// Etiquetas de UI por idioma
// =============================================
const LABELS = {
    es: { vocabulario: 'Vocabulario útil:', consejo_a1: 'Consejo para A1:',   ejemplo_completo: 'Ejemplo completo:',  progreso: 'fichas', loading: 'Cargando traducción…', nivel: 'Nivel A1', touch_hint: 'Selecciona tu idioma y luego toca cualquier texto para ver la traducción' },
    en: { vocabulario: 'Useful vocabulary:', consejo_a1: 'Tip for A1:',        ejemplo_completo: 'Full example:',       progreso: 'cards',  loading: 'Loading translation…', nivel: 'Level A1', touch_hint: 'Select your language and then touch any text to see the translation' },
    fr: { vocabulario: 'Vocabulaire utile :', consejo_a1: 'Conseil pour A1 :', ejemplo_completo: 'Exemple complet :',  progreso: 'fiches', loading: 'Chargement de la traduction…', nivel: 'Niveau A1', touch_hint: 'Sélectionne ta langue puis touche n\'importe quel texte pour voir la traduction' },
    pt: { vocabulario: 'Vocabulário útil:', consejo_a1: 'Conselho para A1:',   ejemplo_completo: 'Exemplo completo:',  progreso: 'fichas', loading: 'Carregando tradução…', nivel: 'Nível A1', touch_hint: 'Selecione seu idioma e toque em qualquer texto para ver a tradução' },
    de: { vocabulario: 'Nützliches Vokabular:', consejo_a1: 'Tipp für A1:',    ejemplo_completo: 'Vollständiges Beispiel:', progreso: 'Karten', loading: 'Übersetzung wird geladen…', nivel: 'Niveau A1', touch_hint: 'Wähle deine Sprache und tippe auf einen Text, um die Übersetzung zu sehen' }
};

// Banderas CDN para cada idioma del hint
const HINT_FLAGS = {
    es: 'https://flagcdn.com/w40/es.png',
    en: 'https://flagcdn.com/w40/gb.png',
    fr: 'https://flagcdn.com/w40/fr.png',
    pt: 'https://flagcdn.com/w40/br.png',
    de: 'https://flagcdn.com/w40/de.png'
};

// =============================================
// TTS — Síntesis de voz (español latino neutro)
// =============================================
let ttsVoice = null;

function initTTS() {
    if (!('speechSynthesis' in window)) return;

    const selectVoice = () => {
        const voices = speechSynthesis.getVoices();
        if (!voices.length) return;

        // Filtrar solo voces en español latinoamericano (excluir es-ES)
        const latamVoices = voices.filter(v => v.lang.startsWith('es-') && v.lang !== 'es-ES' && v.lang !== 'es_ES');

        // 1. Priorizar voces de alta calidad (Google, Premium, Online)
        let bestVoice = latamVoices.find(v => 
            v.name.includes('Google') || 
            v.name.includes('Premium') || 
            v.name.includes('Online')
        );

        // 2. Si no hay de alta calidad, usar prioridad regional neutra
        if (!bestVoice) {
            const priority = ['es-MX', 'es-US', 'es-419', 'es-AR', 'es-CO', 'es-CL', 'es-PE'];
            for (const lang of priority) {
                bestVoice = latamVoices.find(v => v.lang === lang);
                if (bestVoice) break;
            }
        }

        // 3. Fallback a cualquier voz latina disponible
        ttsVoice = bestVoice || latamVoices[0] || null;
    };

    selectVoice();
    speechSynthesis.addEventListener('voiceschanged', selectVoice);
}

function stripHtml(html) {
    return html.replace(/<[^>]+>/g, '').trim();
}

function speakText(text, btn) {
    if (!('speechSynthesis' in window)) return;
    const clean = stripHtml(text);
    if (!clean) return;

    speechSynthesis.cancel();

    const utt = new SpeechSynthesisUtterance(clean);
    utt.lang  = 'es-MX';
    utt.rate  = 0.95;   // Ajustado para evitar distorsión robótica
    utt.pitch = 1.0;
    if (ttsVoice) utt.voice = ttsVoice;

    if (btn) {
        btn.classList.add('speaking');
        utt.onend  = () => btn.classList.remove('speaking');
        utt.onerror = () => btn.classList.remove('speaking');
    }
    speechSynthesis.speak(utt);
}

function makeSpeakBtn(rawText) {
    const clean = stripHtml(rawText);
    if (!clean) return '';
    const safe = clean.replace(/"/g, '&quot;');
    return `<button class="speak-btn" data-tts="${safe}" aria-label="Escuchar: ${safe}" title="Escuchar pronunciación"><i class="fas fa-volume-up" aria-hidden="true"></i></button>`;
}

// =============================================
// TOAST — Reemplaza alert() con UX no bloqueante
// =============================================
let toastTimer = null;

function showToast(message, type = 'info', duration = 3500) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    // Limpiar clases previas
    toast.className = '';
    toast.textContent = message;
    toast.classList.add(`toast-${type}`, 'visible');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('visible');
    }, duration);
}

// =============================================
// Utilidad: Renderizar Ghost Text accesible
// =============================================
function renderTexto(texto, textoTraducido, isInline = false) {
    if (!textoTraducido || texto === textoTraducido) return texto;

    const containerClass = isInline ? 'inline-grid' : 'grid';
    // Accesibilidad: role="button", tabindex, aria-label y soporte de teclado
    return `
        <span class="ghost-container ${containerClass}"
              role="button"
              tabindex="0"
              aria-label="Toca para ver la traducción"
              onclick="this.classList.toggle('touch-active')"
              onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.classList.toggle('touch-active');}">
            <span class="ghost-original" aria-hidden="false">${texto}</span>
            <span class="ghost-translation" aria-hidden="true">${textoTraducido}</span>
        </span>
    `;
}

// =============================================
// Renderizado de ejemplos según formato
// =============================================
function renderEjemplos(ejemplos, cfg, ejemplosTrans) {
    const { formato, items } = ejemplos;
    const itemsTrans = ejemplosTrans ? ejemplosTrans.items : null;

    switch (formato) {
        case 'lista':
            return `<div class="${cfg.bg} p-4 rounded-2xl mb-4 border ${cfg.border} space-y-2 text-base">
                ${items.map((i, idx) => `
                    <div class="flex gap-2 items-start">
                        <span class="flex-shrink-0 mt-0.5" aria-hidden="true">•</span>
                        <span class="flex-1">${renderTexto(i, itemsTrans ? itemsTrans[idx] : null, true)}</span>
                        ${makeSpeakBtn(i)}
                    </div>
                `).join('')}
            </div>`;

        case 'dialogo':
            return `<div class="${cfg.bg} p-4 rounded-2xl mb-4 border ${cfg.border} space-y-2 text-base">
                ${items.map((i, idx) => {
                    const trans = itemsTrans ? itemsTrans[idx] : null;
                    return `
                    <div class="space-y-1">
                        <p class="text-slate-500 dark:text-slate-400 italic flex items-center gap-1">
                            <span>— ${renderTexto(i.pregunta, trans ? trans.pregunta : null, true)}</span>
                            ${makeSpeakBtn(i.pregunta)}
                        </p>
                        <p class="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                            <span>→ ${renderTexto(i.respuesta, trans ? trans.respuesta : null, true)}</span>
                            ${makeSpeakBtn(i.respuesta)}
                        </p>
                    </div>`;
                }).join('<hr class="border-white/30">')}
            </div>`;

        case 'grid':
            return `<div class="grid grid-cols-2 gap-2 mb-4">
                ${items.map((i, idx) =>
                    `<div class="${cfg.bg} p-2 rounded-xl text-center text-sm font-bold border ${cfg.border}">${renderTexto(i, itemsTrans ? itemsTrans[idx] : null, false)}</div>`
                ).join('')}
            </div>`;

        default:
            return `<div class="${cfg.bg} p-4 rounded-2xl mb-4 border ${cfg.border} space-y-2 text-base">
                ${items.map((i, idx) => `<p>• ${renderTexto(i, itemsTrans ? itemsTrans[idx] : null, true)}</p>`).join('')}
            </div>`;
    }
}

// =============================================
// Construir una ficha
// =============================================
function buildFicha(ficha, index, fichaTrans) {
    const cfg = CATEGORIA[ficha.categoria] || DEFAULT_CFG;
    const labelCategoria = renderTexto(ficha.categoria, fichaTrans ? fichaTrans.categoria : null, true);
    const label = `${ficha.id}. ${labelCategoria}`;
    const labels = LABELS[currentLang] || LABELS.es;

    const vocabularioHtml = ficha.vocabulario_util ?
        `<div class="mb-4 px-3 py-2 rounded-xl text-sm ${cfg.bg} border ${cfg.border}">
            <strong class="${cfg.badge} block mb-1">${labels.vocabulario}</strong>
            <div class="leading-relaxed">
                ${renderTexto(ficha.vocabulario_util, fichaTrans ? fichaTrans.vocabulario_util : null, false)}
            </div>
        </div>` : '';

    return `
        <section class="ficha-card glass-effect rounded-3xl overflow-hidden shadow-lg border border-white/40 visible"
                 style="display: flex;"
                 aria-label="Ficha ${ficha.id}: ${ficha.tema}">
            <div class="p-1 ${cfg.gradient}" aria-hidden="true"></div>
            <div class="p-6 md:p-8">
                <span class="text-xs font-bold uppercase tracking-widest ${cfg.badge} mb-2 block">${label}</span>
                <h2 class="text-2xl font-bold mb-2 text-slate-800 dark:text-white">${renderTexto(ficha.tema, fichaTrans ? fichaTrans.tema : null, false)}</h2>
                <p class="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed text-base">${renderTexto(ficha.explicacion, fichaTrans ? fichaTrans.explicacion : null, false)}</p>
                ${renderEjemplos(ficha.ejemplos, cfg, fichaTrans ? fichaTrans.ejemplos : null)}
                ${vocabularioHtml}
                <div class="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <p class="text-sm text-indigo-500 dark:text-indigo-400 font-semibold">
                        <i class="fas fa-lightbulb mr-1" aria-hidden="true"></i>
                        ${renderTexto(ficha.consejo, fichaTrans ? fichaTrans.consejo : null, true)}
                    </p>
                </div>
            </div>
        </section>`;
}

// =============================================
// Construir la ficha resumen (última card)
// =============================================
function buildResumen(resumen, resumenTrans) {
    const pasos = resumen.pasos.map((p, i) => {
        const transP = resumenTrans ? resumenTrans.pasos[i] : null;
        return `<li>
            ${renderTexto(p.texto, transP ? transP.texto : null, true)}
            <span class="${p.color} font-bold">${renderTexto(p.ejemplo, transP ? transP.ejemplo : null, true)}</span>
        </li>`;
    }).join('');

    const tituloOriginal = resumen.titulo.replace(' a una', '<br><span class="text-indigo-600"> a una</span>');
    const tituloHtml     = renderTexto(tituloOriginal, resumenTrans ? resumenTrans.titulo : null, false);
    const labels         = LABELS[currentLang] || LABELS.es;

    return `
        <section class="ficha-card glass-effect rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl border border-white/40 md:col-span-2 lg:col-span-3 visible"
                 style="display: flex;"
                 aria-label="Resumen: cómo describir a una persona">
            <div class="p-2 bg-gradient-to-r from-indigo-500 via-emerald-500 to-amber-500" aria-hidden="true"></div>
            <div class="p-8 md:p-16 flex flex-col lg:flex-row items-center gap-10">
                <div class="lg:w-1/2">
                    <h2 class="text-3xl md:text-5xl font-black mb-6 leading-tight">
                        ${tituloHtml}
                    </h2>
                    <p class="mb-6 text-slate-500 italic">${renderTexto(resumen.intro, resumenTrans ? resumenTrans.intro : null, false)}</p>
                    <ol class="space-y-4 text-slate-700 list-decimal list-inside font-medium text-sm md:text-base">
                        ${pasos}
                    </ol>
                    <div class="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-xs md:text-sm">
                        <p class="font-bold text-amber-800 mb-1">💡 ${labels.consejo_a1}</p>
                        <p>${renderTexto(resumen.consejo, resumenTrans ? resumenTrans.consejo : null, false)}</p>
                    </div>
                </div>
                <div class="lg:w-1/2 bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
                    <p class="text-indigo-400 font-bold text-xs mb-4 uppercase tracking-widest">${labels.ejemplo_completo}</p>
                    <p class="italic text-xl md:text-2xl leading-relaxed">${renderTexto(resumen.ejemplo_completo, resumenTrans ? resumenTrans.ejemplo_completo : null, false)}</p>
                </div>
            </div>
        </section>`;
}

// =============================================
// Barra de progreso de fichas
// =============================================
function updateProgress(total) {
    const wrap  = document.getElementById('progress-wrap');
    const fill  = document.getElementById('progress-fill');
    const label = document.getElementById('progress-label');
    const aria  = document.getElementById('progress-bar-aria');
    if (!wrap || !fill) return;

    const labels = LABELS[currentLang] || LABELS.es;
    wrap.classList.remove('hidden');
    label.textContent = `${total} ${labels.progreso}`;
    // Animar al 100% para indicar que cargó todo
    requestAnimationFrame(() => {
        fill.style.width = '100%';
        aria.setAttribute('aria-valuenow', '100');
    });
}

// =============================================
// Pista táctil (solo móvil, solo si hay traducción activa)
// =============================================
let hintInterval = null;
let hintLangs = ['en', 'fr', 'pt', 'de', 'es'];
let hintLangIndex = 0;

function updateTouchHint() {
    const hint = document.getElementById('touch-hint');
    if (!hint) return;
    
    // Limpiar intervalo previo si existe
    if (hintInterval) {
        clearInterval(hintInterval);
        hintInterval = null;
    }

    // Siempre mostrar el hint, rotando entre todos los idiomas
    hint.classList.add('active');
    
    const rotateHint = () => {
        const lang = hintLangs[hintLangIndex];
        const flagUrl = HINT_FLAGS[lang];
        const text = LABELS[lang].touch_hint;
        hint.innerHTML = `<img src="${flagUrl}" alt="" aria-hidden="true" style="width:20px;height:20px;border-radius:50%;object-fit:cover;flex-shrink:0;"> <span>${text}</span>`;
        hintLangIndex = (hintLangIndex + 1) % hintLangs.length;
    };
    
    rotateHint(); // Ejecutar inmediatamente
    hintInterval = setInterval(rotateHint, 2500); // Cambiar cada 2.5 segundos
}

// =============================================
// Animación de entrada de las tarjetas
// =============================================
function animarFichas() {
    const cards = document.querySelectorAll('.ficha-card');
    cards.forEach((card, index) => {
        card.style.display = 'flex';
        setTimeout(() => card.classList.add('visible'), index * 120);
    });
}

// =============================================
// Renderizado Principal
// =============================================
function renderAll() {
    if (!baseData) return;

    const { meta, fichas, resumen } = baseData;
    const metaTrans    = transData ? transData.meta    : null;
    const fichasTrans  = transData ? transData.fichas  : null;
    const resumenTrans = transData ? transData.resumen : null;

    // Título de página (SEO: el estático ya está en HTML; este es para experiencia dinámica)
    document.title = metaTrans && metaTrans.titulo_pagina
        ? metaTrans.titulo_pagina
        : meta.titulo_pagina;

    // Actualizar atributo lang del documento para lectores de pantalla
    document.documentElement.lang = currentLang;

    // Hero
    document.getElementById('hero-title').innerHTML = renderTexto(
        meta.titulo_hero.replace(' a las', '<br><span class="text-indigo-200"> a las</span>'),
        metaTrans ? metaTrans.titulo_hero : null,
        false
    );
    document.getElementById('objetivo').innerHTML = renderTexto(
        meta.objetivo, metaTrans ? metaTrans.objetivo : null, false
    );
    
    // Actualizar el badge de Nivel
    const badge = document.getElementById('nivel-badge');
    if (badge) badge.textContent = (LABELS[currentLang] || LABELS.es).nivel;

    document.getElementById('video-label').innerHTML = renderTexto(
        meta.video_label, metaTrans ? metaTrans.video_label : null, true
    );

    // Footer: sincronizado con JSON (no más texto hardcodeado en HTML)
    const footerTitulo = document.getElementById('footer-titulo');
    if (footerTitulo) {
        footerTitulo.textContent = meta.titulo_pagina || '';
    }

    // Renderizar fichas
    const grid = document.getElementById('fichasGrid');
    grid.classList.remove('loading');
    grid.innerHTML = fichas.map((f, i) =>
        buildFicha(f, i, fichasTrans ? fichasTrans[i] : null)
    ).join('') + (resumen ? buildResumen(resumen, resumenTrans) : '');

    animarFichas();
    updateProgress(fichas.length + (resumen ? 1 : 0));
    updateTouchHint();

    // Actualizar aria-pressed de los botones de idioma
    document.querySelectorAll('.lang-btn').forEach(b => {
        b.setAttribute('aria-pressed', b.getAttribute('data-lang') === currentLang ? 'true' : 'false');
    });
}

// =============================================
// Inicialización
// =============================================
async function init() {
    try {
        const res = await fetch('data/contenido.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        baseData = await res.json();

        document.getElementById('video-link').href = baseData.meta.video_url;
        renderAll();
        setupLanguageSelector();

    } catch (err) {
        console.error('Error cargando contenido.json:', err);
        showToast('Error al cargar el contenido. Recarga la página.', 'error', 6000);
    }
}

// =============================================
// Selector de Idiomas
// =============================================
function setupLanguageSelector() {
    const btns = document.querySelectorAll('.lang-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const lang = btn.getAttribute('data-lang');
            if (lang === currentLang) return; // evitar re-carga innecesaria

            // UI: activar botón seleccionado
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLang = lang;

            if (lang === 'es') {
                transData = null;
                renderAll();
                return;
            }

            // Feedback visual de carga
            const grid = document.getElementById('fichasGrid');
            grid.classList.add('loading');
            const labels = LABELS[lang] || LABELS.es;
            if (lang !== 'es') {
                showToast(labels.loading, 'info', 8000);
            }
            try {
                const res = await fetch(`data/contenido_${lang}.json`);
                if (res.ok) {
                    transData = await res.json();
                } else {
                    transData = null;
                    showToast('Traducción no disponible para este idioma.', 'error');
                }
            } catch (err) {
                console.error('Error cargando traducción:', err);
                transData = null;
                showToast('Error de red al cargar la traducción.', 'error');
            }

            renderAll();
        });
    });
}

// =============================================
// Botón Scroll to Top
// =============================================
function setupScrollButton() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
        scrollBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// =============================================
// Delegación de eventos para botones de audio
// =============================================
function setupSpeakButtons() {
    document.getElementById('fichasGrid').addEventListener('click', (e) => {
        const btn = e.target.closest('.speak-btn');
        if (!btn) return;
        speakText(btn.dataset.tts, btn);
    });
}

// =============================================
// Lógica Modo Noche (Dark Mode)
// =============================================
function setupThemeToggle() {
    const btn = document.getElementById('themeToggleBtn');
    const icon = document.getElementById('themeIcon');
    if (!btn || !icon) return;

    // Verificar preferencia guardada
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    btn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });
}

// =============================================
// Arrancar — todo dentro de DOMContentLoaded
// =============================================
window.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupScrollButton();
    initTTS();
    init().then(() => setupSpeakButtons());
});
