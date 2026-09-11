/* ============================================================
   GOLDQUEST PLANNER - LÓGICA PRINCIPAL
   ============================================================ */

// ============================================================
// STATE MANAGEMENT
// ============================================================
const AppState = {
    targetGold: 0,
    startDate: null,
    endDate: null,
    totalDays: 0,
    initialDailyRate: 0,
    goldPerHour: 30000,
    daysMap: {},
    selectedDateKey: null,

    goldPriceRate: 4.1,
    goldPriceBase: 100000,
    customQuoteGoldQuery: 100000,
    customQuoteUsdQuery: 10.00,
    chartZoom: 1.0,

    fracBaseVal: 100.0000,
    fracOperator: 'sub',
    fracPercentage: 20.00,
    fracDivisor: 3,
    calculatorHistory: [],

    exRateBcv: 36.50,
    exRateCustom: 44.20,
    convUsdAmount: 10.00,
    convBsAmount: 100.00,

    subStartDate: new Date(),
    subDuration: 30,

    selectedFont: "'Inter', sans-serif",

    calendarMonth: 0,
    calendarYear: 0,

    formatKey(dateObj) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    parseLocalDate(dateStr) {
        if (!dateStr) return null;
        const parts = dateStr.split('-');
        if (parts.length !== 3) return null;
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
};

// ============================================================
// REFERENCIAS DOM
// ============================================================
const goalForm = document.getElementById('goal-form');
const inputGoldTarget = document.getElementById('gold-target');
const inputStartDate = document.getElementById('start-date');
const inputEndDate = document.getElementById('end-date');

const emptyState = document.getElementById('empty-state');
const resultsDashboard = document.getElementById('results-dashboard');

const metricTotalGold = document.getElementById('metric-total-gold');
const metricCurrentGold = document.getElementById('metric-current-gold');
const metricRemainingGold = document.getElementById('metric-remaining-gold');
const metricDailyGold = document.getElementById('metric-daily-gold');
const metricAdjustedDaily = document.getElementById('metric-adjusted-daily');
const metricDurationText = document.getElementById('metric-duration-text');
const metricPercentageDone = document.getElementById('metric-percentage-done');
const metricProgressBar = document.getElementById('metric-progress-bar');

const metricTotalUSD = document.getElementById('metric-total-usd');
const metricCurrentUSD = document.getElementById('metric-current-usd');
const metricRemainingUSD = document.getElementById('metric-remaining-usd');
const metricDailyUSD = document.getElementById('metric-daily-usd');

const inputGoldPriceRate = document.getElementById('gold-price-rate');
const inputGoldPriceBase = document.getElementById('gold-price-base');
const labelValuationRate = document.getElementById('valuation-rate-label');
const labelValuationTotalUSD = document.getElementById('valuation-total-usd');

const inputCustomQuoteGold = document.getElementById('custom-quote-gold-input');
const labelCustomQuoteUsdResult = document.getElementById('custom-quote-usd-result');

const inputCustomQuoteUsd = document.getElementById('custom-quote-usd-input');
const labelCustomQuoteGoldResult = document.getElementById('custom-quote-gold-result');

const inputFracBaseVal = document.getElementById('frac-base-val');
const selectFracOperator = document.getElementById('frac-operator');
const inputFracPercentage = document.getElementById('frac-percentage');
const selectFracDivisor = document.getElementById('frac-divisor');
const labelFracResult = document.getElementById('frac-result-label');
const labelFracRemaining100 = document.getElementById('frac-remaining-100');
const labelFracRemainingDiv = document.getElementById('frac-remaining-div');

const inputExRateBcv = document.getElementById('ex-rate-bcv');
const inputExRateCustom = document.getElementById('ex-rate-custom');
const inputConvUsd = document.getElementById('conv-usd-input');
const inputConvBs = document.getElementById('conv-bs-input');

const resBcvBs = document.getElementById('conv-res-bcv-bs');
const resCustomBs = document.getElementById('conv-res-custom-bs');
const resBcvUsd = document.getElementById('conv-res-bcv-usd');
const resCustomUsd = document.getElementById('conv-res-custom-usd');

const calcScreen = document.getElementById('calc-screen');
const calcPreview = document.getElementById('calc-preview');
const toggleCalcHistory = document.getElementById('toggle-calc-history');
const calcHistoryPanel = document.getElementById('calc-history-panel');
const calcHistoryList = document.getElementById('calc-history-list');
const clearCalcHistory = document.getElementById('clear-calc-history');

const inputSubStartDate = document.getElementById('sub-start-date');
const inputSubDuration = document.getElementById('sub-duration');
const labelSubCountdown = document.getElementById('subscription-countdown');
const subProgressBar = document.getElementById('subscription-progress-bar');
const subAlertText = document.getElementById('subscription-alert-text');
const setReminderBtn = document.getElementById('set-reminder-btn');

const exportJsonBtn = document.getElementById('export-json-btn');
const importTriggerBtn = document.getElementById('import-trigger-btn');
const importJsonFile = document.getElementById('import-json-file');

const downloadAllBtn = document.getElementById('download-all-btn');
const downloadSection = document.getElementById('download-section');

const calendarMonthYear = document.getElementById('calendar-month-year');
const calendarDaysGrid = document.getElementById('calendar-days-grid');
const dailyRowsContainer = document.getElementById('daily-rows-container');
const resetProgressBtn = document.getElementById('reset-progress-btn');
const calendarPrevMonth = document.getElementById('calendar-prev-month');
const calendarNextMonth = document.getElementById('calendar-next-month');

const inputGoldPerHour = document.getElementById('gold-per-hour');
const timeDailyInitial = document.getElementById('time-daily-initial');
const timeDailyAdjusted = document.getElementById('time-daily-adjusted');
const timeTotalRemaining = document.getElementById('time-total-remaining');

const fontSelect = document.getElementById('font-select');

const dayModal = document.getElementById('day-modal');
const dayModalBox = document.getElementById('day-modal-box');
const modalDateDisplay = document.getElementById('modal-date-display');
const modalSuggestedGold = document.getElementById('modal-suggested-gold');
const modalInputGold = document.getElementById('modal-input-gold');
const modalCheckCompleted = document.getElementById('modal-check-completed');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalBtnCancel = document.getElementById('modal-btn-cancel');
const modalBtnSave = document.getElementById('modal-btn-save');

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIconLight = document.getElementById('theme-icon-light');
const themeIconDark = document.getElementById('theme-icon-dark');
const themeText = document.getElementById('theme-text');

const statsBestDayGold = document.getElementById('stats-best-day-gold');
const statsBestDayDate = document.getElementById('stats-best-day-date');
const statsAvgDayGold = document.getElementById('stats-avg-day-gold');
const statsCompletedDaysCount = document.getElementById('stats-completed-days-count');
const statsConsistencyPercent = document.getElementById('stats-consistency-percent');
const statsConsistencyStatus = document.getElementById('stats-consistency-status');
const statsEfficiencyPercent = document.getElementById('stats-efficiency-percent');
const statsEfficiencyStatus = document.getElementById('stats-efficiency-status');
const analysisTrend = document.getElementById('analysis-trend');
const analysisTrendDetail = document.getElementById('analysis-trend-detail');
const analysisStdDev = document.getElementById('analysis-std-dev');
const analysisStdDetail = document.getElementById('analysis-std-detail');
const analysisProjectionDays = document.getElementById('analysis-projection-days');
const analysisProjectionDetail = document.getElementById('analysis-projection-detail');
const chartContainer = document.getElementById('chart-container');

const projectionDay1Label = document.getElementById('projection-day1-label');
const projectionDay1Gold = document.getElementById('projection-day1-gold');
const projectionDay1Usd = document.getElementById('projection-day1-usd');
const projectionDay2Label = document.getElementById('projection-day2-label');
const projectionDay2Gold = document.getElementById('projection-day2-gold');
const projectionDay2Usd = document.getElementById('projection-day2-usd');

const btnZoomIn = document.getElementById('btn-zoom-in');
const btnZoomOut = document.getElementById('btn-zoom-out');
const zoomSlider = document.getElementById('zoom-slider');
const zoomLevelLabel = document.getElementById('zoom-level-label');

// ============================================================
// INICIALIZACIÓN
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const defaultStartStr = AppState.formatKey(today);
    const tenDaysLater = new Date(today);
    tenDaysLater.setDate(today.getDate() + 10);
    const defaultEndStr = AppState.formatKey(tenDaysLater);

    inputStartDate.value = defaultStartStr;
    inputEndDate.value = defaultEndStr;

    inputSubStartDate.value = defaultStartStr;
    inputSubDuration.value = 30;

    AppState.calendarMonth = today.getMonth();
    AppState.calendarYear = today.getFullYear();

    inputGoldPerHour.addEventListener('input', (e) => {
        let val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val > 0) {
            AppState.goldPerHour = val;
            recalculateTimeMetrics();
            saveStateToLocalStorage();
        }
    });

    inputGoldPriceRate.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= 0) {
            AppState.goldPriceRate = val;
            if (AppState.startDate) recalculatePlan();
            updateCustomQuoteUI();
            saveStateToLocalStorage();
        }
    });
    inputGoldPriceBase.addEventListener('input', (e) => {
        let val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val > 0) {
            AppState.goldPriceBase = val;
            if (AppState.startDate) recalculatePlan();
            updateCustomQuoteUI();
            saveStateToLocalStorage();
        }
    });

    inputCustomQuoteGold.addEventListener('input', (e) => {
        let val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 0) {
            AppState.customQuoteGoldQuery = val;
            updateCustomQuoteUI();
            saveStateToLocalStorage();
        }
    });

    inputCustomQuoteUsd.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= 0) {
            AppState.customQuoteUsdQuery = val;
            updateCustomQuoteUI();
            saveStateToLocalStorage();
        }
    });

    inputFracBaseVal.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value);
        if (!isNaN(val)) {
            AppState.fracBaseVal = val;
            recalculateFractioningFormula();
            saveStateToLocalStorage();
        }
    });
    selectFracOperator.addEventListener('change', (e) => {
        AppState.fracOperator = e.target.value;
        recalculateFractioningFormula();
        saveStateToLocalStorage();
    });
    inputFracPercentage.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= 0) {
            AppState.fracPercentage = val;
            recalculateFractioningFormula();
            saveStateToLocalStorage();
        }
    });
    selectFracDivisor.addEventListener('change', (e) => {
        AppState.fracDivisor = parseInt(e.target.value, 10);
        recalculateFractioningFormula();
        saveStateToLocalStorage();
    });

    document.querySelectorAll('.pct-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const pct = parseInt(btn.dataset.pct, 10);
            inputFracPercentage.value = pct;
            AppState.fracPercentage = pct;
            recalculateFractioningFormula();
            saveStateToLocalStorage();

            document.querySelectorAll('.pct-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    inputExRateBcv.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value);
        if (!isNaN(val) && val > 0) {
            AppState.exRateBcv = val;
            recalculateConversions();
            saveStateToLocalStorage();
        }
    });
    inputExRateCustom.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value);
        if (!isNaN(val) && val > 0) {
            AppState.exRateCustom = val;
            recalculateConversions();
            saveStateToLocalStorage();
        }
    });
    inputConvUsd.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= 0) {
            AppState.convUsdAmount = val;
            recalculateConversions();
            saveStateToLocalStorage();
        }
    });
    inputConvBs.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= 0) {
            AppState.convBsAmount = val;
            recalculateConversions();
            saveStateToLocalStorage();
        }
    });

    inputSubStartDate.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val) {
            AppState.subStartDate = AppState.parseLocalDate(val) || new Date();
            updateSubscriptionUI();
            saveStateToLocalStorage();
        }
    });

    inputSubDuration.addEventListener('input', (e) => {
        let val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val > 0) {
            AppState.subDuration = val;
            updateSubscriptionUI();
            saveStateToLocalStorage();
        }
    });

    btnZoomIn.addEventListener('click', () => {
        let z = Math.min(4.0, AppState.chartZoom + 0.25);
        updateZoom(z);
    });

    btnZoomOut.addEventListener('click', () => {
        let z = Math.max(1.0, AppState.chartZoom - 0.25);
        updateZoom(z);
    });

    zoomSlider.addEventListener('input', (e) => {
        let z = parseFloat(e.target.value);
        updateZoom(z);
    });

    calendarPrevMonth.addEventListener('click', () => {
        AppState.calendarMonth--;
        if (AppState.calendarMonth < 0) {
            AppState.calendarMonth = 11;
            AppState.calendarYear--;
        }
        renderCalendarView();
        saveStateToLocalStorage();
    });

    calendarNextMonth.addEventListener('click', () => {
        AppState.calendarMonth++;
        if (AppState.calendarMonth > 11) {
            AppState.calendarMonth = 0;
            AppState.calendarYear++;
        }
        renderCalendarView();
        saveStateToLocalStorage();
    });

    themeToggleBtn.addEventListener('click', toggleThemeMode);

    fontSelect.addEventListener('change', (e) => {
        changePageFont(e.target.value);
    });

    initializeExpressCalculator();

    exportJsonBtn.addEventListener('click', exportStateToJSON);
    importTriggerBtn.addEventListener('click', () => importJsonFile.click());
    importJsonFile.addEventListener('change', handleJSONImport);

    setReminderBtn.addEventListener('click', setHybridReminder);

    // Detectar móvil y ocultar botón de descarga
    detectMobileAndHideDownload();

    // Botón de descarga de 3 archivos
    downloadAllBtn.addEventListener('click', downloadAllFiles);

    initializeTheme();
    verifyLocalStoragePersistence();
    loadStateFromLocalStorage();
    recalculateTimeMetrics();

    initializeQRModule();
});

// ============================================================
// DETECCIÓN DE MÓVIL PARA OCULTAR BOTÓN DE DESCARGA
// ============================================================
function detectMobileAndHideDownload() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || ('ontouchstart' in window && window.innerWidth <= 1024)
        || window.innerWidth <= 768;

    if (isMobile && downloadSection) {
        downloadSection.style.display = 'none';
    } else if (downloadSection) {
        downloadSection.style.display = '';
    }
}

// ============================================================
// DESCARGA DE LOS 3 ARCHIVOS (index.html, styles.css, app.js)
// ============================================================
function downloadAllFiles() {
    // ---------- 1. Recolectar HTML actual ----------
    const doctypeString = "<!DOCTYPE html>\n";
    const htmlContent = doctypeString + document.documentElement.outerHTML;

    // ---------- 2. Recolectar CSS ----------
    let cssContent = '';
    const cssLink = document.querySelector('link[href="styles.css"]');
    if (cssLink) {
        // Si estamos en GitHub Pages, intentamos leer el archivo
        fetch('styles.css')
            .then(r => r.ok ? r.text() : Promise.reject('no disponible'))
            .then(text => {
                cssContent = text;
            })
            .catch(() => {
                cssContent = '/* No se pudo obtener styles.css automáticamente. Copia el contenido manualmente. */';
            })
            .finally(() => {
                ejecutarDescargas(htmlContent, cssContent || getFallbackCSS(), getFallbackJS());
            });
    } else {
        ejecutarDescargas(htmlContent, getFallbackCSS(), getFallbackJS());
    }
}

function ejecutarDescargas(htmlContent, cssContent, jsContent) {
    try {
        descargarArchivo('index.html', htmlContent, 'text/html;charset=utf-8');
        setTimeout(() => descargarArchivo('styles.css', cssContent, 'text/css;charset=utf-8'), 300);
        setTimeout(() => descargarArchivo('app.js', jsContent, 'application/javascript;charset=utf-8'), 600);

        showToast("📦 Descargando 3 archivos: index.html, styles.css y app.js");
    } catch (error) {
        console.error("Error al descargar archivos:", error);
        showToast("❌ Error al descargar. Revisa la consola.");
    }
}

function descargarArchivo(nombre, contenido, tipoMIME) {
    const blob = new Blob([contenido], { type: tipoMIME });
    const blobURL = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = blobURL;
    anchor.download = nombre;
    document.body.appendChild(anchor);
    anchor.click();
    setTimeout(() => {
        document.body.removeChild(anchor);
        URL.revokeObjectURL(blobURL);
    }, 200);
}

// ---------- Fallback: si el fetch del CSS/JS falla, usamos contenido mínimo ----------
function getFallbackCSS() {
    return `/* styles.css - Si ves esto, reemplaza con el contenido completo de tu styles.css */
/* El archivo original no se pudo leer automáticamente. */`;
}

function getFallbackJS() {
    return `/* app.js - Si ves esto, reemplaza con el contenido completo de tu app.js */
/* El archivo original no se pudo leer automáticamente. */`;
}

// ============================================================
// FUNCIONES PRINCIPALES
// ============================================================
function updateZoom(zoomVal) {
    AppState.chartZoom = zoomVal;
    zoomSlider.value = zoomVal;
    zoomLevelLabel.textContent = `${zoomVal.toFixed(1)}x`;

    if (AppState.startDate) {
        const totalAccumulatedGoldEarned = Object.values(AppState.daysMap).reduce((acc, day) => acc + day.actualGold, 0);
        calculateAdvancedAnalytics(totalAccumulatedGoldEarned);
    }
    saveStateToLocalStorage();
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('goldquest_theme_preference') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIconLight.classList.remove('hidden');
        themeIconDark.classList.add('hidden');
        themeText.textContent = "Modo Claro";
    } else {
        document.body.classList.remove('light-theme');
        themeIconLight.classList.add('hidden');
        themeIconDark.classList.remove('hidden');
        themeText.textContent = "Modo Oscuro";
    }
}

function toggleThemeMode() {
    if (document.body.classList.contains('light-theme')) {
        document.body.classList.remove('light-theme');
        themeIconLight.classList.add('hidden');
        themeIconDark.classList.remove('hidden');
        themeText.textContent = "Modo Oscuro";
        localStorage.setItem('goldquest_theme_preference', 'dark');
    } else {
        document.body.classList.add('light-theme');
        themeIconLight.classList.remove('hidden');
        themeIconDark.classList.add('hidden');
        themeText.textContent = "Modo Claro";
        localStorage.setItem('goldquest_theme_preference', 'light');
    }
}

function changePageFont(fontFamily) {
    AppState.selectedFont = fontFamily;
    document.body.style.setProperty('--main-font', fontFamily);
    if (fontSelect) {
        fontSelect.value = fontFamily;
    }
    saveStateToLocalStorage();
}

// ============================================================
// RECORDATORIO HÍBRIDO
// ============================================================
function setHybridReminder() {
    if (!AppState.subStartDate) {
        showToast("Por favor define una fecha de inicio de suscripción.");
        return;
    }

    const warnDays = 5;
    const startDate = new Date(AppState.subStartDate);
    const expDate = new Date(startDate);
    expDate.setDate(expDate.getDate() + AppState.subDuration);

    const alertDate = new Date(expDate);
    alertDate.setDate(alertDate.getDate() - warnDays);

    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            createReminderNotification(alertDate, expDate);
        } else if (Notification.permission === 'denied') {
            showToast("Permiso de notificaciones denegado. Solo se agregará a Google Calendar.");
        } else {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    createReminderNotification(alertDate, expDate);
                }
            });
        }
    }

    const pad = (n) => String(n).padStart(2, '0');
    const formatGCalDate = (date) => {
        const y = date.getFullYear();
        const m = pad(date.getMonth() + 1);
        const d = pad(date.getDate());
        return `${y}${m}${d}`;
    };

    const eventStartDate = new Date(alertDate);
    eventStartDate.setHours(0, 0, 0, 0);
    const eventEndDate = new Date(expDate);
    eventEndDate.setHours(23, 59, 59, 999);

    const startStr = formatGCalDate(eventStartDate);
    const endStr = formatGCalDate(eventEndDate);

    const eventTitle = encodeURIComponent(`⚠️ ALERTA: Renovar tiempo de juego (MMORPG) - ${AppState.subDuration} días`);
    const eventDetails = encodeURIComponent(
        `Tu suscripción contratada de ${AppState.subDuration} días está por vencer.\n\n` +
        `📅 Fecha de Inicio: ${startDate.toLocaleDateString('es-ES')}\n` +
        `📅 Fecha de Vencimiento Final: ${expDate.toLocaleDateString('es-ES')}\n` +
        `⏰ Recordatorio activo desde 5 días antes (${alertDate.toLocaleDateString('es-ES')})\n\n` +
        `¡Compra tiempo de juego ahora para no interrumpir tu progreso en GoldQuest!`
    );
    const eventLocation = encodeURIComponent("GoldQuest MMORPG - Mundo Virtual");

    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startStr}/${endStr}&details=${eventDetails}&location=${eventLocation}&sf=true&output=xml`;

    window.open(gCalUrl, '_blank');

    const alertDateStr = alertDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    showToast(`✅ Recordatorio programado: Notificación + Google Calendar (desde ${alertDateStr})`);
}

function createReminderNotification(alertDate, expDate) {
    const alertDateStr = alertDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const title = "⚠️ ALERTA: Renovar tiempo de juego (MMORPG)";
    const body = `Tu suscripción contratada de ${AppState.subDuration} días expira en 5 días (${alertDateStr}).\n` +
                `Fecha de vencimiento final: ${expDate.toLocaleDateString('es-ES')}\n` +
                `¡Compra tiempo de juego ahora para no interrumpir tu progreso!`;

    try {
        const notification = new Notification(title, {
            body: body,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏰</text></svg>',
            silent: false,
            requireInteraction: true
        });

        notification.onclick = function() {
            window.focus();
            notification.close();
        };
    } catch (e) {
        console.log("Notificación no disponible:", e);
    }
}

// ============================================================
// VERIFICACIÓN DE CACHÉ
// ============================================================
function verifyLocalStoragePersistence() {
    try {
        const testKey = '__goldquest_cache_test__';
        const testValue = 'persistence_confirmed';

        localStorage.setItem(testKey, testValue);
        const fetchedValue = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);

        if (fetchedValue === testValue) {
            const badge = document.getElementById('cache-status-badge');
            badge.className = "flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm";
            badge.innerHTML = `<i class="fa-solid fa-shield-halved text-emerald-400 animate-pulse"></i> Caché: Verificada [OK]`;
            return true;
        }
    } catch (error) {
        console.error("Local storage verification failed:", error);
        const badge = document.getElementById('cache-status-badge');
        badge.className = "flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm";
        badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-rose-500"></i> Error de Memoria`;
        showToast("Advertencia: No se puede acceder a la caché local. El progreso se perderá al cerrar la pestaña.");
        return false;
    }
}

function updateAutosaveTimestamp() {
    const timeSpan = document.getElementById('last-saved-time');
    if (timeSpan) {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        timeSpan.textContent = `Autoguardado: ${hrs}:${mins}:${secs}`;
    }
}

// ============================================================
// VALIDACIÓN DE FECHAS
// ============================================================
inputStartDate.addEventListener('change', (e) => {
    inputEndDate.min = e.target.value;
});

// ============================================================
// UI COTIZACIÓN PERSONALIZADA
// ============================================================
function updateCustomQuoteUI() {
    const baseRate = AppState.goldPriceBase || 100000;
    const usdRate = AppState.goldPriceRate || 4.1;
    const customQueryGold = AppState.customQuoteGoldQuery || 0;
    const customQueryUsd = AppState.customQuoteUsdQuery || 0;

    const usdResultVal = (customQueryGold / baseRate) * usdRate;
    const goldResultVal = usdRate > 0 ? (customQueryUsd / usdRate) * baseRate : 0;

    const fmtUSD = (val) => `$${val.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const fmtGold = (val) => `${Math.round(val).toLocaleString('es-ES')}`;

    labelCustomQuoteUsdResult.textContent = fmtUSD(usdResultVal);
    labelCustomQuoteGoldResult.textContent = fmtGold(goldResultVal);
}

// ============================================================
// CÁLCULO DE MERMA
// ============================================================
function recalculateFractioningFormula() {
    const base = AppState.fracBaseVal;
    const op = AppState.fracOperator;
    const pct = AppState.fracPercentage;
    const divisor = AppState.fracDivisor || 3;

    let result = base;
    if (op === 'add') {
        result = base + (base * (pct / 100));
    } else {
        result = base - (base * (pct / 100));
    }

    const remainingTo100 = base - result;
    const remainingDiv = remainingTo100 / divisor;

    const fmtDec4 = (val) => val.toLocaleString('es-ES', { minimumFractionDigits: 4, maximumFractionDigits: 4 });

    labelFracResult.textContent = fmtDec4(result);
    labelFracRemaining100.textContent = fmtDec4(remainingTo100);
    labelFracRemainingDiv.textContent = fmtDec4(remainingDiv);

    if (remainingTo100 < 0) {
        labelFracRemaining100.className = "text-rose-400 font-extrabold font-mono";
        labelFracRemainingDiv.className = "text-rose-400 font-extrabold font-mono";
    } else {
        labelFracRemaining100.className = "text-amber-400 font-extrabold font-mono";
        labelFracRemainingDiv.className = "text-indigo-400 font-extrabold font-mono";
    }
}

// ============================================================
// CONVERSOR DE DIVISAS
// ============================================================
function recalculateConversions() {
    const usd = AppState.convUsdAmount;
    const bs = AppState.convBsAmount;
    const rateBcv = AppState.exRateBcv;
    const rateCustom = AppState.exRateCustom;

    const resBcvBsVal = usd * rateBcv;
    const resCustomBsVal = usd * rateCustom;
    const resBcvUsdVal = bs / rateBcv;
    const resCustomUsdVal = bs / rateCustom;

    const fmtBs = (val) => `${val.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs.`;
    const fmtUSD = (val) => `$${val.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    resBcvBs.textContent = fmtBs(resBcvBsVal);
    resCustomBs.textContent = fmtBs(resCustomBsVal);
    resBcvUsd.textContent = fmtUSD(resBcvUsdVal);
    resCustomUsd.textContent = fmtUSD(resCustomUsdVal);
}

// ============================================================
// CALCULADORA EXPRESS
// ============================================================
let calcCurrentExpression = "";

function initializeExpressCalculator() {
    const buttons = document.querySelectorAll('.calc-btn');

    toggleCalcHistory.addEventListener('click', () => {
        calcHistoryPanel.classList.toggle('hidden');
    });

    clearCalcHistory.addEventListener('click', () => {
        AppState.calculatorHistory = [];
        renderCalcHistoryList();
        saveStateToLocalStorage();
        showToast("Historial de la calculadora vaciado.");
    });

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const actionValue = btn.getAttribute('data-val');
            processCalculatorInput(actionValue);
        });
    });

    window.addEventListener('keydown', (e) => {
        const activeEl = document.activeElement;
        if (activeEl && (
            activeEl.tagName === 'INPUT' ||
            activeEl.tagName === 'SELECT' ||
            activeEl.tagName === 'TEXTAREA' ||
            activeEl.isContentEditable
        )) {
            return;
        }

        let key = e.key;
        let mappedValue = null;

        if (key >= '0' && key <= '9') {
            mappedValue = key;
        } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '(' || key === ')') {
            mappedValue = key;
        } else if (key === '.' || key === ',') {
            mappedValue = '.';
        } else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            mappedValue = '=';
        } else if (key === 'Backspace') {
            mappedValue = 'backspace';
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            mappedValue = 'C';
        }

        if (mappedValue) {
            const targetBtn = document.querySelector(`.calc-btn[data-val="${mappedValue}"]`);
            if (targetBtn) {
                targetBtn.classList.add('scale-95', 'opacity-70', 'ring-1', 'ring-amber-500');
                setTimeout(() => {
                    targetBtn.classList.remove('scale-95', 'opacity-70', 'ring-1', 'ring-amber-500');
                }, 100);
            }
            processCalculatorInput(mappedValue);
        }
    });
}

function processCalculatorInput(value) {
    if (value === 'C') {
        calcCurrentExpression = "";
        calcScreen.textContent = "0";
        calcPreview.textContent = "";
    } else if (value === 'backspace') {
        calcCurrentExpression = calcCurrentExpression.slice(0, -1);
        calcScreen.textContent = calcCurrentExpression || "0";
    } else if (value === '=') {
        if (!calcCurrentExpression) return;
        try {
            const safeExp = calcCurrentExpression.replace(/x/g, '*').replace(/÷/g, '/');

            if (!/^[0-9+\-*/().\s]+$/.test(safeExp)) {
                throw new Error("Caracteres no permitidos");
            }

            const result = Function(`"use strict"; return (${safeExp})`)();

            if (result === undefined || isNaN(result) || !isFinite(result)) {
                throw new Error("División por cero o indeterminación");
            }

            const finalResult = Number(result.toFixed(6));

            const operationStr = `${calcCurrentExpression} = ${finalResult}`;
            AppState.calculatorHistory.unshift(operationStr);
            if (AppState.calculatorHistory.length > 20) {
                AppState.calculatorHistory.pop();
            }

            renderCalcHistoryList();

            calcPreview.textContent = calcCurrentExpression;
            calcScreen.textContent = finalResult.toString();
            calcCurrentExpression = finalResult.toString();

            saveStateToLocalStorage();
        } catch (error) {
            calcScreen.textContent = "Error";
            calcCurrentExpression = "";
            calcPreview.textContent = "";
        }
    } else {
        if (calcCurrentExpression === "0" && !isNaN(value)) {
            calcCurrentExpression = value;
        } else {
            calcCurrentExpression += value;
        }
        calcScreen.textContent = calcCurrentExpression;
    }
}

function renderCalcHistoryList() {
    calcHistoryList.innerHTML = '';
    if (AppState.calculatorHistory.length === 0) {
        calcHistoryList.innerHTML = `<div class="py-2 text-[10px] text-slate-500 text-center font-sans italic">Sin operaciones recientes</div>`;
        return;
    }

    AppState.calculatorHistory.forEach(op => {
        const item = document.createElement('div');
        item.className = "py-1.5 hover:bg-slate-900 px-1 rounded transition-colors cursor-pointer text-right truncate";
        item.textContent = op;
        item.addEventListener('click', () => {
            const resultPart = op.split('=').pop().trim();
            calcCurrentExpression = resultPart;
            calcScreen.textContent = resultPart;
            calcPreview.textContent = op;
            showToast(`Resultado cargado: ${resultPart}`);
        });
        calcHistoryList.appendChild(item);
    });
}

// ============================================================
// FORMULARIO PRINCIPAL
// ============================================================
goalForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const goldGoal = parseInt(inputGoldTarget.value, 10);
    const startVal = inputStartDate.value;
    const endVal = inputEndDate.value;

    if (isNaN(goldGoal) || goldGoal <= 0) {
        showToast("Por favor ingresa una cantidad de oro válida.");
        return;
    }

    const startObj = AppState.parseLocalDate(startVal);
    const endObj = AppState.parseLocalDate(endVal);

    if (!startObj || !endObj) {
        showToast("Fechas no válidas seleccionadas.");
        return;
    }

    if (endObj < startObj) {
        showToast("La fecha de finalización debe ser mayor o igual a la de inicio.");
        return;
    }

    const diffTime = Math.abs(endObj - startObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    AppState.targetGold = goldGoal;
    AppState.startDate = startObj;
    AppState.endDate = endObj;
    AppState.totalDays = diffDays;
    AppState.initialDailyRate = Math.round(goldGoal / diffDays);

    const newDaysMap = {};
    let tempDate = new Date(startObj);
    for (let i = 0; i < diffDays; i++) {
        const key = AppState.formatKey(tempDate);
        if (AppState.daysMap && AppState.daysMap[key]) {
            newDaysMap[key] = {
                ...AppState.daysMap[key]
            };
        } else {
            newDaysMap[key] = {
                dateString: key,
                targetGold: AppState.initialDailyRate,
                actualGold: 0,
                isCompleted: false
            };
        }
        tempDate.setDate(tempDate.getDate() + 1);
    }
    AppState.daysMap = newDaysMap;

    AppState.calendarMonth = startObj.getMonth();
    AppState.calendarYear = startObj.getFullYear();

    recalculatePlan();

    emptyState.classList.add('hidden');
    resultsDashboard.classList.remove('hidden');

    showToast("Plan de farmeo sincronizado (historial conservado).");
});

// ============================================================
// RECALCULAR PLAN
// ============================================================
function recalculatePlan() {
    if (!AppState.startDate) return;

    const keys = Object.keys(AppState.daysMap).sort();

    let totalAccumulatedGoldEarned = 0;
    let remainingGoldToFarm = AppState.targetGold;
    let pendingDaysCount = 0;

    keys.forEach(key => {
        const day = AppState.daysMap[key];
        if (day.isCompleted) {
            totalAccumulatedGoldEarned += day.actualGold;
        } else {
            pendingDaysCount++;
            totalAccumulatedGoldEarned += day.actualGold;
        }
    });

    remainingGoldToFarm = AppState.targetGold - totalAccumulatedGoldEarned;
    if (remainingGoldToFarm < 0) remainingGoldToFarm = 0;

    let newDailyTarget = 0;
    if (pendingDaysCount > 0 && remainingGoldToFarm > 0) {
        newDailyTarget = Math.round(remainingGoldToFarm / pendingDaysCount);
    }

    keys.forEach(key => {
        const day = AppState.daysMap[key];
        if (!day.isCompleted) {
            day.targetGold = newDailyTarget;
        }
    });

    metricTotalGold.textContent = formatGoldNumber(AppState.targetGold);
    metricCurrentGold.textContent = formatGoldNumber(totalAccumulatedGoldEarned);
    metricRemainingGold.textContent = formatGoldNumber(remainingGoldToFarm);
    metricDailyGold.textContent = formatGoldNumber(AppState.initialDailyRate);
    metricAdjustedDaily.textContent = formatGoldNumber(newDailyTarget);
    metricDurationText.textContent = `${AppState.totalDays} días totales de campaña`;

    const percentage = Math.min(100, Math.round((totalAccumulatedGoldEarned / AppState.targetGold) * 100));
    metricPercentageDone.textContent = `${percentage}% completado`;
    metricProgressBar.style.width = `${percentage}%`;

    const baseRate = AppState.goldPriceBase || 100000;
    const usdRate = AppState.goldPriceRate || 4.1;

    const totalUSD = (AppState.targetGold / baseRate) * usdRate;
    const earnedUSD = (totalAccumulatedGoldEarned / baseRate) * usdRate;
    const remainingUSD = (remainingGoldToFarm / baseRate) * usdRate;
    const dailyUSD = (AppState.initialDailyRate / baseRate) * usdRate;

    const fmtUSD = (val) => `$${val.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    metricTotalUSD.textContent = `~ ${fmtUSD(totalUSD)}`;
    metricCurrentUSD.textContent = `~ ${fmtUSD(earnedUSD)}`;
    metricRemainingUSD.textContent = `~ ${fmtUSD(remainingUSD)}`;
    metricDailyUSD.textContent = `~ ${fmtUSD(dailyUSD)}/día`;

    labelValuationRate.textContent = `$${usdRate} por cada ${formatGoldNumber(baseRate)} G`;
    labelValuationTotalUSD.textContent = fmtUSD(totalUSD);

    updateCustomQuoteUI();
    recalculateTimeMetrics();
    renderCalendarView();
    renderTableListView();
    calculateAdvancedAnalytics(totalAccumulatedGoldEarned);

    saveStateToLocalStorage();
}

// ============================================================
// RECALCULAR TIEMPOS
// ============================================================
function recalculateTimeMetrics() {
    const speed = AppState.goldPerHour || 30000;

    const initialRate = AppState.initialDailyRate || 0;
    const adjustedRate = (() => {
        const keys = Object.keys(AppState.daysMap);
        if (keys.length === 0) return 0;
        let total = 0, count = 0;
        keys.forEach(key => {
            const day = AppState.daysMap[key];
            if (!day.isCompleted) {
                total += day.targetGold || 0;
                count++;
            }
        });
        return count > 0 ? Math.round(total / count) : 0;
    })();

    const remainingGold = (() => {
        const keys = Object.keys(AppState.daysMap);
        let total = 0;
        keys.forEach(key => {
            const day = AppState.daysMap[key];
            total += day.actualGold || 0;
        });
        return Math.max(0, AppState.targetGold - total);
    })();

    const hoursInitial = initialRate / speed;
    const hoursAdjusted = adjustedRate / speed;
    const hoursTotalRemaining = remainingGold / speed;

    timeDailyInitial.textContent = formatHoursAndMinutes(hoursInitial);
    timeDailyAdjusted.textContent = formatHoursAndMinutes(hoursAdjusted);
    timeTotalRemaining.textContent = formatHoursAndMinutes(hoursTotalRemaining);
}

// ============================================================
// ANÁLISIS AVANZADO
// ============================================================
function calculateAdvancedAnalytics(totalAccumulatedGoldEarned) {
    const keys = Object.keys(AppState.daysMap).sort();

    let bestDayGold = 0;
    let bestDayDate = "--/--/----";
    let completedCount = 0;
    let sumRealGoldOfCompleted = 0;
    let sumSquareErrors = 0;
    let allRealValues = [];

    const dataTeorica = [];
    const dataReal = [];
    let cumulativeTeorico = 0;
    let cumulativeReal = 0;

    keys.forEach((key, index) => {
        const day = AppState.daysMap[key];
        cumulativeTeorico += AppState.initialDailyRate;
        dataTeorica.push({ index, label: key, value: cumulativeTeorico });

        if (day.isCompleted || day.actualGold > 0) {
            cumulativeReal += day.actualGold;
            dataReal.push({ index, label: key, value: cumulativeReal });

            if (day.isCompleted) {
                completedCount++;
                sumRealGoldOfCompleted += day.actualGold;
                allRealValues.push(day.actualGold);

                if (day.actualGold > bestDayGold) {
                    bestDayGold = day.actualGold;
                    const parsed = AppState.parseLocalDate(key);
                    bestDayDate = parsed ? parsed.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : key;
                }
                const diff = Math.abs(day.actualGold - day.targetGold);
                sumSquareErrors += diff;
            }
        }
    });

    statsBestDayGold.textContent = formatGoldNumber(bestDayGold);
    statsBestDayDate.textContent = bestDayDate;

    const avgReal = completedCount > 0 ? Math.round(sumRealGoldOfCompleted / completedCount) : 0;
    statsAvgDayGold.textContent = formatGoldNumber(avgReal);
    statsCompletedDaysCount.textContent = `${completedCount} días registrados de ${AppState.totalDays}`;

    if (completedCount > 0) {
        const averageTargetOfCompleted = AppState.initialDailyRate * completedCount;
        const totalDeviationPercent = sumSquareErrors / (averageTargetOfCompleted || 1);
        const score = Math.max(0, Math.min(100, Math.round(100 * (1 - Math.min(0.8, totalDeviationPercent)))));
        statsConsistencyPercent.textContent = `${score}%`;

        if (score > 85) {
            statsConsistencyStatus.className = "text-[9px] text-emerald-400 block font-semibold";
            statsConsistencyStatus.innerHTML = "<i class='fa-solid fa-square-check'></i> Excelente";
        } else if (score > 60) {
            statsConsistencyStatus.className = "text-[9px] text-amber-400 block font-semibold";
            statsConsistencyStatus.innerHTML = "<i class='fa-solid fa-triangle-exclamation'></i> Regular";
        } else {
            statsConsistencyStatus.className = "text-[9px] text-rose-400 block font-semibold";
            statsConsistencyStatus.innerHTML = "<i class='fa-solid fa-circle-exclamation'></i> Inestable";
        }
    } else {
        statsConsistencyPercent.textContent = "0%";
        statsConsistencyStatus.className = "text-[9px] text-slate-500 block";
        statsConsistencyStatus.textContent = "Sin datos";
    }

    if (completedCount > 0) {
        let daysMetGoal = 0;
        keys.forEach(key => {
            const day = AppState.daysMap[key];
            if (day.isCompleted && day.actualGold >= day.targetGold) {
                daysMetGoal++;
            }
        });
        const efficiencyScore = Math.round((daysMetGoal / completedCount) * 100);
        statsEfficiencyPercent.textContent = `${efficiencyScore}%`;

        if (efficiencyScore > 80) {
            statsEfficiencyStatus.className = "text-[9px] text-emerald-400 block font-semibold";
            statsEfficiencyStatus.innerHTML = "Alta eficiencia";
        } else if (efficiencyScore > 50) {
            statsEfficiencyStatus.className = "text-[9px] text-amber-400 block font-semibold";
            statsEfficiencyStatus.innerHTML = "Eficiencia media";
        } else {
            statsEfficiencyStatus.className = "text-[9px] text-rose-400 block font-semibold";
            statsEfficiencyStatus.innerHTML = "Baja eficiencia";
        }
    } else {
        statsEfficiencyPercent.textContent = "0%";
        statsEfficiencyStatus.className = "text-[9px] text-slate-500 block";
        statsEfficiencyStatus.textContent = "Sin datos";
    }

    if (allRealValues.length >= 3) {
        const mean = allRealValues.reduce((a, b) => a + b, 0) / allRealValues.length;
        const squaredDiffs = allRealValues.map(val => Math.pow(val - mean, 2));
        const variance = squaredDiffs.reduce((a, b) => a + b, 0) / allRealValues.length;
        const stdDev = Math.sqrt(variance);
        analysisStdDev.textContent = formatGoldNumber(Math.round(stdDev));
        analysisStdDetail.textContent = `Variabilidad de ${allRealValues.length} registros`;

        const recent = allRealValues.slice(-3);
        const previous = allRealValues.slice(-6, -3);

        if (previous.length > 0 && recent.length > 0) {
            const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
            const prevAvg = previous.reduce((a, b) => a + b, 0) / previous.length;

            if (recentAvg > prevAvg * 1.1) {
                analysisTrend.textContent = "⬆️ Crecimiento";
                analysisTrend.className = "text-emerald-400 font-bold text-sm block mt-1";
                analysisTrendDetail.textContent = "Ritmo acelerado en los últimos días";
            } else if (recentAvg < prevAvg * 0.9) {
                analysisTrend.textContent = "⬇️ Declive";
                analysisTrend.className = "text-rose-400 font-bold text-sm block mt-1";
                analysisTrendDetail.textContent = "Ritmo decreciente, ¡actúa!";
            } else {
                analysisTrend.textContent = "➡️ Estable";
                analysisTrend.className = "text-amber-400 font-bold text-sm block mt-1";
                analysisTrendDetail.textContent = "Ritmo constante en los últimos días";
            }
        } else {
            analysisTrend.textContent = "⏳ Evaluando";
            analysisTrend.className = "text-slate-400 font-bold text-sm block mt-1";
            analysisTrendDetail.textContent = "Necesita más registros";
        }
    } else if (allRealValues.length > 0) {
        analysisStdDev.textContent = "--";
        analysisStdDetail.textContent = "Se necesitan más registros";
        analysisTrend.textContent = "⏳ Evaluando";
        analysisTrend.className = "text-slate-400 font-bold text-sm block mt-1";
        analysisTrendDetail.textContent = "Mínimo 3 días para análisis";
    } else {
        analysisStdDev.textContent = "--";
        analysisStdDetail.textContent = "Sin registros de farmeo";
        analysisTrend.textContent = "⏳ Sin datos";
        analysisTrend.className = "text-slate-400 font-bold text-sm block mt-1";
        analysisTrendDetail.textContent = "Registra tu progreso diario";
    }

    const remainingGold = AppState.targetGold - totalAccumulatedGoldEarned;
    const avgDaily = completedCount > 0 ? sumRealGoldOfCompleted / completedCount : 0;

    if (avgDaily > 0 && remainingGold > 0) {
        const daysNeeded = Math.ceil(remainingGold / avgDaily);
        analysisProjectionDays.textContent = `${daysNeeded} días`;
        analysisProjectionDays.className = "text-emerald-400 font-bold text-sm block mt-1";
        analysisProjectionDetail.textContent = `Al ritmo actual de ${formatGoldNumber(Math.round(avgDaily))} G/día`;
    } else if (remainingGold <= 0 && AppState.targetGold > 0) {
        analysisProjectionDays.textContent = "¡Meta cumplida!";
        analysisProjectionDays.className = "text-emerald-400 font-bold text-sm block mt-1";
        analysisProjectionDetail.textContent = "¡Felicidades! Has alcanzado tu objetivo";
    } else {
        analysisProjectionDays.textContent = "-- días";
        analysisProjectionDays.className = "text-slate-400 font-bold text-sm block mt-1";
        analysisProjectionDetail.textContent = "Registra más días para proyectar";
    }

    renderPerformanceChart(dataTeorica, dataReal);

    const activeDays = keys
        .map(k => AppState.daysMap[k])
        .filter(day => day.isCompleted || day.actualGold > 0);

    let ritmoDiarioSimulado = AppState.initialDailyRate;

    if (activeDays.length >= 2) {
        const lastActiveDay = activeDays[activeDays.length - 1];
        const prevActiveDay = activeDays[activeDays.length - 2];
        ritmoDiarioSimulado = Math.round((lastActiveDay.actualGold + prevActiveDay.actualGold) / 2);
    } else if (activeDays.length === 1) {
        ritmoDiarioSimulado = activeDays[0].actualGold;
    }

    const pDay1GoldVal = totalAccumulatedGoldEarned + ritmoDiarioSimulado;
    const pDay1UsdVal = (pDay1GoldVal / (AppState.goldPriceBase || 100000)) * (AppState.goldPriceRate || 4.1);

    const pDay2GoldVal = totalAccumulatedGoldEarned + (ritmoDiarioSimulado * 2);
    const pDay2UsdVal = (pDay2GoldVal / (AppState.goldPriceBase || 100000)) * (AppState.goldPriceRate || 4.1);

    const todayDate = new Date();
    const tomorrow = new Date(todayDate);
    tomorrow.setDate(todayDate.getDate() + 1);
    const afterTomorrow = new Date(todayDate);
    afterTomorrow.setDate(todayDate.getDate() + 2);

    const fmtDateLabel = (dateObj, suffix) => {
        const day = dateObj.getDate();
        const month = dateObj.toLocaleDateString('es-ES', { month: 'short' });
        return `${suffix} (${day} ${month})`;
    };
    projectionDay1Label.textContent = fmtDateLabel(tomorrow, "Mañana");
    projectionDay2Label.textContent = fmtDateLabel(afterTomorrow, "Pasado Mañana");

    projectionDay1Gold.textContent = `${formatGoldNumber(pDay1GoldVal)} G`;
    projectionDay1Usd.textContent = `$${pDay1UsdVal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    projectionDay2Gold.textContent = `${formatGoldNumber(pDay2GoldVal)} G`;
    projectionDay2Usd.textContent = `$${pDay2UsdVal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ============================================================
// GRÁFICO DE RENDIMIENTO
// ============================================================
function renderPerformanceChart(teoricos, reales) {
    if (teoricos.length === 0) {
        chartContainer.innerHTML = `
            <div id="chart-placeholder" class="absolute inset-0 flex items-center justify-center text-xs text-slate-500 flex-col gap-2">
                <i class="fa-solid fa-chart-area text-2xl"></i>
                <span>Ingresa y calcula una meta de oro activa</span>
            </div>
        `;
        return;
    }

    const parentWidth = chartContainer.parentElement ? chartContainer.parentElement.clientWidth : 600;
    const baseWidth = Math.max(500, parentWidth - 48);
    const width = baseWidth * AppState.chartZoom;
    const height = 220;
    const padding = 45;

    const maxVal = Math.max(
        AppState.targetGold || 1,
        teoricos[teoricos.length - 1]?.value || 1,
        reales[reales.length - 1]?.value || 1
    ) * 1.15;

    const minVal = 0;
    const maxIndex = AppState.totalDays - 1 || 1;

    const getX = (index) => padding + (index / (maxIndex || 1)) * (width - padding * 2);
    const getY = (val) => height - padding - ((val - minVal) / (maxVal - minVal || 1)) * (height - padding * 2.5);

    let svgContent = `<svg width="${width}" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" class="font-sans min-w-full">`;

    svgContent += `
        <defs>
            <linearGradient id="chartBg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0f172a" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
            </linearGradient>
        </defs>
        <rect x="0" y="0" width="${width}" height="${height}" fill="url(#chartBg)"/>
    `;

    const linesCount = 5;
    for (let i = 0; i <= linesCount; i++) {
        const val = minVal + (i / linesCount) * (maxVal - minVal);
        const y = getY(val);
        const opacity = i === 0 || i === linesCount ? 0.3 : 0.15;
        svgContent += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#334155" stroke-width="0.8" stroke-dasharray="4,4" opacity="${opacity}" />`;
        svgContent += `<text x="${padding - 8}" y="${y + 3}" fill="#64748b" font-size="7.5" text-anchor="end" font-weight="600">${formatGoldNumber(Math.round(val))}</text>`;
    }

    if (teoricos.length > 1) {
        let teoricaPath = `M ${getX(teoricos[0].index)} ${getY(teoricos[0].value)}`;
        for (let i = 1; i < teoricos.length; i++) {
            teoricaPath += ` L ${getX(teoricos[i].index)} ${getY(teoricos[i].value)}`;
        }
        svgContent += `<path d="${teoricaPath}" fill="none" stroke="#eab308" stroke-width="2.5" stroke-linecap="round" opacity="0.5" class="chart-line" />`;
    }

    if (AppState.initialDailyRate > 0) {
        const idealDailyY = getY(AppState.initialDailyRate);
        svgContent += `<line x1="${padding}" y1="${idealDailyY}" x2="${width - padding}" y2="${idealDailyY}" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.4" />`;
        svgContent += `<text x="${width - padding - 5}" y="${idealDailyY - 4}" fill="#3b82f6" font-size="7" text-anchor="end" opacity="0.6">Meta Diaria</text>`;
    }

    if (reales.length > 1) {
        let realPath = `M ${getX(reales[0].index)} ${getY(reales[0].value)}`;
        let areaPath = `M ${getX(reales[0].index)} ${getY(0)} L ${getX(reales[0].index)} ${getY(reales[0].value)}`;

        for (let i = 1; i < reales.length; i++) {
            const x = getX(reales[i].index);
            const y = getY(reales[i].value);
            realPath += ` L ${x} ${y}`;
            areaPath += ` L ${x} ${y}`;
        }

        areaPath += ` L ${getX(reales[reales.length - 1].index)} ${getY(0)} Z`;

        svgContent += `<path d="${areaPath}" fill="url(#areaGrad)" />`;
        svgContent += `<path d="${realPath}" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="chart-line-delayed" />`;

        reales.forEach((pt, idx) => {
            const x = getX(pt.index);
            const y = getY(pt.value);
            const dayData = AppState.daysMap[pt.label];
            const actualGold = dayData ? dayData.actualGold : 0;
            const delay = 0.2 + (idx * 0.15);
            svgContent += `
                <circle cx="${x}" cy="${y}" r="5" fill="#020408" stroke="#10b981" stroke-width="2.5" style="animation-delay: ${delay}s" class="chart-dot cursor-pointer hover:r-7 transition-all">
                    <title>${pt.label}: ${formatGoldNumber(pt.value)} G acumulado | Día: ${formatGoldNumber(actualGold)} G</title>
                </circle>
            `;
        });
    }

    const idealStep = AppState.chartZoom >= 2.0 ? 1 : Math.max(1, Math.ceil(teoricos.length / 7));
    for (let i = 0; i < teoricos.length; i += idealStep) {
        const item = teoricos[i];
        if (item) {
            const x = getX(item.index);
            const parsed = AppState.parseLocalDate(item.label);
            const formattedDateStr = parsed ? parsed.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : item.label;
            svgContent += `<text x="${x}" y="${height - 10}" fill="#64748b" font-size="7.5" text-anchor="middle" font-weight="500">${formattedDateStr}</text>`;
        }
    }
    if ((teoricos.length - 1) % idealStep !== 0) {
        const item = teoricos[teoricos.length - 1];
        const x = getX(item.index);
        const parsed = AppState.parseLocalDate(item.label);
        const formattedDateStr = parsed ? parsed.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : item.label;
        svgContent += `<text x="${x}" y="${height - 10}" fill="#64748b" font-size="7.5" text-anchor="middle" font-weight="500">${formattedDateStr}</text>`;
    }

    svgContent += `
        <rect x="${width - 165}" y="${padding + 5}" width="150" height="58" rx="6" fill="#080d1a" fill-opacity="0.9" stroke="#162238" stroke-width="0.8"/>
        <circle cx="${width - 155}" cy="${padding + 20}" r="4" fill="#eab308" opacity="0.7"/>
        <text x="${width - 145}" y="${padding + 24}" fill="#94a3b8" font-size="7.5">Objetivo Teórico</text>
        <circle cx="${width - 155}" cy="${padding + 37}" r="4" fill="#10b981"/>
        <text x="${width - 145}" y="${padding + 41}" fill="#94a3b8" font-size="7.5">Progreso Real</text>
        <line x1="${width - 155}" y1="${padding + 53}" x2="${width - 147}" y2="${padding + 53}" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.5"/>
        <text x="${width - 145}" y="${padding + 57}" fill="#94a3b8" font-size="7.5">Meta Diaria Ideal</text>
    `;

    svgContent += `</svg>`;
    chartContainer.innerHTML = svgContent;
}

// ============================================================
// UTILIDADES
// ============================================================
function formatHoursAndMinutes(totalHours) {
    if (isNaN(totalHours) || totalHours <= 0) return "0h 0m";
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours}h ${minutes}m`;
}

function formatGoldNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// ============================================================
// SUSCRIPCIÓN UI
// ============================================================
function updateSubscriptionUI() {
    if (!AppState.subStartDate) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(AppState.subStartDate);
    startDate.setHours(0, 0, 0, 0);

    const expirationDate = new Date(startDate);
    expirationDate.setDate(startDate.getDate() + AppState.subDuration);

    const totalMs = expirationDate - startDate;
    const remainingMs = expirationDate - today;

    const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

    let percentage = 0;
    if (totalMs > 0) {
        percentage = Math.max(0, Math.min(100, Math.round(((AppState.subDuration - remainingDays) / AppState.subDuration) * 100)));
    }

    subProgressBar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;

    subProgressBar.className = "h-full transition-all duration-500 ";
    if (remainingDays <= 5) {
        subProgressBar.className += "bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
        labelSubCountdown.className = "font-bold text-rose-500 animate-pulse";
        subAlertText.innerHTML = `<span class="text-rose-400 font-bold"><i class="fa-solid fa-triangle-exclamation"></i> ¡ALERTA! Menos de 5 días de juego.</span> Usa el botón inferior para programar tu recordatorio de renovación.`;
    } else if (remainingDays <= 12) {
        subProgressBar.className += "bg-amber-500";
        labelSubCountdown.className = "font-bold text-amber-400";
        subAlertText.innerHTML = `<span class="text-amber-400 font-semibold">Alerta de suscripción media.</span> Quedan ${remainingDays} días de juego de tu suscripción contratada.`;
    } else if (remainingDays > 0) {
        subProgressBar.className += "bg-emerald-500";
        labelSubCountdown.className = "font-bold text-emerald-400";
        subAlertText.innerHTML = `<span class="text-emerald-400 font-semibold">Estado seguro.</span> Tienes un colchón de tiempo disponible adecuado para tu aventura.`;
    } else {
        subProgressBar.className += "bg-rose-500";
        labelSubCountdown.className = "font-bold text-rose-500";
        subAlertText.innerHTML = `<span class="text-rose-400 font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Suscripción expirada.</span> Renueva tu tiempo de juego para continuar.`;
    }

    labelSubCountdown.textContent = remainingDays > 0 ? `${remainingDays} días restantes` : "Expirada / Sin tiempo";
}

// ============================================================
// CALENDARIO
// ============================================================
function renderCalendarView() {
    calendarDaysGrid.innerHTML = '';

    if (!AppState.startDate) {
        const now = new Date();
        AppState.calendarMonth = now.getMonth();
        AppState.calendarYear = now.getFullYear();
    }

    const year = AppState.calendarYear;
    const month = AppState.calendarMonth;

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1);
    let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;

    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = "h-14 md:h-20 bg-slate-950/20 rounded-xl border border-dashed border-slate-900/60";
        calendarDaysGrid.appendChild(emptyCell);
    }

    for (let dayNum = 1; dayNum <= totalDaysInMonth; dayNum++) {
        const cellDate = new Date(year, month, dayNum);
        const dateKey = AppState.formatKey(cellDate);
        const campaignDay = AppState.daysMap[dateKey];

        const dayCard = document.createElement('div');
        let cardStyles = "h-14 md:h-20 p-1 md:p-2 rounded-xl flex flex-col justify-between transition-all relative border ";
        let contentHTML = `<span class="text-[10px] md:text-xs font-bold text-slate-500">${dayNum}</span>`;

        const isInCampaign = AppState.startDate && AppState.endDate &&
            cellDate >= AppState.startDate && cellDate <= AppState.endDate;

        if (isInCampaign && campaignDay) {
            cardStyles += "cursor-pointer hover:scale-[1.03] active:scale-[0.98] ";
            dayCard.addEventListener('click', () => openDayModal(dateKey));

            if (campaignDay.isCompleted) {
                cardStyles += "bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-900/10";
                contentHTML = `
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-bold text-emerald-400">${dayNum}</span>
                        <i class="fa-solid fa-circle-check text-emerald-400 text-[10px] md:text-xs"></i>
                    </div>
                    <div class="text-right">
                        <div class="text-[9px] md:text-xs font-extrabold text-emerald-300 truncate">${formatGoldNumber(campaignDay.actualGold)}</div>
                        <div class="text-[7px] md:text-[8px] text-emerald-500 uppercase font-semibold">Hecho</div>
                    </div>
                `;
            } else if (campaignDay.actualGold > 0) {
                cardStyles += "bg-amber-950/20 border-amber-500/40 text-amber-200";
                contentHTML = `
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-bold text-amber-400">${dayNum}</span>
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    </div>
                    <div class="text-right">
                        <div class="text-[9px] md:text-xs font-extrabold text-amber-200 truncate">${formatGoldNumber(campaignDay.actualGold)}</div>
                        <div class="text-[7px] md:text-[8px] text-slate-400 truncate">Sig: ${formatGoldNumber(campaignDay.targetGold)}</div>
                    </div>
                `;
            } else {
                cardStyles += "bg-slate-900/90 border-slate-800 hover:border-amber-500/60";
                contentHTML = `
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-bold text-slate-300">${dayNum}</span>
                    </div>
                    <div class="text-right">
                        <div class="text-[9px] md:text-xs font-extrabold text-white truncate">${formatGoldNumber(campaignDay.targetGold)}</div>
                        <div class="text-[7px] md:text-[8px] text-slate-500">Objetivo</div>
                    </div>
                `;
            }
        } else {
            cardStyles += "bg-slate-950/60 border-slate-900 text-slate-600 opacity-60";
            contentHTML = `
                <span class="text-[10px] md:text-xs font-semibold text-slate-700">${dayNum}</span>
                <div class="text-right text-[7px] md:text-[8px] text-slate-800">Fuera</div>
            `;
        }

        dayCard.className = cardStyles;
        dayCard.innerHTML = contentHTML;
        calendarDaysGrid.appendChild(dayCard);
    }
}

// ============================================================
// TABLA DIARIA
// ============================================================
function renderTableListView() {
    dailyRowsContainer.innerHTML = '';

    const keys = Object.keys(AppState.daysMap).sort();

    keys.forEach(key => {
        const day = AppState.daysMap[key];
        const dateObj = AppState.parseLocalDate(key);
        if (!dateObj) return;

        const localeOptions = { weekday: 'short', month: 'short', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('es-ES', localeOptions);

        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-900/40 transition-colors cursor-pointer";
        tr.addEventListener('click', () => openDayModal(key));

        const statusCheckbox = day.isCompleted
            ? `<span class="text-emerald-500"><i class="fa-solid fa-circle-check text-lg"></i></span>`
            : `<span class="text-slate-700 hover:text-amber-500 transition-colors"><i class="fa-regular fa-circle text-lg"></i></span>`;

        tr.innerHTML = `
            <td class="py-3.5 px-4 text-center">${statusCheckbox}</td>
            <td class="py-3.5 px-4 font-semibold text-white capitalize text-xs md:text-sm">
                ${formattedDate}
                <span class="text-[10px] text-slate-500 block font-normal">${key}</span>
            </td>
            <td class="py-3.5 px-4 text-right font-semibold text-slate-400 text-xs md:text-sm">
                ${formatGoldNumber(day.targetGold)} <span class="text-[10px] text-slate-600 font-bold">G</span>
            </td>
            <td class="py-3.5 px-4 text-right font-extrabold text-xs md:text-sm ${day.actualGold > 0 ? 'text-emerald-400' : 'text-slate-600'}">
                ${formatGoldNumber(day.actualGold)} <span class="text-[10px] font-bold">G</span>
            </td>
            <td class="py-3.5 px-4 text-right text-xs md:text-sm font-semibold text-slate-500">
                ${formatGoldNumber(Math.max(0, day.targetGold - day.actualGold))} <span class="text-[10px] text-slate-600 font-bold">G</span>
            </td>
        `;

        dailyRowsContainer.appendChild(tr);
    });
}

// ============================================================
// MODAL DIARIO
// ============================================================
function openDayModal(dateKey) {
    const day = AppState.daysMap[dateKey];
    if (!day) return;

    AppState.selectedDateKey = dateKey;

    const dateObj = AppState.parseLocalDate(dateKey);
    if (!dateObj) return;

    const localeOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    modalDateDisplay.textContent = dateObj.toLocaleDateString('es-ES', localeOptions);

    modalSuggestedGold.textContent = `${formatGoldNumber(day.targetGold)} G`;
    modalInputGold.value = day.actualGold > 0 ? day.actualGold : '';
    modalCheckCompleted.checked = day.isCompleted;

    dayModal.classList.remove('hidden');
    dayModal.classList.add('flex');

    setTimeout(() => {
        dayModalBox.classList.remove('scale-95', 'opacity-0');
        dayModalBox.classList.add('scale-100', 'opacity-100');
    }, 10);

    modalInputGold.focus();
}

function closeDayModal() {
    dayModalBox.classList.remove('scale-100', 'opacity-100');
    dayModalBox.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        dayModal.classList.add('hidden');
        dayModal.classList.remove('flex');
    }, 200);
    AppState.selectedDateKey = null;
}

closeModalBtn.addEventListener('click', closeDayModal);
modalBtnCancel.addEventListener('click', closeDayModal);

modalBtnSave.addEventListener('click', () => {
    const dateKey = AppState.selectedDateKey;
    if (!dateKey) return;

    const day = AppState.daysMap[dateKey];
    let goldValue = parseInt(modalInputGold.value, 10);

    if (isNaN(goldValue) || goldValue < 0) {
        goldValue = 0;
    }

    day.actualGold = goldValue;
    day.isCompleted = modalCheckCompleted.checked;

    if (day.isCompleted && goldValue === 0) {
        day.actualGold = day.targetGold;
    }

    closeDayModal();
    recalculatePlan();
    showToast("Progreso diario registrado con éxito.");
});

resetProgressBtn.addEventListener('click', () => {
    const keys = Object.keys(AppState.daysMap);
    keys.forEach(key => {
        AppState.daysMap[key].actualGold = 0;
        AppState.daysMap[key].isCompleted = false;
        AppState.daysMap[key].targetGold = AppState.initialDailyRate;
    });

    recalculatePlan();
    showToast("Progreso de campaña reiniciado.");
});

// ============================================================
// LOCAL STORAGE
// ============================================================
function saveStateToLocalStorage() {
    const payload = {
        targetGold: AppState.targetGold,
        startDateStr: AppState.startDate ? AppState.formatKey(AppState.startDate) : null,
        endDateStr: AppState.endDate ? AppState.formatKey(AppState.endDate) : null,
        totalDays: AppState.totalDays,
        initialDailyRate: AppState.initialDailyRate,
        goldPerHour: AppState.goldPerHour,
        daysMap: AppState.daysMap,
        chartZoom: AppState.chartZoom,
        calendarMonth: AppState.calendarMonth,
        calendarYear: AppState.calendarYear,
        fracBaseVal: AppState.fracBaseVal,
        fracOperator: AppState.fracOperator,
        fracPercentage: AppState.fracPercentage,
        fracDivisor: AppState.fracDivisor,
        calculatorHistory: AppState.calculatorHistory,
        goldPriceRate: AppState.goldPriceRate,
        goldPriceBase: AppState.goldPriceBase,
        customQuoteGoldQuery: AppState.customQuoteGoldQuery,
        customQuoteUsdQuery: AppState.customQuoteUsdQuery,
        exRateBcv: AppState.exRateBcv,
        exRateCustom: AppState.exRateCustom,
        convUsdAmount: AppState.convUsdAmount,
        convBsAmount: AppState.convBsAmount,
        subStartDateStr: AppState.subStartDate ? AppState.formatKey(AppState.subStartDate) : null,
        subDuration: AppState.subDuration,
        selectedFont: AppState.selectedFont
    };

    try {
        localStorage.setItem('gold_quest_planner_data', JSON.stringify(payload));
        updateAutosaveTimestamp();
    } catch (err) {
        console.error("Autosave storage access failed:", err);
    }
}

function loadStateFromLocalStorage() {
    try {
        const stored = localStorage.getItem('gold_quest_planner_data');
        if (!stored) {
            updateSubscriptionUI();
            recalculateConversions();
            updateCustomQuoteUI();
            recalculateFractioningFormula();
            recalculateTimeMetrics();
            const now = new Date();
            AppState.calendarMonth = now.getMonth();
            AppState.calendarYear = now.getFullYear();
            renderCalendarView();
            return;
        }

        const data = JSON.parse(stored);

        if (data.selectedFont) {
            changePageFont(data.selectedFont);
        } else {
            changePageFont("'Inter', sans-serif");
        }

        AppState.calendarMonth = data.calendarMonth !== undefined ? data.calendarMonth : new Date().getMonth();
        AppState.calendarYear = data.calendarYear !== undefined ? data.calendarYear : new Date().getFullYear();

        if (data.subStartDateStr) {
            AppState.subStartDate = AppState.parseLocalDate(data.subStartDateStr) || new Date();
        } else {
            AppState.subStartDate = new Date();
        }
        AppState.subDuration = parseInt(data.subDuration, 10) || 30;

        inputSubStartDate.value = AppState.formatKey(AppState.subStartDate);
        inputSubDuration.value = AppState.subDuration;
        updateSubscriptionUI();

        AppState.fracBaseVal = parseFloat(data.fracBaseVal) !== undefined && !isNaN(parseFloat(data.fracBaseVal)) ? parseFloat(data.fracBaseVal) : 100.0000;
        AppState.fracOperator = data.fracOperator || 'sub';
        AppState.fracPercentage = parseFloat(data.fracPercentage) !== undefined && !isNaN(parseFloat(data.fracPercentage)) ? parseFloat(data.fracPercentage) : 20.00;
        AppState.fracDivisor = parseInt(data.fracDivisor, 10) || 3;
        AppState.calculatorHistory = data.calculatorHistory || [];

        inputFracBaseVal.value = AppState.fracBaseVal;
        selectFracOperator.value = AppState.fracOperator;
        inputFracPercentage.value = AppState.fracPercentage;
        selectFracDivisor.value = AppState.fracDivisor;

        recalculateFractioningFormula();
        renderCalcHistoryList();

        AppState.goldPriceRate = parseFloat(data.goldPriceRate) || 4.1;
        AppState.goldPriceBase = parseInt(data.goldPriceBase, 10) || 100000;
        AppState.customQuoteGoldQuery = parseInt(data.customQuoteGoldQuery, 10) || 100000;
        AppState.customQuoteUsdQuery = parseFloat(data.customQuoteUsdQuery) || 10.00;
        AppState.chartZoom = parseFloat(data.chartZoom) || 1.0;

        inputGoldPriceRate.value = AppState.goldPriceRate;
        inputGoldPriceBase.value = AppState.goldPriceBase;
        inputCustomQuoteGold.value = AppState.customQuoteGoldQuery;
        inputCustomQuoteUsd.value = AppState.customQuoteUsdQuery;

        zoomSlider.value = AppState.chartZoom;
        zoomLevelLabel.textContent = `${AppState.chartZoom.toFixed(1)}x`;

        AppState.exRateBcv = parseFloat(data.exRateBcv) || 36.50;
        AppState.exRateCustom = parseFloat(data.exRateCustom) || 44.20;
        AppState.convUsdAmount = parseFloat(data.convUsdAmount) || 10.00;
        AppState.convBsAmount = parseFloat(data.convBsAmount) || 100.00;

        inputExRateBcv.value = AppState.exRateBcv;
        inputExRateCustom.value = AppState.exRateCustom;
        inputConvUsd.value = AppState.convUsdAmount;
        inputConvBs.value = AppState.convBsAmount;

        recalculateConversions();
        updateCustomQuoteUI();

        AppState.goldPerHour = data.goldPerHour || 30000;
        inputGoldPerHour.value = AppState.goldPerHour;
        recalculateTimeMetrics();

        if (data.startDateStr && data.endDateStr && data.targetGold) {
            AppState.targetGold = data.targetGold;
            AppState.startDate = AppState.parseLocalDate(data.startDateStr);
            AppState.endDate = AppState.parseLocalDate(data.endDateStr);
            AppState.totalDays = data.totalDays;
            AppState.initialDailyRate = data.initialDailyRate;

            inputGoldTarget.value = AppState.targetGold;
            inputStartDate.value = data.startDateStr;
            inputEndDate.value = data.endDateStr;

            AppState.daysMap = {};
            if (data.daysMap) {
                Object.keys(data.daysMap).forEach(key => {
                    const item = data.daysMap[key];
                    AppState.daysMap[key] = {
                        dateString: item.dateString,
                        targetGold: item.targetGold,
                        actualGold: item.actualGold,
                        isCompleted: item.isCompleted
                    };
                });
            }

            recalculatePlan();

            emptyState.classList.add('hidden');
            resultsDashboard.classList.remove('hidden');
        } else {
            emptyState.classList.remove('hidden');
            resultsDashboard.classList.add('hidden');
            renderCalendarView();
        }

    } catch (err) {
        console.error("Failed loading persistent plan cache", err);
    }
}

// ============================================================
// EXPORTAR / IMPORTAR JSON
// ============================================================
function exportStateToJSON() {
    if (!AppState.startDate) {
        showToast("Por favor calcula un plan de oro antes de exportar copias.");
        return;
    }

    const payload = {
        targetGold: AppState.targetGold,
        startDateStr: AppState.formatKey(AppState.startDate),
        endDateStr: AppState.formatKey(AppState.endDate),
        totalDays: AppState.totalDays,
        initialDailyRate: AppState.initialDailyRate,
        goldPerHour: AppState.goldPerHour,
        daysMap: AppState.daysMap,
        chartZoom: AppState.chartZoom,
        calendarMonth: AppState.calendarMonth,
        calendarYear: AppState.calendarYear,
        fracBaseVal: AppState.fracBaseVal,
        fracOperator: AppState.fracOperator,
        fracPercentage: AppState.fracPercentage,
        fracDivisor: AppState.fracDivisor,
        calculatorHistory: AppState.calculatorHistory,
        goldPriceRate: AppState.goldPriceRate,
        goldPriceBase: AppState.goldPriceBase,
        customQuoteGoldQuery: AppState.customQuoteGoldQuery,
        customQuoteUsdQuery: AppState.customQuoteUsdQuery,
        exRateBcv: AppState.exRateBcv,
        exRateCustom: AppState.exRateCustom,
        convUsdAmount: AppState.convUsdAmount,
        convBsAmount: AppState.convBsAmount,
        subStartDateStr: AppState.formatKey(AppState.subStartDate),
        subDuration: AppState.subDuration,
        selectedFont: AppState.selectedFont
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `GoldQuest_Backup_${AppState.targetGold}_Gold.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast("Plan de oro exportado correctamente como archivo .json");
}

function handleJSONImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const data = JSON.parse(evt.target.result);

            if (!data.targetGold || !data.startDateStr || !data.endDateStr || !data.daysMap) {
                showToast("Formato de copia de seguridad JSON inválido.");
                return;
            }

            if (data.selectedFont) {
                changePageFont(data.selectedFont);
            }

            AppState.targetGold = data.targetGold;
            AppState.startDate = AppState.parseLocalDate(data.startDateStr);
            AppState.endDate = AppState.parseLocalDate(data.endDateStr);
            AppState.totalDays = data.totalDays;
            AppState.initialDailyRate = data.initialDailyRate;
            AppState.goldPerHour = data.goldPerHour || 30000;
            AppState.chartZoom = parseFloat(data.chartZoom) || 1.0;
            AppState.calendarMonth = data.calendarMonth !== undefined ? data.calendarMonth : new Date().getMonth();
            AppState.calendarYear = data.calendarYear !== undefined ? data.calendarYear : new Date().getFullYear();

            AppState.fracBaseVal = parseFloat(data.fracBaseVal) || 100.0000;
            AppState.fracOperator = data.fracOperator || 'sub';
            AppState.fracPercentage = parseFloat(data.fracPercentage) || 20.00;
            AppState.fracDivisor = parseInt(data.fracDivisor, 10) || 3;
            AppState.calculatorHistory = data.calculatorHistory || [];

            inputFracBaseVal.value = AppState.fracBaseVal;
            selectFracOperator.value = AppState.fracOperator;
            inputFracPercentage.value = AppState.fracPercentage;
            selectFracDivisor.value = AppState.fracDivisor;

            recalculateFractioningFormula();
            renderCalcHistoryList();

            AppState.goldPriceRate = parseFloat(data.goldPriceRate) || 4.1;
            AppState.goldPriceBase = parseInt(data.goldPriceBase, 10) || 100000;
            AppState.customQuoteGoldQuery = parseInt(data.customQuoteGoldQuery, 10) || 100000;
            AppState.customQuoteUsdQuery = parseFloat(data.customQuoteUsdQuery) || 10.00;

            AppState.exRateBcv = parseFloat(data.exRateBcv) || 36.50;
            AppState.exRateCustom = parseFloat(data.exRateCustom) || 44.20;
            AppState.convUsdAmount = parseFloat(data.convUsdAmount) || 10.00;
            AppState.convBsAmount = parseFloat(data.convBsAmount) || 100.00;

            if (data.subStartDateStr) {
                AppState.subStartDate = AppState.parseLocalDate(data.subStartDateStr) || new Date();
            } else {
                AppState.subStartDate = new Date();
            }
            AppState.subDuration = parseInt(data.subDuration, 10) || 30;

            inputGoldPerHour.value = AppState.goldPerHour;
            inputGoldPriceRate.value = AppState.goldPriceRate;
            inputGoldPriceBase.value = AppState.goldPriceBase;
            inputCustomQuoteGold.value = AppState.customQuoteGoldQuery;
            inputCustomQuoteUsd.value = AppState.customQuoteUsdQuery;
            zoomSlider.value = AppState.chartZoom;
            zoomLevelLabel.textContent = `${AppState.chartZoom.toFixed(1)}x`;

            inputExRateBcv.value = AppState.exRateBcv;
            inputExRateCustom.value = AppState.exRateCustom;
            inputConvUsd.value = AppState.convUsdAmount;
            inputConvBs.value = AppState.convBsAmount;

            inputSubStartDate.value = AppState.formatKey(AppState.subStartDate);
            inputSubDuration.value = AppState.subDuration;
            inputGoldTarget.value = AppState.targetGold;
            inputStartDate.value = data.startDateStr;
            inputEndDate.value = data.endDateStr;

            AppState.daysMap = {};
            Object.keys(data.daysMap).forEach(key => {
                const item = data.daysMap[key];
                AppState.daysMap[key] = {
                    dateString: item.dateString,
                    targetGold: item.targetGold,
                    actualGold: item.actualGold,
                    isCompleted: item.isCompleted
                };
            });

            recalculateConversions();
            updateCustomQuoteUI();
            recalculatePlan();
            recalculateTimeMetrics();

            emptyState.classList.add('hidden');
            resultsDashboard.classList.remove('hidden');

            showToast("¡Copia de seguridad cargada con éxito!");
        } catch (error) {
            showToast("Error al procesar el archivo. Formato incompatible.");
            console.error(error);
        }
    };
    reader.readAsText(file);
    e.target.value = '';
}

// ============================================================
// TOAST
// ============================================================
function showToast(message) {
    const existingToast = document.getElementById('gold-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.id = 'gold-toast';
    toast.className = "fixed bottom-5 right-5 z-[60] bg-slate-900 border border-amber-500 text-amber-200 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-semibold transition-all transform duration-300 translate-y-10 opacity-0";
    toast.innerHTML = `
        <i class="fa-solid fa-circle-check text-amber-400"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ============================================================
// MÓDULO QR
// ============================================================
function initializeQRModule() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

    const qrBtn = document.getElementById("qr-floating-btn");
    const modalPc = document.getElementById("qr-modal-pc");
    const modalMobile = document.getElementById("qr-modal-mobile");
    const closePc = document.getElementById("close-qr-pc");
    const closeMobile = document.getElementById("close-qr-mobile");
    const qrImg = document.getElementById("qr-code-img");
    const video = document.getElementById("qr-video");
    const canvas = document.getElementById("qr-canvas");
    const canvasCtx = canvas.getContext("2d");
    const cameraStatus = document.getElementById("qr-camera-status");

    let videoStream = null;
    let animationFrameId = null;

    if (isMobile) {
        qrBtn.innerHTML = `<i class="fa-solid fa-camera"></i><span class="ml-2 text-xs uppercase tracking-wider hidden sm:inline">Escanear PC</span>`;
        qrBtn.title = "Escanear QR de la PC";
    } else {
        qrBtn.innerHTML = `<i class="fa-solid fa-qrcode"></i><span class="ml-2 text-xs uppercase tracking-wider hidden sm:inline">Generar QR</span>`;
        qrBtn.title = "Generar QR para Móvil";
    }

    function getEssentialData() {
        const daysMap = AppState.daysMap || {};

        const compressedDays = Object.keys(daysMap).map(key => {
            const day = daysMap[key];
            return [key, day.actualGold || 0, day.isCompleted || false];
        });

        return {
            gt: document.getElementById("gold-target")?.value || AppState.targetGold || "",
            sd: document.getElementById("start-date")?.value || "",
            ed: document.getElementById("end-date")?.value || "",
            gph: document.getElementById("gold-per-hour")?.value || AppState.goldPerHour || "",
            gpr: document.getElementById("gold-price-rate")?.value || AppState.goldPriceRate || "",
            gpb: document.getElementById("gold-price-base")?.value || AppState.goldPriceBase || "",
            fbv: document.getElementById("frac-base-val")?.value || AppState.fracBaseVal || "",
            fo: document.getElementById("frac-operator")?.value || AppState.fracOperator || "sub",
            fp: document.getElementById("frac-percentage")?.value || AppState.fracPercentage || "",
            fd: document.getElementById("frac-divisor")?.value || AppState.fracDivisor || 3,
            erb: document.getElementById("ex-rate-bcv")?.value || AppState.exRateBcv || "",
            erc: document.getElementById("ex-rate-custom")?.value || AppState.exRateCustom || "",
            ssd: document.getElementById("sub-start-date")?.value || "",
            sdur: document.getElementById("sub-duration")?.value || AppState.subDuration || "",
            dm: compressedDays,
            td: AppState.totalDays || 0,
            ird: AppState.initialDailyRate || 0,
            v: "2.0"
        };
    }

    function applyEssentialData(data) {
        if (!data) return;

        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el && val !== undefined && val !== null && val !== "") {
                el.value = val;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        };

        setVal("gold-target", data.gt || data.goldTarget);
        setVal("start-date", data.sd || data.startDate);
        setVal("end-date", data.ed || data.endDate);
        setVal("gold-per-hour", data.gph || data.goldPerHour);
        setVal("gold-price-rate", data.gpr || data.goldPriceRate);
        setVal("gold-price-base", data.gpb || data.goldPriceBase);
        setVal("frac-base-val", data.fbv || data.fracBaseVal);
        setVal("frac-operator", data.fo || data.fracOperator || "sub");
        setVal("frac-percentage", data.fp || data.fracPercentage);
        setVal("frac-divisor", data.fd || data.fracDivisor || 3);
        setVal("ex-rate-bcv", data.erb || data.exRateBcv);
        setVal("ex-rate-custom", data.erc || data.exRateCustom);
        setVal("sub-start-date", data.ssd || data.subStartDate);
        setVal("sub-duration", data.sdur || data.subDuration);

        let daysMapData = data.dm || data.daysMap || {};

        if (Array.isArray(daysMapData) && daysMapData.length > 0) {
            const restoredDaysMap = {};
            let goldTarget = parseInt(data.gt || data.goldTarget, 10) || 0;

            daysMapData.forEach(([dateKey, actualGold, isCompleted]) => {
                restoredDaysMap[dateKey] = {
                    dateString: dateKey,
                    targetGold: 0,
                    actualGold: actualGold || 0,
                    isCompleted: isCompleted || false
                };
            });

            AppState.daysMap = restoredDaysMap;

            const keys = Object.keys(restoredDaysMap).sort();
            if (keys.length > 0) {
                AppState.totalDays = keys.length;
                if (goldTarget > 0) {
                    AppState.targetGold = goldTarget;
                    AppState.initialDailyRate = Math.round(goldTarget / keys.length);
                }

                const startKey = keys[0];
                const endKey = keys[keys.length - 1];
                AppState.startDate = AppState.parseLocalDate(startKey);
                AppState.endDate = AppState.parseLocalDate(endKey);

                keys.forEach((key, index) => {
                    if (AppState.daysMap[key]) {
                        if (index === keys.length - 1) {
                            const totalAssigned = (keys.length - 1) * AppState.initialDailyRate;
                            AppState.daysMap[key].targetGold = AppState.targetGold - totalAssigned;
                        } else {
                            AppState.daysMap[key].targetGold = AppState.initialDailyRate;
                        }
                    }
                });
            }

            if (AppState.startDate) {
                AppState.calendarMonth = AppState.startDate.getMonth();
                AppState.calendarYear = AppState.startDate.getFullYear();
            }

            recalculatePlan();

            emptyState.classList.add('hidden');
            resultsDashboard.classList.remove('hidden');

            if (AppState.startDate && AppState.endDate) {
                setVal("start-date", AppState.formatKey(AppState.startDate));
                setVal("end-date", AppState.formatKey(AppState.endDate));
                document.getElementById("start-date").min = AppState.formatKey(AppState.startDate);
            }

            if (AppState.targetGold > 0) {
                document.getElementById("gold-target").value = AppState.targetGold;
            }

        } else if (typeof daysMapData === 'object' && Object.keys(daysMapData).length > 0) {
            AppState.daysMap = daysMapData;
            AppState.totalDays = data.td || data.totalDays || 0;
            AppState.initialDailyRate = data.ird || data.initialDailyRate || 0;

            const keys = Object.keys(daysMapData).sort();
            if (keys.length > 0) {
                AppState.startDate = AppState.parseLocalDate(keys[0]);
                AppState.endDate = AppState.parseLocalDate(keys[keys.length - 1]);
                if (data.gt || data.goldTarget) {
                    AppState.targetGold = parseInt(data.gt || data.goldTarget, 10) || 0;
                }
                AppState.calendarMonth = AppState.startDate ? AppState.startDate.getMonth() : new Date().getMonth();
                AppState.calendarYear = AppState.startDate ? AppState.startDate.getFullYear() : new Date().getFullYear();
                recalculatePlan();
                emptyState.classList.add('hidden');
                resultsDashboard.classList.remove('hidden');
            }
        }

        recalculateConversions();
        updateCustomQuoteUI();
        recalculateFractioningFormula();
        recalculateTimeMetrics();
        updateSubscriptionUI();
        renderCalendarView();
        renderTableListView();

        saveStateToLocalStorage();

        const totalDays = Object.keys(AppState.daysMap || {}).length;
        const totalGold = AppState.targetGold || 0;
        const totalEarned = Object.values(AppState.daysMap || {}).reduce((sum, day) => sum + (day.actualGold || 0), 0);

        showToast(`✅ Datos sincronizados: ${totalDays} días, ${formatGoldNumber(totalEarned)} G recolectados de ${formatGoldNumber(totalGold)} G`);
    }

    qrBtn.addEventListener("click", () => {
        if (!isMobile) {
            const rawData = JSON.stringify(getEssentialData());
            const encodedData = encodeURIComponent(rawData);

            const sizeInBytes = new Blob([rawData]).size;
            const sizeInKB = (sizeInBytes / 1024).toFixed(2);

            if (sizeInBytes > 3000) {
                if (!confirm(`⚠️ El código QR contiene ${sizeInKB} KB de datos.\n¿Continuar? (Puede ser difícil de escanear)`)) {
                    return;
                }
            }

            qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedData}`;
            modalPc.classList.remove("hidden");
        } else {
            modalMobile.classList.remove("hidden");
            modalMobile.classList.add("flex");
            startCamera();
        }
    });

    closePc.addEventListener("click", () => modalPc.classList.add("hidden"));

    closeMobile.addEventListener("click", stopCamera);

    async function startCamera() {
        cameraStatus.innerText = "Solicitando permiso de cámara...";
        try {
            videoStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            video.srcObject = videoStream;
            video.setAttribute("playsinline", true);
            video.play();
            cameraStatus.innerText = "Apunta al código QR...";
            animationFrameId = requestAnimationFrame(scanQrFrame);
        } catch (err) {
            console.error("Error al acceder a la cámara:", err);
            cameraStatus.innerText = "Error: Permiso de cámara denegado o no disponible.";
        }
    }

    function stopCamera() {
        modalMobile.classList.add("hidden");
        modalMobile.classList.remove("flex");
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
        }
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    function scanQrFrame() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (code && code.data) {
                try {
                    const parsedData = JSON.parse(code.data);
                    stopCamera();
                    applyEssentialData(parsedData);
                    return;
                } catch (e) {
                    cameraStatus.innerText = "QR detectado pero sin formato válido.";
                }
            }
        }
        animationFrameId = requestAnimationFrame(scanQrFrame);
    }
}