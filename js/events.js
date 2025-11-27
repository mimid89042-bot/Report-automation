import { showElement, hideElement, displayTWPrequired, display_subgradeVplatform } from './dom.js';
import { inputData, calculatedData, loadInput, loadCalculated } from './data.js';
import { Ngamma, sc, sgamma, sp, Rd, platformBC, q1d2, q2d2 } from './calculations.js';
import { validateInputs } from './validation.js';
import { NC } from './constants.js'


export function initEventListeners() {
    // Soil type toggle
    document.getElementById("soilType").addEventListener("change", () => {
        const soil = document.getElementById("soilType").value;
        if (soil === "cohesive") showElement('cohesiveInputs');
        else hideElement('cohesiveInputs');
    });
}

// Submit button for COHESIVE INPUTS 
document.getElementById("cohesive-inputs").addEventListener("submit", function(event){
    event.preventDefault();
    if (!validateInputs()) return;

    //--------------------------------------------------
    // 1) Load input values
    //--------------------------------------------------
    for (const key in inputData){
        loadInput(key);
    }

    //--------------------------------------------------
    // 2) Compute first set of calculations
    // Nc = 2 + pi = 5.14
    //--------------------------------------------------

    // Calculate Ngamma
    loadCalculated("Ngamma", Ngamma(inputData.phi))

    // Update kpTanδ with user phi input
    const phiMap = { 35: 3.1, 40: 5.5, 45: 10.0 };
    loadCalculated("kptandelta", phiMap[inputData.phi]);

    // s_ factors 
    loadCalculated("sc1", sc(inputData.W, inputData.L1));
    loadCalculated("sc2", sc(inputData.W, inputData.L2));
    loadCalculated("sgamma1", sgamma(inputData.W, inputData.L1));
    loadCalculated("sgamma2", sgamma(inputData.W, inputData.L2));
    loadCalculated("sp1", sp(inputData.W, inputData.L1));
    loadCalculated("sp2", sp(inputData.W, inputData.L2));


    // R_d
    loadCalculated("sc_min", Math.min(calculatedData.sc1, calculatedData.sc2));
    loadCalculated("Rd", Rd(
        inputData.cu,
        NC,
        calculatedData.sc_min
    ));

    
    // Factored loads
    loadCalculated("q1d", 2.0 * inputData.q1k);
    loadCalculated("q2d", 1.5 * inputData.q2k);
    
    //Reveal platform decision box
    showElement("cohesivePlatformDecision");

    //--------------------------------------------------
    // 3) DECISION STEP — Is platform material required?
    //--------------------------------------------------
    const platformRequired = (
        calculatedData.q1d > calculatedData.Rd &&
        calculatedData.q2d > calculatedData.Rd
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

    displayTWPrequired(
        calculatedData.q1d,   
        calculatedData.q2d,   
        calculatedData.Rd  
    );
    
    console.log("Platform required");

    
    //--------------------------------------------------
    // 5) PLATFORM MATERIAL
    //--------------------------------------------------

    
    //repeat ids
    document.getElementById("Ngamma_value2").textContent =
        Number(calculatedData.Ngamma).toFixed(0);
    document.getElementById("Rd_value2").textContent =
        Number(calculatedData.Rd).toFixed(0);
    document.getElementById("q1k_value2").textContent =
        Number(inputData.q1k).toFixed(0);
    document.getElementById("q2k_value2").textContent =
        Number(inputData.q2k).toFixed(0);



    
    loadCalculated("sgamma_min", Math.min(calculatedData.sgamma1, calculatedData.sgamma2));
    loadCalculated("platformBC", platformBC(inputData.gamma, 
        inputData.W, calculatedData.Ngamma, calculatedData.sgamma_min));

    display_subgradeVplatform(
        calculatedData.platformBC,   
        calculatedData.Rd, 
    )



    const platformStronger = (
        calculatedData.platformBC > calculatedData.Rd
    );

    if (!platformStronger) {
        //--------------------------------------------------
        //  If platform NOT stronger than subgrade
        //--------------------------------------------------

        console.log("Platform NOT stronger than subgrade");
        return;   // stop here!
    }

    display_subgradeVplatform(
        calculatedData.platformBC, 
        calculatedData.Rd,
    )

    console.log("Platform stronger than sugrade");


    
    //--------------------------------------------------
    // 6) PLATFORM MATERIAL BEARING TRESISTANCE
    //--------------------------------------------------

    loadCalculated("q1d2", q1d2(inputData.q1k));
    loadCalculated("q2d2", q2d2(inputData.q2k));




});
