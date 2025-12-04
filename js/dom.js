import {validateNOGeorgridThickness} from './validation.js'
import { calculatedData } from './data.js';

export function showElement(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
}

export function hideElement(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
}


export function display_platformRequired(q1dA, q2dA, Rd1, Rd2) {
    //TWP decision with comparisons
    let text = "";
    if (q1dA > Rd1) {
        text += 'Now q<sub>1d</sub> > R<sub>d1_subgrade</sub> ';
    } else {
        text += 'Now ; q<sub>1d</sub> < R<sub>d1_subgrade</sub> ';
    }

    if (q2dA > Rd2) {
        text += 'and q<sub>2d</sub> > R<sub>d2_subgrade</sub>, ';
    } else {
        text += 'and q<sub>2d</sub> < R<sub>d2_subgrade</sub>, ';
    }

    
    if (q1dA < Rd1 && q2dA < Rd2) {
        text += 'therefore a working platform is NOT required for plant support';
    } else { 
           text += 'therefore a working platform is required for plant support';
            //make platformMaterial box visible
            showElement("platformMaterial");

    }
    twpDecision.innerHTML = text; // use innerHTML to allow 
}

export function display_subgradeVplatform(platformBC1, platformBC2, Rd1, Rd2){
    let text = "";
    if(platformBC1 > Rd1){
        text += 'Now R<sub>d1_platform</sub> > R<sub>d1_subgrade</sub> ';
    }else {
        text += 'Now R<sub>d1_platform</sub>  > R<sub>d1_subgrade</sub> ';
    }

    if(platformBC2 > Rd2){
        text += 'and R<sub>d2_platform</sub>  > R<sub>d2_subgrade</sub>, ';
    }else {
        text += 'and R<sub>d2_platform</sub>  > R<sub>d2_subgrade</sub>, ';
    }

    if(platformBC1 < Rd1 && platformBC2 < Rd2){
        text += " therefore platform is NOT stronger than subgrade"
    }else{
        text+= " therefore platform is stronger than subgrade";
    }

    showElement("subgradeVplatform");
    subgradeVplatform.innerHTML = text;
}


export function display_bearingResistance(platformBC1, platformBC2, q1dB, q2dB){
    let text = "";
    if (q1dB < platformBC1) {
        text += 'Now R<sub>d1_platform</sub> > q<sub>1d</sub> ';
    } else {
        text += 'Now R<sub>d1_platform</sub> < q<sub>1d</sub> ';
    }

    if (q2dB < platformBC2) {
        text += 'and R<sub>d2_platform</sub> > q<sub>2d</sub>, ';
    } else {
        text += 'and R<sub>d2_platform</sub> < q<sub>2d</sub>, ';
    }

    
    if (q1dB > platformBC1 && q2dB > platformBC2) {
        text += 'therefore chosen platform material canNOT provide the required bearing resistance';
    } else { 
        text += 'therefore chosen platform material cannot provide the required bearing resistance';
    }
    showElement("thickness");
    bearingResistance.innerHTML = text;
}

export function updateSummaryVisibilityNoGeogrid() {
    const summary = document.getElementById("userParagraphSection");
    const alertHidden = document.getElementById("thicknessNoGeogridAlert").classList.contains("hidden");
    const noGeogrid = document.getElementById("geogrid").value;
    const geogridBox = document.getElementById("geogridBox");

    if (alertHidden && (noGeogrid == "no")) {
        summary.classList.remove("hidden") ;// show summary when alert CLOSED

    } else if (alertHidden &&(noGeogrid == "yes")){
        geogridBox.classList.remove("hidden") ;// show summary when alert CLOSED
    } else {
        summary.classList.add("hidden") ;// hide summary when alert OPEN

    }
}

export function updateSummaryVisibilityWithGeogrid(){
    const summary = document.getElementById("userParagraphSection");
    const alertHidden = document.getElementById("thicknessWITHGeogridAlert").classList.contains("hidden");
    const noGeogrid = document.getElementById("geogrid").value;

    if (alertHidden && (noGeogrid == "yes")) {
        summary.classList.remove("hidden") ;// show summary when alert CLOSED
    } else  {
        summary.classList.add("hidden") ;// hide summary when alert OPEN

    }
}

window.updateSummaryVisibilityNoGeogrid = updateSummaryVisibilityNoGeogrid;
window.updateSummaryVisibilityWithGeogrid = updateSummaryVisibilityWithGeogrid;