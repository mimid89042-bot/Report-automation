import { showElement, hideElement,
         } from './dom.js';
import { inputData, calculatedData, loadInput, loadCalculated } from './data.js';
import { NgammaF, kptandeltaF, scF, sgammaF, spF, Rd_subgradeF, Rd_platformF, 
        q1dAF, q2dAF, q1dBF, q2dBF, q1dCF, q2dCF, 
        DNoGeogridF, DWithGeogridF } from './calculations.js';
import { validateCu, validateNOGeorgridThickness,
        validateWITHGeorgridThickness
        } from './validation.js';
import { addCohesiveInputListeners, runCalculations, hideFrom} from './events_helper.js'

// Sets up all event listeners to monitor user input and update the page dynamically
export function initEventListeners() {
    // Cohesive inputs
    document.getElementById("soil-selection-form").addEventListener("change", () => {
        const soil = document.getElementById("soilType").value;
        if (soil === "cohesive"){
            showElement('cohesive-inputs-form');
            showElement("geogrid-selection-form"); 

            addCohesiveInputListeners();
        } 
        else {
            hideFrom("soil-selection-form");
        }
    });


    // Geogrid yes/no handler
    document.getElementById("geogrid-selection-form").addEventListener("change", () => {
        const geogridSelect = document.getElementById("geogrid-yesorno");
        const tAllowableInput = document.getElementById("Tallowable");
        const nInput = document.getElementById("n");

        if (geogridSelect.value === "yes") {
            showElement("geogrid-inputs");    // show Tallowable & n inputs
            tAllowableInput.required = true;  // make inputs required
            nInput.required = true;
            // If geogrid is selected add listeners
            if (tAllowableInput && nInput) {
                [tAllowableInput, nInput].forEach(input => {
                    input.addEventListener("input", runCalculations);
                    input.addEventListener("change", runCalculations);
                });
            }
        } else {
            hideElement("geogrid-inputs");    // hide inputs if "no" or empty
            tAllowableInput.required = false; // remove required
            nInput.required = false;
        }

        runCalculations(); // run when selection changes as well as input
    });



    // Cu input handling
    const cuInput = document.getElementById("cu");
    cuInput.addEventListener("input", () => {
        if (!validateCu()) {
            document.getElementById("cu-alert").classList.remove("hidden");
        } else {
            document.getElementById("cu-alert").classList.add("hidden");
        }
    });
}




