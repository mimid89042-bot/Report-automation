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

        
// Sets up all event listeners to monitor user input and update the page dynamically
export function initEventListeners() {
    // Cohesive inputs
    document.getElementById("soil-selection-form").addEventListener("change", () => {
        const soil = document.getElementById("soilType").value;
        if (soil === "cohesive"){
            showElement('cohesive-inputs');
            showElement("geogrid-inputs"); 

            addCohesiveInputListeners();
        } 
        else {
            hideElement('cohesive-inputs');
            hideElement('geogrid-inputs');
        }
    });


    // Geogrid yes/no handler
    const geogridSelect = document.getElementById("geogrid");
    geogridSelect.addEventListener("change", () => {
        const tAllowableInput = document.getElementById("Tallowable");
        const nInput = document.getElementById("n");

        if (geogridSelect.value === "yes") {
            showElement("geogridValues");    // show Tallowable & n inputs
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
            hideElement("geogridValues");    // hide inputs if "no" or empty
            tAllowableInput.required = false; // remove required
            nInput.required = false;
        }

    });



    // Cu input handling
    const cuInput = document.getElementById("cu");
    cuInput.addEventListener("input", () => {
        if (!validateCu()) {
            document.getElementById("cuAlert").classList.remove("hidden");
           hideElement("cohesivePlatformDecision");
           hideElement("platformMaterial");
           hideElement("thickness");
           hideElement("geogridBox");
           hideElement("userParagraphSection");


        } else {
            document.getElementById("cuAlert").classList.add("hidden");
        }
    });
}

// All inputs are filled in check for cohesive
function allRequiredInputsFilled() {
    const requiredIds = ["cu", "phi", "gamma", "W", "q1k", "q2k", "L1d", "L2d", "geogrid"]; // add any required input IDs
    for (let id of requiredIds) {
        const el = document.getElementById(id);
        if (!el || el.value === "") return false;
    }

    // If geogrid is yes, Tallowable and n are required
    const geogridSelect = document.getElementById("geogrid");
    if (geogridSelect.value === "yes") {
        const tAllowable = document.getElementById("Tallowable");
        const n = document.getElementById("n");
        if (!tAllowable.value || !n.value) return false;
    }

    return true; // all required inputs are filled
}



// Function to add listeners to cohesive inputs
function addCohesiveInputListeners() {
    const cohesiveForm = document.getElementById("cohesive-inputs");
    if (!cohesiveForm || cohesiveForm.dataset.listenersAdded) return; // prevent duplicates

    const inputs = cohesiveForm.querySelectorAll("input, select");
    inputs.forEach(input => {
        input.addEventListener("input", runCalculations);
        input.addEventListener("change", runCalculations);
    });

    cohesiveForm.dataset.listenersAdded = "true"; // mark listeners as added
}


function runCalculations(){
      // Print alert for cu value
    if (!validateCu()){
        return;
    } 

    if (!allRequiredInputsFilled()) {
        // Hide boxes until all inputs are present
           hideElement("cohesivePlatformDecision");
           hideElement("platformMaterial");
           hideElement("thickness");
           hideElement("geogridBox");
           hideElement("userParagraphSection");
        return;
    }else {
        showElement("cohesivePlatformDecision");
    }

    //--------------------------------------------------
    // 1) Load input values
    //--------------------------------------------------
    for (const key in inputData){
        loadInput(key);
    }

    //--------------------------------------------------
    // 2) Compute first set of calculations
    //--------------------------------------------------

    // Calculate Ngamma
    loadCalculated("Ngamma", Ngamma(inputData.phi))

    // Update kpTanδ with user phi input
    loadCalculated("kptandelta", kptandelta(inputData.phi));

    // s_ factors 
    loadCalculated("sc1", sc(inputData.W, inputData.L1));
    loadCalculated("sc2", sc(inputData.W, inputData.L2));
    loadCalculated("sgamma1", sgamma(inputData.W, inputData.L1));
    loadCalculated("sgamma2", sgamma(inputData.W, inputData.L2));
    loadCalculated("sp1", sp(inputData.W, inputData.L1));
    loadCalculated("sp2", sp(inputData.W, inputData.L2));


    // R_d no geogrod
    loadCalculated("Rd1NoGeoGrid", RdNoGeoGrid(inputData.cu, calculatedData.sc1));
    loadCalculated("Rd2NoGeoGrid", RdNoGeoGrid(inputData.cu, calculatedData.sc2));

    
    // Factored loads
    loadCalculated("q1dA", q1dA(inputData.q1k));
    loadCalculated("q2dA", q2dA(inputData.q2k));
    loadCalculated("q1dB", q1dB(inputData.q1k));
    loadCalculated("q2dB", q2dB(inputData.q2k));
    loadCalculated("q1dC", q1dC(inputData.q1k));
    loadCalculated("q2dC", q2dC(inputData.q2k));
    
    //Reveal platform decision box
    showElement("cohesivePlatformDecision");

    //--------------------------------------------------
    // 3) DECISION STEP — Is platform required
    //--------------------------------------------------

    display_platformRequired(
        calculatedData.q1dA,   
        calculatedData.q2dA,   
        calculatedData.Rd1NoGeoGrid,
        calculatedData.Rd2NoGeoGrid  
    );

    const platformRequired = (
        calculatedData.q1dA > calculatedData.Rd1NoGeoGrid &&
        calculatedData.q2dA > calculatedData.Rd1NoGeoGrid
    );

    if (!platformRequired) {
        //--------------------------------------------------
        //  If platform NOT required 
        //--------------------------------------------------

        console.log("Platform NOT required");
        return;   // stop here!
    }

    //--------------------------------------------------
    // 4) PLATFORM REQUIRED 
    //--------------------------------------------------
    
    console.log("Platform required");

    
    //--------------------------------------------------
    // 5) PLATFORM MATERIAL
    //--------------------------------------------------

    loadCalculated("platformBC1", platformBC(inputData.gamma, 
        inputData.W, calculatedData.Ngamma, calculatedData.sgamma1));
    loadCalculated("platformBC2", platformBC(inputData.gamma, 
        inputData.W, calculatedData.Ngamma, calculatedData.sgamma2));


    display_subgradeVplatform(
        calculatedData.platformBC1,   
        calculatedData.platformBC2,   
        calculatedData.Rd1NoGeoGrid,
        calculatedData.Rd2NoGeoGrid, 
    )


    const platformStronger = (
        calculatedData.platformBC1 > calculatedData.Rd1NoGeoGrid &&
        calculatedData.platformBC2 > calculatedData.Rd2NoGeoGrid
    );

    if (!platformStronger) {
        //--------------------------------------------------
        //  If platform NOT stronger than subgrade
        //--------------------------------------------------
        console.log("Platform NOT stronger than subgrade");
    }else{
        console.log("Platform stronger than sugrade");
    }


    
    //--------------------------------------------------
    // 6) PLATFORM MATERIAL BEARING RESISTANCE
    //--------------------------------------------------

    loadCalculated("q1dB", q1dB(inputData.q1k));
    loadCalculated("q2dB", q2dB(inputData.q2k));

    // document.getElementById("platformBC_value2").textContent =
    //     Number(calculatedData.platformBC).toFixed(0);

    const bearingResistance = (
        calculatedData.platformBC1 > calculatedData.q1dB && calculatedData.platformBC2 > calculatedData.q2dB
    );

    display_bearingResistance(
        calculatedData.platformBC1, 
        calculatedData.platformBC2, 
        calculatedData.q1dB,
        calculatedData.q2dB
    )

    if (!bearingResistance) {
        //--------------------------------------------------
        //  If platform NOT able to provide bearing resistance
        //--------------------------------------------------

        console.log("Platform material NOT able to provide required bearing resistance");
    } else{
        console.log("Platform material able to provide bearing resistance");
    }

    //--------------------------------------------------
    // 7) THICKNESS OF PLATFORM
    //--------------------------------------------------

    loadCalculated("subgradeBC1", subgradeBC(inputData.cu, calculatedData.sc1));
    loadCalculated("subgradeBC2", subgradeBC(inputData.cu, calculatedData.sc2));

    loadCalculated("q1dB", q1dB(inputData.q1k));
    loadCalculated("q2dB", q2dB(inputData.q2k));
    
    loadCalculated("D1NoGeogrid", DNoGeogrid(inputData.W, calculatedData.q1dB, 
        calculatedData.subgradeBC1, inputData.gamma, calculatedData.kptandelta, calculatedData.sp1));
    loadCalculated("D2NoGeogrid", DNoGeogrid(inputData.W, calculatedData.q2dB, 
        calculatedData.subgradeBC2, inputData.gamma, calculatedData.kptandelta, calculatedData.sp2));

    
    loadCalculated("DlargerNoGeorgrid", Math.max(calculatedData.D1NoGeogrid, calculatedData.D2NoGeogrid));


      //ALERT FOR THICKNESS
   document.getElementById("noGeogridForm").addEventListener("submit", function(event) {
        event.preventDefault();

        if (!validateNOGeorgridThickness(calculatedData.DlargerNoGeorgrid)) {
            document.getElementById("thicknessNoGeogridAlert").classList.remove("hidden");
            console.log("Thickness too small");
        } else {
            document.getElementById("thicknessNoGeogridAlert").classList.add("hidden");
            console.log("Thickness OK");
        }

        updateSummaryVisibilityNoGeogrid();   // <-- IMPORTANT
    });



    //--------------------------------------------------
    // 8) THICKNESS OF PLATFORM WITH GEOGRID
    //--------------------------------------------------   

    const geogridChoice = document.getElementById("geogrid").value;

    if (geogridChoice == "yes") {
        // showElement("geogridBox");

        // Load tensile strength
        loadCalculated("Td", inputData.Tallowable * inputData.n);

        // Fist formula - with geogrid
        loadCalculated("D1WithGeogrid", DWithGeogrid(inputData.W, calculatedData.q1dB, 
            calculatedData.subgradeBC1, calculatedData.Td, inputData.gamma, 
            calculatedData.kptandelta, calculatedData.sp1));
        loadCalculated("D2WithGeogrid", DWithGeogrid(inputData.W, calculatedData.q2dB, 
            calculatedData.subgradeBC2, calculatedData.Td, inputData.gamma, 
            calculatedData.kptandelta, calculatedData.sp2));

        // Second formula - ignoring geogrid
        loadCalculated("D1NoGeogridC", DNoGeogrid(inputData.W, calculatedData.q1dC, 
            calculatedData.subgradeBC1, inputData.gamma, calculatedData.kptandelta, 
            calculatedData.sp1));
        loadCalculated("D2NoGeogridC", DNoGeogrid(inputData.W, calculatedData.q2dC, 
            calculatedData.subgradeBC2, inputData.gamma, calculatedData.kptandelta, 
            calculatedData.sp2));

        // Max D of first and second formula
        loadCalculated("D1largerWithGeorgrid", Math.max(calculatedData.D1WithGeogrid,
            calculatedData.D1NoGeogridC).toFixed(2));
        loadCalculated("D2largerWithGeorgrid", Math.max(calculatedData.D2WithGeogrid,
            calculatedData.D2NoGeogridC).toFixed(2));

        // Max of D1 and D2 with geogrid
        loadCalculated("DlargerWithGeorgrid", Math.max(calculatedData.D1largerWithGeorgrid,
            calculatedData.D2largerWithGeorgrid).toFixed(2));


        //INPUT FORM HANDLING
        document.getElementById("withGeogridForm").addEventListener("submit", function(event) {
            event.preventDefault();

            if (!validateWITHGeorgridThickness(calculatedData.DlargerWithGeorgrid)) {
                document.getElementById("thicknessWITHGeogridAlert").classList.remove("hidden");
                console.log("Thickness too small");
            } else {
                document.getElementById("thicknessWITHGeogridAlert").classList.add("hidden");
                console.log("Thickness OK");
            }

            updateSummaryVisibilityWithGeogrid();   // <-- IMPORTANT
        });
  

    }else{
        hideElement("geogridBox");
    }
}



// Submit button for COHESIVE INPUTS 
// document.getElementById("soil-selection").addEventListener("submit", function(event){
//     event.preventDefault();

  
// });