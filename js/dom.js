import { resultsData } from './data.js';

export function showElement(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
}

export function hideElement(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
}

export function updateDOMValues() {
    // example: update result spans
    if (!document.getElementById('N_gamma_p_display')) return;
    document.getElementById('N_gamma_p_display').textContent =
        resultsData.N_gamma_p.toFixed(2);
}

export function showResultsBox() {
    const box = document.getElementById('results');
    if (box) box.classList.remove('hidden');
}

export function updateResultsDisplay(resultsData) {
    const span = document.getElementById('N_gamma_p_display');
    if (span) span.textContent = resultsData.N_gamma_p.toFixed(2);
}
