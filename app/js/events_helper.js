const REQUIRED_INPUT_IDS = ["soilType","W", "q1k", "L1", "q2k", "L2", "geogrid-yesorno"
];
const REQUIRED_INPUT_IDS_COHESIVE = ["cu", "phi_platform_cohesive", "gamma_platform_cohesive"];
const REQUIRED_INPUT_IDS_GRANULAR  = ["phi_subgrade","gamma_subgrade",
      "phi_platform_granular", "gamma_platform_granular"];
const REQUIRED_GEOGRID_IDS = ["Tallowable", "n"];
import { showElement, hideElement, showClass, hideClass, displayPlatformRequiredText, 
        displayPlatformStrongertTextCohesive, displayPlatformStrongertTextGranular,
        displayPlatformResistiveText,
        updateNoGeogridThickness,updateWithGeogridThickness,
        platformRequired, platformStrongerCohesive, platformStrongerGranular, platformResistive
         } from './dom.js';
import { inputData, calculatedData, loadInput, loadCalculated } from './data.js';
import { NgammaF, kptandeltaF, scF, sgammaF, spF, Rd_subgradeF, Rd_platformF, 
        q1dAF, q2dAF, q1dBF, q2dBF, q1dCF, q2dCF, 
        DNoGeogridF, DWithGeogridF } from './calculations.js';
import { validateCu} from './validation.js';

// State flags
export const state = {
    alertNoGeoDismissed: false,
    alertWithGeoDismissed: false,
};


// Get soil type logic
const soilSelectEl = document.getElementById("soilType");
function getSoilType() {
  return soilSelectEl ? soilSelectEl.value : null;
}

// Listeners for all inputs
function attachListenersToForm(formId) {
    const form = document.getElementById(formId);
    if (!form || form.dataset.listenersAdded === "true") return;

    const inputs = form.querySelectorAll("input, select");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            runCalculations();
            updateNoGeogridThickness();
            updateWithGeogridThickness();
        });
        input.addEventListener("change", () => {
            runCalculations();
            updateNoGeogridThickness();
            updateWithGeogridThickness();
        });
    });

    form.dataset.listenersAdded = "true"; // prevent duplicates
}

// Attach listeners based on soil type
export function addInputListeners() {
    const soilType = getSoilType();
    if (soilType === "cohesive") attachListenersToForm("cohesive-inputs-form");
    else if (soilType === "granular") attachListenersToForm("granular-inputs-form");

    // Case loading inputs always attach
    attachListenersToForm("case-loading-inputs-form");
}

// Returns true or false
function allRequiredInputsFilled() {
    let requiredList = REQUIRED_INPUT_IDS.slice();
    const geogridValue = document.getElementById("geogrid-yesorno").value;

    if ( getSoilType() == "cohesive"){
        requiredList = requiredList.concat(REQUIRED_INPUT_IDS_COHESIVE);
    }else if ( getSoilType() == "granular"){
        requiredList = requiredList.concat(REQUIRED_INPUT_IDS_GRANULAR);
    }

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
    "granular-inputs-form",
    "case-loading-inputs-form",
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
    "point-three-alert",
    "with-geogrid-thickness-alert",
    "summary-box"
    ];

    // Find index of sectionId (starts from 0)
    const startIndex = sections.indexOf(sectionId);
    // If not found, do nothing and return
    if (startIndex === -1) return;

    // Hide all sections including that index onward
    for (let i = startIndex; i < sections.length +1; i++) {
        const sectionToHide = sections[i];
        // Locate section by ID
        const el = document.getElementById(sectionToHide);
        // If it exists then hide it 
        if(el) {
            el.style.display = "none";
        }
    }
}

//------------------------------------------------------//
//                   SCRIPT FLOW                        //
//------------------------------------------------------//

// RUN CALCULATIONS
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


    // Update thickness boxes on each calculation run
    updateNoGeogridThickness();
    updateWithGeogridThickness();


    //Shared inputs
    const W = inputData.W; 
    const L1 = inputData.L1; 
    const L2 = inputData.L2; 
    const q1k = inputData.q1k; 
    const q2k = inputData.q2k; 
    const Tallowable = inputData.Tallowable; 
    const n = inputData.n; 
    const cu = inputData.cu; // potential bug 

    let phi_platform;
    let gamma_platform;
    // Granular only
    let phi_subgrade;
    let gamma_subgrade;

    if (getSoilType() == "cohesive"){
        phi_platform = inputData.phi_platform_cohesive; 
        gamma_platform = inputData.gamma_platform_cohesive; 
        if(!validateCu()){
            showElement("cu-alert");
            hideFrom("cu-alert");
            return;
        }else{
            hideElement("cu-alert");
        }
    } else if (getSoilType() == "granular"){
        phi_platform = inputData.phi_platform_granular; 
        gamma_platform = inputData.gamma_platform_granular; 
        phi_subgrade = inputData.phi_subgrade;
        gamma_subgrade = inputData.gamma_subgrade;

        if (phi_platform < phi_subgrade){
        hideElement("cu-alert");
        showClass("platform-not-stronger-alert");
        hideFrom("platform-not-stronger-alert");
        }
    }

    // For shared thickness boxes have one gamma_platform
    loadCalculated("gamma_platform", gamma_platform);

    //--------------------
    // PLATFORM REQUIRED
    //--------------------

    showElement("platform-required-box");

    loadCalculated("Ngamma_platform", NgammaF(phi_platform));
    const Ngamma_platform = calculatedData.Ngamma_platform;  // Both have Ngamma-p

    let Ngamma_subgrade;
    if(getSoilType() == "granular"){
        loadCalculated("Ngamma_subgrade", NgammaF(phi_subgrade));
        Ngamma_subgrade = calculatedData.Ngamma_subgrade;  // Granular needs Ngamma-s
    }

    //Update Nc or Ngammas
    if ( getSoilType() == "cohesive"){
        showElement("Nc");
        hideElement("Ngammas");
    } else if ( getSoilType() == "granular"){
        loadCalculated("Ngamma_subgrade", NgammaF(phi_subgrade));
        Ngamma_subgrade = calculatedData.Ngamma_subgrade;
        hideElement("Nc");
        showElement("Ngammas");
    }

    loadCalculated("kptandelta", kptandeltaF(phi_platform));   // Both have Kptandelta
    const kptandelta = calculatedData.kptandelta;

    // s_ factors 
    let sc1;
    let sc2;

    if (getSoilType() == "cohesive"){
        loadCalculated("sc1", scF(W, L1));
        sc1 = calculatedData.sc1;
        loadCalculated("sc2", scF(W, L2));    // Cohesive needs sc
        sc2 = calculatedData.sc2;
        showClass("sc");
    }else {
        hideClass("sc");
    }
    loadCalculated("sgamma1", sgammaF(W, L1));
    const sgamma1 = calculatedData.sgamma1;
    loadCalculated("sgamma2", sgammaF(W, L2));
    const sgamma2 = calculatedData.sgamma2;
    loadCalculated("sp1", spF(W, L1));
    const sp1 = calculatedData.sp1;
    loadCalculated("sp2", spF(W, L2));
    const sp2 = calculatedData.sp2;


    let Rd1_subgrade;
    let Rd2_subgrade;

    if (getSoilType() == "cohesive"){
        // Rd_subgrade no geogrid COHESIVE
        loadCalculated("Rd1_subgrade_cohesive", Rd_subgradeF(cu, sc1));
        Rd1_subgrade = calculatedData.Rd1_subgrade_cohesive;
        loadCalculated("Rd2_subgrade_cohesive", Rd_subgradeF(cu, sc2));
        Rd2_subgrade = calculatedData.Rd2_subgrade_cohesive;

        showClass("Rd_subgrade_cohesive");
        hideClass("Rd_subgrade_granular");
    } else if (getSoilType() == "granular"){
        // Rd_subgrade GRANULAR   --- note using Rd platform formula for Rd subgrade!!!
        loadCalculated("Rd1_subgrade_granular", Rd_platformF(
            gamma_subgrade, W, Ngamma_subgrade, sgamma1));
        Rd1_subgrade = calculatedData.Rd1_subgrade_granular;
        loadCalculated("Rd2_subgrade_granular", Rd_platformF(
            gamma_subgrade, W, Ngamma_subgrade, sgamma2));
        Rd2_subgrade = calculatedData.Rd2_subgrade_granular;

        hideClass("Rd_subgrade_cohesive");
        showClass("Rd_subgrade_granular");
    }

     //Shared Rd_subgrade for printing
    loadCalculated("Rd1_subgrade", Rd1_subgrade);
    loadCalculated("Rd2_subgrade", Rd2_subgrade);


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

    //call the platform required decision 
    displayPlatformRequiredText(q1dA, q2dA, Rd1_subgrade, Rd2_subgrade);

    // Conditional alert or next box
    if(!platformRequired(q1dA, q2dA,Rd1_subgrade, Rd2_subgrade)){
        hideFrom("platform-required-box");
        showElement("summary-box");
        return;
    }else{
        showElement("platform-stronger-box");
        hideElement("summary-box");
    } 

    //--------------------
    // PLATFORM STRONGER
    //--------------------

    let Rd1_platform;     // for cohesive 
    let Rd2_platform;

    //Boolean shared by both
    let PlatformStronger;

    // Rd platform handling for both cohesive and granular
    //  -->  (Granular Rd platform gets used in resistance box)
    if (getSoilType() == "cohesive"){
        // R1_platform cohesive
        loadCalculated("Rd1_platform_cohesive", Rd_platformF(gamma_platform, 
            W, Ngamma_platform, sgamma1));
        Rd1_platform = calculatedData.Rd1_platform_cohesive;
        loadCalculated("Rd1_platform", Rd1_platform);

        // R2_platform cohesive
        loadCalculated("Rd2_platform_cohesive", Rd_platformF(gamma_platform, 
            W, Ngamma_platform, sgamma2));
        Rd2_platform = calculatedData.Rd2_platform_cohesive;
        loadCalculated("Rd2_platform", Rd2_platform);

        
        displayPlatformStrongertTextCohesive(Rd1_platform, Rd2_platform, Rd1_subgrade, Rd2_subgrade);
        PlatformStronger = platformStrongerCohesive(Rd1_platform, Rd2_platform, Rd1_subgrade, Rd2_subgrade);

        showElement("platform-stronger-cohesive");
        hideElement("platform-stronger-granular");
    } else if (getSoilType() == "granular"){
        // R1_platform granular
        loadCalculated("Rd1_platform_granular", Rd_platformF(gamma_platform, 
            W, Ngamma_platform, sgamma1));
        Rd1_platform = calculatedData.Rd1_platform_granular;
        loadCalculated("Rd1_platform", Rd1_platform);

        // R2_platform granular
        loadCalculated("Rd2_platform_granular", Rd_platformF(gamma_platform, 
            W, Ngamma_platform, sgamma2));
        Rd2_platform = calculatedData.Rd2_platform_granular;
        loadCalculated("Rd2_platform", Rd2_platform);

        
        displayPlatformStrongertTextGranular(phi_platform, phi_subgrade);
        PlatformStronger = platformStrongerGranular(phi_platform, phi_subgrade);

        hideElement("platform-stronger-cohesive");
        showElement("platform-stronger-granular")
    }

    if(!PlatformStronger){
        showElement("platform-not-stronger-alert");
        hideFrom("platform-not-stronger-alert");
        return;
    }else{
        hideElement("platform-not-stronger-alert");
    }

    //---------------------
    // PLATFORM RESISTANCE
    //--------------------

    showElement("platform-resistance-box");

    if (getSoilType() == "cohesive"){
        showClass("platform-resistive-cohesive")
        hideClass("platform-resistive-granular");
    } else if (getSoilType() == "granular"){
        hideClass("platform-resistive-cohesive")
        showClass("platform-resistive-granular");
    }


    displayPlatformResistiveText(Rd1_platform, Rd2_platform,q1dB,q2dB);

    if(!platformResistive(Rd1_platform,Rd2_platform,q1dB,q2dB)){
        showElement("platform-not-resistive-alert");
        hideFrom("platform-not-resistive-alert");
        return;
    }else{
        hideElement("platform-not-resistive-alert");
    }


    //-----------------------
    // NO GEOGRID THICKNESS
    //-----------------------

    showElement("no-geogrid-thickness-box");
        
    // Switch Rd_subgrade for cohesive and granular
    if (getSoilType() === "cohesive") {

        document.querySelectorAll(".Rd1_subgradeSWITCH").forEach(el => {
            el.innerHTML = "c<sub>u</sub>N<sub>c</sub>s<sub>c1</sub>";
        });

        document.querySelectorAll(".Rd2_subgradeSWITCH").forEach(el => {
            el.innerHTML = "c<sub>u</sub>N<sub>c</sub>s<sub>c2</sub>";
        });

    } else if (getSoilType() === "granular") {

        document.querySelectorAll(".Rd1_subgradeSWITCH").forEach(el => {
            el.innerHTML = "0.5γ<sub>s</sub>W<sub>d</sub>N<sub>γs</sub>s<sub>γ1</sub>";
        });

        document.querySelectorAll(".Rd2_subgradeSWITCH").forEach(el => {
            el.innerHTML = "0.5γ<sub>s</sub>W<sub>d</sub>N<sub>γs</sub>s<sub>γ2</sub>";
        });
    }

    
    loadCalculated("D1NoGeogrid", DNoGeogridF(W, q1dB, Rd1_subgrade, gamma_platform, kptandelta, sp1));
    const D1NoGeogrid = calculatedData.D1NoGeogrid;
    loadCalculated("D2NoGeogrid", DNoGeogridF(W, q2dB, Rd2_subgrade, gamma_platform, kptandelta, sp2));
    const D2NoGeogrid = calculatedData.D2NoGeogrid;
    loadCalculated("DlargerNoGeorgrid", Math.max(D1NoGeogrid, D2NoGeogrid));



    //------------------------
    // WITH GEOGRID THICKNESS
    //------------------------  


    loadCalculated("Td", Tallowable * n);
    const Td = calculatedData.Td;

    // Fist formula - with geogrid
    loadCalculated("D1WithGeogrid", DWithGeogridF(W, q1dB, Rd1_subgrade,Td, gamma_platform, kptandelta, sp1));
    const D1WithGeogrid = calculatedData.D1WithGeogrid;
    loadCalculated("D2WithGeogrid", DWithGeogridF(W, q2dB, Rd2_subgrade, Td, gamma_platform, kptandelta, sp2));
    const D2WithGeogrid = calculatedData.D2WithGeogrid;

    console.log("D1 with geogrid: ", D1WithGeogrid);
    console.log("D2 with geogrid: ", D2WithGeogrid);

    if (D1WithGeogrid <= 0.3 && D2WithGeogrid <= 0.3){
        showElement("point-three-alert");
    }

    // Second formula - ignoring geogrid
    loadCalculated("D1NoGeogridC", DNoGeogridF(W, q1dC, Rd1_subgrade, gamma_platform, kptandelta, sp1));
    const D1NoGeogridC = calculatedData.D1NoGeogridC;
    loadCalculated("D2NoGeogridC", DNoGeogridF(W, q2dC, Rd2_subgrade, gamma_platform, kptandelta, sp2));
    const D2NoGeogridC = calculatedData.D2NoGeogridC;

    // Max D of first and second formula
    loadCalculated("D1largerWithGeorgrid", Math.max(D1WithGeogrid,D1NoGeogridC).toFixed(2));
    const D1largerWithGeorgrid = calculatedData.D1largerWithGeorgrid;
    loadCalculated("D2largerWithGeorgrid", Math.max(calculatedData.D2WithGeogrid, D2NoGeogridC).toFixed(2));
    const D2largerWithGeorgrid = calculatedData.D2largerWithGeorgrid;

    // Max of D1 and D2 with geogrid
    loadCalculated("DlargerWithGeorgrid", Math.max(D1largerWithGeorgrid, D2largerWithGeorgrid).toFixed(2));

}

