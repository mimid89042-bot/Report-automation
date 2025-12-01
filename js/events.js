import { showElement, hideElement, display_platformRequired, 
        display_subgradeVplatform, display_bearingResistance,
        display_geogridGreaterThanPointThree } from './dom.js';
import { inputData, calculatedData, loadInput, loadCalculated } from './data.js';
import { Ngamma, sc, sgamma, sp, RdNoGeoGrid, platformBC, 
        q1dA, q2dA, q1dB, q2dB, q1dC, q2dC, subgradeBC, DNoGeogrid, DWithGeogrid, finalRd } from './calculations.js';
import { validateInputs } from './validation.js';

export function initEventListeners() {
    // Soil type toggle
    document.getElementById("soilType").addEventListener("change", () => {
        const soil = document.getElementById("soilType").value;
        if (soil === "cohesive") showElement('cohesiveInputs');
        else hideElement('cohesiveInputs');
    });

    // -----------------------------
    // GEO-GRID YES / NO TOGGLE
    // -----------------------------
    document.getElementById("geogrid").addEventListener("change", () => {
        const val = document.getElementById("geogrid").value;

        if (val == "yes"){
            showElement("geogridInputs"); 
        }else{
            hideElement("geogridInputs");
        }

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


    // R_d no geogrod
    loadCalculated("sc_min", Math.min(calculatedData.sc1, calculatedData.sc2));
    loadCalculated("RdNoGeoGrid", RdNoGeoGrid(
        inputData.cu,
        calculatedData.sc_min
    ));

    
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
        calculatedData.RdNoGeoGrid  
    );

    const platformRequired = (
        calculatedData.q1dA > calculatedData.RdNoGeoGrid &&
        calculatedData.q2dA > calculatedData.RdNoGeoGrid
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

    
    loadCalculated("sgamma_min", Math.min(calculatedData.sgamma1, calculatedData.sgamma2));
    loadCalculated("platformBC", platformBC(inputData.gamma, 
        inputData.W, calculatedData.Ngamma, calculatedData.sgamma_min));

    display_subgradeVplatform(
        calculatedData.platformBC,   
        calculatedData.RdNoGeoGrid, 
    )


    const platformStronger = (
        calculatedData.platformBC > calculatedData.RdNoGeoGrid
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
        calculatedData.platformBC > calculatedData.q1d2 && calculatedData.platformBC > calculatedData.q2d2
    );

    display_bearingResistance(
        calculatedData.platformBC, 
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
    
    loadCalculated("D1NoGeogrid", DNoGeogrid(inputData.W, calculatedData.q1dB, calculatedData.subgradeBC1, inputData.gamma, calculatedData.kptandelta, calculatedData.sp1));
    loadCalculated("D2NoGeogrid", DNoGeogrid(inputData.W, calculatedData.q2dB, calculatedData.subgradeBC2, inputData.gamma, calculatedData.kptandelta, calculatedData.sp2));

    
    loadCalculated("DlargerNoGeorgrid", Math.max(calculatedData.D1NoGeogrid, calculatedData.D2NoGeogrid));

    //--------------------------------------------------
    // 8) THICKNESS OF PLATFORM WITH GEOGRID
    //--------------------------------------------------   

    const geogridChoice = document.getElementById("geogrid").value;

    if (geogridChoice == "yes") {
        showElement("geogridBox");

        loadCalculated("Td", inputData.Tult / 2);

        loadCalculated("D1WithGeogrid", DWithGeogrid(inputData.W, calculatedData.q1dB, 
            calculatedData.subgradeBC1, calculatedData.Td, inputData.gamma, 
            calculatedData.kptandelta, calculatedData.sp1));
        loadCalculated("D2WithGeogrid", DWithGeogrid(inputData.W, calculatedData.q2dB, 
            calculatedData.subgradeBC2, calculatedData.Td, inputData.gamma, 
            calculatedData.kptandelta, calculatedData.sp2));
        loadCalculated("DlargerWithGeorgrid", Math.max(calculatedData.D1WithGeogrid,
            calculatedData.D2WithGeogrid).toFixed(2));


        display_geogridGreaterThanPointThree(calculatedData.DlargerWithGeorgrid);

    }else{
        hideElement("geogridBox");
    }
});
