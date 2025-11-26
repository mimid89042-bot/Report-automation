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
        document.getElementById("cu_value").textContent = inputData.cu;
        inputData.phi_p = parseFloat(document.getElementById("phi_p").value);
        //document.getElementById("phi_p_value").textContent = inputData.phi_p;
        inputData.gamma = parseFloat(document.getElementById("gamma").value);
        //document.getElementById("gamma_value").textContent = inputData.gamma;
        inputData.W1d = parseFloat(document.getElementById("W1d").value);
        //document.getElementById("W1d_value").textContent = inputData.W1d;
        inputData.L1d = parseFloat(document.getElementById("L1d").value);
        //document.getElementById("L1d_value").textContent = inputData.L1d;
        inputData.W2d = parseFloat(document.getElementById("W2d").value);
        //document.getElementById("W2d_value").textContent = inputData.W2d;
        inputData.L2d = parseFloat(document.getElementById("L2d").value);
        //document.getElementById("L2d_value").textContent = inputData.L2d;
        inputData.q1k = parseFloat(document.getElementById("q1k").value);
        document.getElementById("q1k_value").textContent = inputData.q1k;
        inputData.q2k = parseFloat(document.getElementById("q2k").value);
        document.getElementById("q2k_value").textContent = inputData.q2k;


        resultsData.q1d = 2.0 * inputData.q1k;
        resultsData.q2d = 1.5 * inputData.q2k;
        document.getElementById("q1d_value").textContent = resultsData.q1d;
        document.getElementById("q2d_value").textContent = resultsData.q2d;



        resultsData.N_gamma_p = N_gamma_p(inputData.phi_p);

        updateCase(1, inputData.W1d, inputData.L1d);
        updateCase(2, inputData.W2d, inputData.L2d);
        displayTWPrequired(
            inputData.cu,
            NC,
            resultsData.cases[1].s_c,
            resultsData.cases[2].s_c,
            inputData.q1k,
            inputData.q2k
        );

        // Update and show results in the DOM
        updateResultsDisplay(resultsData);
        showResultsBox();

        console.log("Form submitted", inputData, resultsData);
    });
}
