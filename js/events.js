import { showElement, hideElement, display_platformRequired, 
        display_subgradeVplatform, display_bearingResistance,updateSummaryVisibilityNoGeogrid
         } from './dom.js';
import { inputData, calculatedData, loadInput, loadCalculated } from './data.js';
import { Ngamma, kptandelta, sc, sgamma, sp, RdNoGeoGrid, platformBC, 
        q1dA, q2dA, q1dB, q2dB, q1dC, q2dC, subgradeBC, 
        DNoGeogrid, DWithGeogrid } from './calculations.js';
import { validateCu, validateNOGeorgridThickness,
        validateWITHGeorgridThickness
        } from './validation.js';
import { addCohesiveInputListeners, runCalculations} from './events_helper.js'

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
            hideElement('cohesive-inputs-form');
            hideElement('geogrid-selection-form');
            hideElement("platform-required-box");
           hideElement("platform-stronger-box");
            hideElement("platform-resistance-box");
           hideElement("no-geogrid-thickness-box");
           hideElement("with-geogrid-thickness-box");
           hideElement("summary-box");

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




// function checkAllInputsFilled() {
//     const filled = allRequiredInputsFilled();

//     if (filled) {
//         showElement("platform-required-box");
//     } else {
//         hideElement("platform-required-box");
//     }

//     return filled;
// }


// export function attachGlobalInputListeners() {
//     document.querySelectorAll("input, select").forEach(el => {
//         el.addEventListener("input", onAnyInputChanged);
//         el.addEventListener("change", onAnyInputChanged);
//     });
// }

// function onAnyInputChanged() {
//     if (!checkAllInputsFilled()) {
//         // Hide everything if incomplete
//         hideElement("platform-required-box");
//         hideElement("platform-stronger-box");
//         hideElement("platform-resistance-box");
//         hideElement("no-geogrid-thickness-box");
//         hideElement("with-geogrid-thickness-box");
//         hideElement("summary-box");
//         return;
//     }

//     // All required inputs exist → run full workflow
//     runCalculations();
//     updateSummaryVisibilityNoGeogrid();
//     display_platformRequired();
//     display_subgradeVplatform();
//     display_bearingResistance();
// }




