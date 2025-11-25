import { showElement, hideElement, showResultsBox, updateResultsDisplay, displayTWPrequired } from './dom.js';
import { inputData, resultsData } from './data.js';
import { N_gamma_p, updateCase } from './calculations.js';
import { validateInputs } from './validation.js';
import { NC } from './constants.js'

export function initEventListeners() {
    // Soil type toggle
    document.getElementById("soilType").addEventListener("change", () => {
        const soil = document.getElementById("soilType").value;
        if (soil === "cohesive") showElement('cohesiveInputs');
        else hideElement('cohesiveInputs');
    });

    // Form submission
    document.getElementById("cohesive-inputs").addEventListener("submit", function(event){
        event.preventDefault();
        if (!validateInputs()) return;

        inputData.cu = parseFloat(document.getElementById("cu").value);
        inputData.phi_p = parseFloat(document.getElementById("phi_p").value);
        inputData.gamma = parseFloat(document.getElementById("gamma").value);
        inputData.W1d = parseFloat(document.getElementById("W1d").value);
        inputData.L1d = parseFloat(document.getElementById("L1d").value);
        inputData.W2d = parseFloat(document.getElementById("W2d").value);
        inputData.L2d = parseFloat(document.getElementById("L2d").value);

        resultsData.N_gamma_p = N_gamma_p(inputData.phi_p);

        updateCase(1, inputData.W1d, inputData.L1d);
        updateCase(2, inputData.W2d, inputData.L2d);
        displayTWPrequired(
            inputData.cu,
            NC,
            resultsData.cases[1].s_c,
            resultsData.cases[2].s_c
        );

        // Update and show results in the DOM
        updateResultsDisplay(resultsData);
        showResultsBox();

        console.log("Form submitted", inputData, resultsData);
    });
}
