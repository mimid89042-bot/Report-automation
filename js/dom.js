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
        text += 'Now &nbsp;&nbsp; q<sub>1d</sub> > R<sub>d1</sub> <br>';
    } else {
        text += 'Now &nbsp;&nbsp;&nbsp; q<sub>1d</sub> < R<sub>d1</sub> <br>';
    }

    if (q2dA > Rd2) {
        text += 'and &nbsp;&nbsp;&nbsp; q<sub>2d</sub> > R<sub>d2</sub> <br>';
    } else {
        text += 'and &nbsp;&nbsp;&nbsp; q<sub>2d</sub> < R<sub>d2</sub> <br>';
    }

    
    if (q1dA < Rd1 && q2dA < Rd2) {
        text += 'therefore a working platform is NOT required for plant support';
    } else { 
           text += 'therefore a working platform is required for plant support';
            //make platformMaterial box visible
            showElement("platformMaterial");

    }
    twpDecision.innerHTML = text; // use innerHTML to allow <br>
}

export function display_subgradeVplatform(platformBC1, platformBC2, Rd1, Rd2){
    let text = "";
    if(platformBC1 > Rd1){
        text += 'Now 0.5γ<sub>p</sub>W<sub>d</sub>N<sub>γp</sub>s<sub>γ1</sub> > c<sub>u</sub>N<sub>c</sub>s<sub>c1</sub> ';
    }else {
        text += 'Now 0.5γ<sub>p</sub>W<sub>d</sub>N<sub>γp</sub>s<sub>γ1</sub> > c<sub>u</sub>N<sub>c</sub>s<sub>c1</sub> ';
    }

    if(platformBC2 > Rd2){
        text += 'and 0.5γ<sub>p</sub>W<sub>d</sub>N<sub>γp</sub>s<sub>γ2</sub> > c<sub>u</sub>N<sub>c</sub>s<sub>c2</sub> <br>';
    }else {
        text += 'and 0.5γ<sub>p</sub>W<sub>d</sub>N<sub>γp</sub>s<sub>γ2</sub> > c<sub>u</sub>N<sub>c</sub>s<sub>c2</sub> <br>';
    }

    if(platformBC1 < Rd1 && platformBC2 < Rd2){
        text += " therefore platform is NOT stronger than subgrade"
    }else{
        text+= " therefore platform is stronger than subgrade<";
    }

    showElement("subgradeVplatform");
    subgradeVplatform.innerHTML = text;
}


export function display_bearingResistance(platformBC1, platformBC2, q1dB, q2dB){
    let text = "";
    if (q1dB < platformBC1) {
        text += 'Now q<sub>1d</sub> < 0.5γ<sub>p</sub>W<sub>d</sub> N<sub>γp</sub> s<sub>γ1</sub> ';
    } else {
        text += 'Now  q<sub>1d</sub> > 0.5γ<sub>p</sub>W<sub>d</sub> N<sub>γp</sub> s<sub>γ1</sub> ';
    }

    if (q2dB < platformBC2) {
        text += 'and q<sub>2d</sub> < 0.5γ<sub>p</sub>W<sub>d</sub> N<sub>γp</sub> s<sub>γ2</sub> <br>';
    } else {
        text += 'and  q<sub>2d</sub> > 0.5γ<sub>p</sub>W<sub>d</sub> N<sub>γp</sub> s<sub>γ2</sub> <br>';
    }

    
    if (q1dB > platformBC1 && q2dB > platformBC2) {
        text += 'therefore chosen platform material canNOT provide the required bearing resistance';
    } else { 
        text += 'therefore chosen platform material cannot provide the required bearing resistance';
    }
    showElement("thickness");
    bearingResistance.innerHTML = text;
}

export function updateSummaryVisibility() {
    const summary = document.getElementById("userParagraphSection");
    const alertOpen = !document.getElementById("thicknessNoGeogridAlert").classList.contains("hidden");

    if (alertOpen) {
        summary.classList.add("hidden");   // hide summary when alert is OPEN
    } else {
        summary.classList.remove("hidden"); // show summary when alert CLOSED
    }
}
