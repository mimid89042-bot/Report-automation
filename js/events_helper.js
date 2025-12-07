const REQUIRED_INPUT_IDS = ["soilType", "cu", "phi", "gamma", "W", "q1k", "L1", "q2k", "L2", "geogrid-yesorno"
];
const REQUIRED_GEOGRID_IDS = ["Tallowable", "n"];
import { showElement, hideElement, displayPlatformRequiredText, 
        displayPlatformStrongertText, displayPlatformResistiveText,updateNoGeogridThickness,
        platformRequired, platformStronger, platformResistive
         } from './dom.js';
import { inputData, calculatedData, loadInput, loadCalculated } from './data.js';
import { NgammaF, kptandeltaF, scF, sgammaF, spF, Rd_subgradeF, Rd_platformF, 
        q1dAF, q2dAF, q1dBF, q2dBF, q1dCF, q2dCF, 
        DNoGeogridF, DWithGeogridF } from './calculations.js';
import { validateCu, validateNOGeorgridThickness,
        validateWITHGeorgridThickness
        } from './validation.js';


// Function to add listeners to cohesive inputs
export function addCohesiveInputListeners() {
    const cohesiveForm = document.getElementById("cohesive-inputs-form");
    if (!cohesiveForm || cohesiveForm.dataset.listenersAdded) return; // prevent duplicates

    const inputs = cohesiveForm.querySelectorAll("input, select");
    inputs.forEach(input => {
        input.addEventListener("input", runCalculations);
        input.addEventListener("change", runCalculations);
    });

    cohesiveForm.dataset.listenersAdded = "true"; // mark listeners as added
}


// Returns true or false
function allRequiredInputsFilled() {
    let requiredList = [...REQUIRED_INPUT_IDS];
    const geogridValue = document.getElementById("geogrid-yesorno").value;

    if (geogridValue === "yes") {
        requiredList = requiredList.concat(REQUIRED_GEOGRID_IDS);
    }

    for (const id of requiredList) {
        const el = document.getElementById(id);
        if (!el) continue;

        if (!el.value || el.value.trim() === "") {
            return false;
        }

        if (el.type === "number" && el.validity.badInput) {
            return false;
        }
    }

    return true;
}

// Function to hide all sections from a given one
export function hideFrom(sectionId) {
    const sections = [
    "soil-selection-form",
    "cohesive-inputs-form",
    "geogrid-selection-form",
    "cu-alert",
    "platform-required-box",
    "platform-stronger-box",
    "platform-not-stronger-alert",
    "platform-resistance-box",
    "platform-not-resistive-alert",
    "no-geogrid-thickness-box",
    "no-geogrid-thickness-alert",
    "with-geogrid-thickness-box",
    "with-geogrid-thickness-alert",
    "summary-box"
];
    const startIndex = sections.indexOf(sectionId);
    if (startIndex === -1) return; // Section not found

    for (let i = startIndex + 1; i < sections.length; i++) {
        hideElement(sections[i]);
    }
}


export function runCalculations(){
    if (!allRequiredInputsFilled()) {
        // Hide boxes until all inputs are present
        hideFrom("cu-alert");
        return;
    }else {
        //if all requires fields are filled load inputs 
        for (const key in inputData){
            loadInput(key);
        }
    }
    //check cu
    if(!validateCu()){
        showElement("cu-alert");
        hideFrom("cu-alert");
        return;
    }else{
        hideElement("cu-alert");
    }

    const cu = inputData.cu; 
    const phi = inputData.phi; 
    const gamma = inputData.gamma; 
    const W = inputData.W; 
    const L1 = inputData.L1; 
    const L2 = inputData.L2; 
    const q1k = inputData.q1k; 
    const q2k = inputData.q2k; 
    const Tallowable = inputData.Tallowable; 
    const n = inputData.n; 

    //--------------------
    // PLATFORM REQUIRED
    //--------------------

    // Calculate Ngamma
    loadCalculated("Ngamma", NgammaF(phi));
    const Ngamma = calculatedData.Ngamma;

    // Update kpTanδ with user phi input
    loadCalculated("kptandelta", kptandeltaF(phi));   
    const kptandelta = calculatedData.kptandelta;


    // s_ factors 
    loadCalculated("sc1", scF(W, L1));
    const sc1 = calculatedData.sc1;
    loadCalculated("sc2", scF(W, L2));
    const sc2 = calculatedData.sc2;
    loadCalculated("sgamma1", sgammaF(W, L1));
    const sgamma1 = calculatedData.sgamma1;
    loadCalculated("sgamma2", sgammaF(W, L2));
    const sgamma2 = calculatedData.sgamma2;
    loadCalculated("sp1", spF(W, L1));
    const sp1 = calculatedData.sp1;
    loadCalculated("sp2", spF(W, L2));
    const sp2 = calculatedData.sp2;


    // R_d no geogrod
    loadCalculated("Rd1_subgrade", Rd_subgradeF(cu, sc1));
    const Rd1_subgrade = calculatedData.Rd1_subgrade;
    loadCalculated("Rd2_subgrade", Rd_subgradeF(cu, sc2));
    const Rd2_subgrade = calculatedData.Rd2_subgrade;

    
    // Factored loads
    loadCalculated("q1dA", q1dAF(q1k));
    const q1dA = calculatedData.q1dA;
    loadCalculated("q2dA", q2dAF(q2k));
    const q2dA = calculatedData.q2dA;
    loadCalculated("q1dB", q1dBF(q1k));
    const q1dB = calculatedData.q1dB;
    loadCalculated("q2dB", q2dBF(q2k));
    const q2dB = calculatedData.q2dB;
    loadCalculated("q1dC", q1dCF(q1k));
    const q1dC = calculatedData.q1dC;
    loadCalculated("q2dC", q2dCF(q2k));
    const q2dC = calculatedData.q2dC;

    showElement("platform-required-box")


    //call the platform required decision 
    displayPlatformRequiredText(q1dA, q2dA, Rd1_subgrade, Rd2_subgrade);

    // Conditional alert or next box
    if(!platformRequired(q1dA, q2dA,Rd1_subgrade, Rd2_subgrade)){
        hideFrom("platform-required-box");
        showElement("summary-box");
        return;
    }else{
        hideElement("summary-box");
    } 

    //--------------------
    // PLATFORM STRONGER
    //--------------------

    loadCalculated("Rd1_platform", Rd_platformF(gamma, 
        W, Ngamma, sgamma1));
    const Rd1_platform = calculatedData.Rd1_platform;
    loadCalculated("Rd2_platform", Rd_platformF(gamma, 
        W, Ngamma, sgamma2));
    const Rd2_platform = calculatedData.Rd2_platform;
    
    
    showElement("platform-stronger-box");

    displayPlatformStrongertText(Rd1_platform, Rd2_platform, Rd1_subgrade, Rd2_subgrade);

    if(!platformStronger(Rd1_platform,Rd2_platform,Rd1_subgrade, Rd2_subgrade)){
        showElement("platform-not-stronger-alert");
        hideFrom("platform-not-stronger-alert");
        return;
    }else{
        hideElement("platform-not-stronger-alert");
    }

    //---------------------
    // PLATFORM RESISTANCE
    //--------------------

    showElement("platform-resistive-box");

    displayPlatformResistiveText(Rd1_platform, Rd2_platform,q1dB,q2dB);

    if(!platformResistive(Rd1_platform,Rd2_platform,Rd1_subgrade, Rd2_subgrade)){
        showElement("platform-not-resistive-alert");
        hideFrom("platforms-not-resistive-alert");
        return;
    }else{
        hideElement("platform-not-resistive-alert");
    }


    //-----------------------
    // NO GEOGRID THICKNESS
    //-----------------------

    showElement("no-geogrid-thickness-box");

    
    loadCalculated("D1NoGeogrid", DNoGeogridF(W, q1dB, Rd1_subgrade, gamma, kptandelta, sp1));
    const D1NoGeogrid = calculatedData.D1NoGeogrid;
    loadCalculated("D2NoGeogrid", DNoGeogridF(W, q2dB, Rd2_subgrade, gamma, kptandelta, sp2));
    const D2NoGeogrid = calculatedData.D2NoGeogrid;
    loadCalculated("DlargerNoGeorgrid", Math.max(D1NoGeogrid, D2NoGeogrid));



    //------------------------
    // WITH GEOGRID THICKNESS
    //------------------------  

    loadCalculated("Td", Tallowable * n);
    const Td = calculatedData.Td;

    // Fist formula - with geogrid
    loadCalculated("D1WithGeogrid", DWithGeogridF(W, q1dB, Rd1_subgrade,Td, gamma, kptandelta, sp1));
    const D1WithGeogrid = calculatedData.D1WithGeogrid;
    loadCalculated("D2WithGeogrid", DWithGeogridF(W, q2dB, Rd2_subgrade, calculatedData.Td, gamma, kptandelta, sp2));
    const D2WithGeogrid = calculatedData.TdD2WithGeogrid;

    // Second formula - ignoring geogrid
    loadCalculated("D1NoGeogridC", DNoGeogridF(W, q1dC, Rd1_subgrade, gamma, kptandelta, sp1));
    const D1NoGeogridC = calculatedData.D1NoGeogridC;
    loadCalculated("D2NoGeogridC", DNoGeogridF(W, q2dC, Rd2_subgrade, gamma, kptandelta, sp2));
    const D2NoGeogridC = calculatedData.D2NoGeogridC;

    // Max D of first and second formula
    loadCalculated("D1largerWithGeorgrid", Math.max(D1WithGeogrid,D1NoGeogridC).toFixed(2));
    const D1largerWithGeorgrid = calculatedData.D1largerWithGeorgrid;
    loadCalculated("D2largerWithGeorgrid", Math.max(calculatedData.D2WithGeogrid, D2NoGeogridC).toFixed(2));
    const D2largerWithGeorgrid = calculatedData.D2largerWithGeorgrid;

    // Max of D1 and D2 with geogrid
    loadCalculated("DlargerWithGeorgrid", Math.max(D1largerWithGeorgrid, D2largerWithGeorgrid).toFixed(2));

}
