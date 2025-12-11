import { showElement, hideElement,updateNoGeogridThickness, updateWithGeogridThickness
         } from './dom.js';
import { inputData, calculatedData, loadInput, loadCalculated } from './data.js';
import { NgammaF, kptandeltaF, scF, sgammaF, spF, Rd_subgradeF, Rd_platformF, 
        q1dAF, q2dAF, q1dBF, q2dBF, q1dCF, q2dCF, 
        DNoGeogridF, DWithGeogridF } from './calculations.js';
import { validateCu, validateNOGeorgridThickness,
        validateWITHGeorgridThickness
        } from './validation.js';
import { addCohesiveInputListeners, runCalculations, hideFrom} from './events_helper.js'
import { updatePrintHeader } from './print.js';

// events.js (or state.js)
export const state = {
    alertNoGeoDismissed: false,
    alertWithGeoDismissed: false
};


// Sets up all event listeners to monitor user input and update the page dynamically
export function initEventListeners() {
    // Cohesive and granular inputs
    const soilSelect = document.getElementById("soilType");
    const soilLabel = document.getElementById("subgrade-volatile");
    const soilInput = document.getElementById("cu"); // default cohesive input

    soilSelect.addEventListener("change", () => {
        const soil = soilSelect.value;

        if (soil === "cohesive") {
            soilLabel.innerHTML = "C<sub>u</sub> (kPa):";
            soilInput.id = "cu";

            // Show geogrid section if needed
            showElement("geogrid-selection-form");

            // Add listeners for cohesive inputs only
            addCohesiveInputListeners();

        } else if (soil === "granular") {
            soilLabel.innerHTML = "ϕ'<sub>s</sub> (°):";
            soilInput.id = "phi_subgrade";
        } 

        showElement("cohesive-inputs-form");

        // Re-run calculations on switching
        //runCalculations();
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


    // NO Geogrid thickness input handling
    const thicknessInputNoGeo = document.getElementById("thickness-input-no-geogrid");
    const geogridSelect = document.getElementById("geogrid-yesorno");
    const closeAlertBtnNoGeogrid = document.getElementById("close-no-geogrid-alert");

    if (thicknessInputNoGeo) {
        thicknessInputNoGeo.addEventListener("input", () => {
            state.alertNoGeoDismissed = false; // reset dismissal if input changes
            updateNoGeogridThickness();
        });
    }

    if (geogridSelect) {
        geogridSelect.addEventListener("change", updateNoGeogridThickness);
    }

    if (closeAlertBtnNoGeogrid) {
        closeAlertBtnNoGeogrid.addEventListener("click", () => {
            document.getElementById("no-geogrid-thickness-alert").classList.add("hidden");
            state.alertNoGeoDismissed = true;
            updateNoGeogridThickness(); // re-evaluate boxes after closing alert
        });
    }

    // Run once on load
    updateNoGeogridThickness();


    const pointThreeAlert = document.getElementById("point-three-alert");
    const closePointThreeBtn = document.getElementById("close-point-three-alert");

    // Add click listener to close button
    if (closePointThreeBtn) {
        closePointThreeBtn.addEventListener("click", () => {
            pointThreeAlert.classList.add("hidden"); // hide alert
        });
    }



    // WITH Geogrid thickness input handling
    const thicknessInputWithGeo = document.getElementById("thickness-input-with-geogrid");
    const closeAlertBtnWithGeogrid = document.getElementById("close-with-geogrid-alert");

    if (thicknessInputWithGeo) {
        thicknessInputWithGeo.addEventListener("input", () => {
            state.alertWithGeoDismissed = false; // reset dismissal if input changes
            updateWithGeogridThickness();
        });
    }

    if (geogridSelect) {
        geogridSelect.addEventListener("change", updateWithGeogridThickness);
    }

    if (closeAlertBtnWithGeogrid) {
        closeAlertBtnWithGeogrid.addEventListener("click", () => {
            document.getElementById("with-geogrid-thickness-alert").classList.add("hidden");
            state.alertWithGeoDismissed = true;
            updateWithGeogridThickness(); // re-evaluate boxes after closing alert
        });
    }

    updateWithGeogridThickness(); // Run once on load

    //HEADER SAVING AND LOADING
    
    // First page inputs
    const projectNo = document.getElementById("projectNo");
    const designerName = document.getElementById("designerName");
    const reportDate = document.getElementById("reportDate");

    // Second page inputs
    const projectNo2 = document.getElementById("projectNo2");
    const designerName2 = document.getElementById("designerName2");
    const reportDate2 = document.getElementById("reportDate2");

    // Sync function
    function syncHeaders() {
        if (projectNo2) projectNo2.value = projectNo.value;
        if (designerName2) designerName2.value = designerName.value;
        if (reportDate2) reportDate2.value = reportDate.value;
    }

    // Listen for changes on first page
    [projectNo, designerName, reportDate].forEach(input => {
        input.addEventListener("input", syncHeaders);
    });

    // Run once on load
    syncHeaders();


}




