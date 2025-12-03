import { showElement, hideElement, display_platformRequired, 
        display_subgradeVplatform, display_bearingResistance,updateSummaryVisibilityNoGeogrid
         } from './dom.js';
import { inputData, calculatedData, loadInput, loadCalculated } from './data.js';
import { Ngamma, sc, sgamma, sp, RdNoGeoGrid, platformBC, 
        q1dA, q2dA, q1dB, q2dB, q1dC, q2dC, subgradeBC, 
        DNoGeogrid, DWithGeogrid } from './calculations.js';
import { validateCu, validateNOGeorgridThickness,
        validateWITHGeorgridThickness
        } from './validation.js';

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
    const geogridSelect = document.getElementById("geogrid");
    const tAllowableInput = document.getElementById("Tallowable");
    const nInput = document.getElementById("n");
        if (geogridSelect.value == "yes"){
            showElement("geogridInputs"); 
            tAllowableInput.required = true;
            nInput.required = true;
        }else{
            hideElement("geogridInputs");
            tAllowableInput.required = false;
            nInput.required = false;
        }

    });

}


// Submit button for COHESIVE INPUTS 
document.getElementById("cohesive-inputs").addEventListener("submit", function(event){
    event.preventDefault();

    // Print alert for cu value
    if (!validateCu()){
        document.getElementById("cuAlert").classList.remove("hidden");
        return;
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
});