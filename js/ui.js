// ui.js
import * as Calc from './calculations.js';

// Update a single case's results in the DOM
export function updateCase(caseId, W, L) {
    document.getElementById(`sc_${caseId}`).textContent = Calc.s_c(W, L).toFixed(2);
    document.getElementById(`sgamma_${caseId}`).textContent = Calc.s_gamma(W, L).toFixed(2);
    document.getElementById(`sp_${caseId}`).textContent = Calc.s_p(W, L).toFixed(2);
}

// Toggle cohesive inputs visibility
// ui.js
export function setupSoilToggle() {
    const soilSelect = document.getElementById("soilType");
    const cohesiveDiv = document.getElementById("cohesiveInputs");

    soilSelect.addEventListener("change", () => {
        if (soilSelect.value === "cohesive") {
            cohesiveDiv.classList.remove("hidden");
        } else {
            cohesiveDiv.classList.add("hidden");
        }
    });
}


// Show results container
export function showResults() {
    document.getElementById("results").classList.remove("hidden");
}

// Display N_gamma_p
export function displayNgamma(N_gamma) {
    document.getElementById("N_gamma_p_display").textContent = N_gamma.toFixed(2);
}
