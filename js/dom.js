import { resultsData } from './data.js';
import { R_d } from './calculations.js'

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

// updates R_d value
export function displayTWPrequired(c_u, NC, s_c1, s_c2){
    const rdSpan = document.getElementById('R_d');
    if (!rdSpan) return;

    const minSc = Math.min(s_c1, s_c2);
    const RdValue = R_d(c_u, NC, minSc);

    rdSpan.textContent = RdValue.toFixed(2);

}
