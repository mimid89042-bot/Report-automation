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

// // updates R_d value and qd values
export function displayTWPrequired(c_u, NC, s_c1, s_c2, q1k, q2k) {

    // select output spans
    const cuSpan = document.getElementById("cu_value");
    const NcSpan = document.getElementById("NC_value");
    const scSpan = document.getElementById("sc_min_value");
    const RdSpan = document.getElementById("R_d");
    const q1kSpan = document.getElementById("q1k_value");
    const q1dSpan = document.getElementById("q1d_value");
    const q2kSpan = document.getElementById("q2k_value");
    const q2dSpan = document.getElementById("q2d_value");
    const twpDecision = document.getElementById("twp_decision");
    const platformBox = document.getElementById("platformMaterial"); //tie visibility to conditions met below

    if (!cuSpan || !NcSpan || !scSpan || !RdSpan || !q1kSpan || !q1dSpan || !q2kSpan || !q2dSpan || !twpDecision) return;

    // find minimum s_c
    const sc_min = Math.min(s_c1, s_c2);

    // compute R_d
    const Rd = c_u * NC * sc_min;

    // compute qd valuesa
    const q1d = 2.0 * q1k;
    const q2d = 1.5 * q2k;

    // update the DOM
    cuSpan.textContent = c_u;
    NcSpan.textContent = NC.toFixed(2);
    scSpan.textContent = sc_min.toFixed(2);
    RdSpan.textContent = " = " + Rd.toFixed(1) + " kPa";

    q1kSpan.textContent = q1k;
    q1dSpan.textContent = q1d.toFixed(1);

    q2kSpan.textContent = q2k;
    q2dSpan.textContent = q2d.toFixed(1);
    //TWP decision with comparisons
    let decisionText = "";
    if (q1d > Rd) {
        decisionText += 'Now &nbsp;&nbsp; q<sub>1d</sub> > R<sub>d</sub> <br>';
    } else {
        decisionText += 'Now &nbsp;&nbsp;&nbsp; q<sub>1d</sub> < R<sub>d</sub> <br>';
    }

    if (q2d > Rd) {
        decisionText += 'and &nbsp;&nbsp;&nbsp; q<sub>2d</sub> > R<sub>d</sub> <br>';
    } else {
        decisionText += 'and &nbsp;&nbsp;&nbsp; q<sub>2d</sub> < R<sub>d</sub> <br>';
    }

    
    if (q1d > Rd && q2d > Rd) {
        decisionText += 'therefore a working platform is required for plant support';
        //make platformMaterial box visible
        platformBox.classList.remove('hidden');
    } else { decisionText += 'therefore a working platform is NOT required for plant support';

    }
    twpDecision.innerHTML = decisionText; // use innerHTML to allow <br>
}


