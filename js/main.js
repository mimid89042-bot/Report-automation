// main.js
import * as Calc from './calculations.js';
import * as UI from './ui.js';

document.addEventListener("DOMContentLoaded", () => {
    // Setup toggle for soil type
    UI.setupSoilToggle();

    // Handle form submission
    document.getElementById("cohesive-inputs").addEventListener("submit", function(event){
        event.preventDefault();
        const form = event.target;
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const phi_p = parseFloat(document.getElementById("phi_p").value);

        const inputValues = {
            cu: parseFloat(document.getElementById("cu").value),
            W1d: parseFloat(document.getElementById("W1d").value),
            L1d: parseFloat(document.getElementById("L1d").value),
            W2d: parseFloat(document.getElementById("W2d").value),
            L2d: parseFloat(document.getElementById("L2d").value)
        };

        // Subgrade validation
        if (inputValues.cu <= 20 || inputValues.cu >= 80) {
            alert(inputValues.cu <= 20 ? "Subgrade too soft" : "Subgrade too stiff");
            return;
        }

        // Compute N_gamma_p
        const N_gamma = Calc.N_gamma_p(phi_p);
        UI.displayNgamma(N_gamma);

        // Update cases
        UI.updateCase(1, inputValues.W1d, inputValues.L1d);
        UI.updateCase(2, inputValues.W2d, inputValues.L2d);

        // Show results
        UI.showResults();
    });
});
