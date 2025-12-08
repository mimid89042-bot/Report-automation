import { calculatedData } from './data.js';
import { state  } from './events.js';


export function showElement(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
}

export function hideElement(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
}


export function platformRequired(q1dA, q2dA, Rd1_subgrade, Rd2_subgrade) {
  return !(q1dA < Rd1_subgrade || q2dA < Rd2_subgrade);
}

export function displayPlatformRequiredText(q1dA, q2dA, Rd1_subgrade, Rd2_subgrade) {
    //TWP decision with comparisons
    let text = "";
    if (q1dA > Rd1_subgrade) {
        text += 'Now q<sub>1d</sub> > R<sub>d1_subgrade</sub> ';
    } else {
        text += 'Now q<sub>1d</sub> < R<sub>d1_subgrade</sub> ';
    }

    if (q2dA > Rd2_subgrade) {
        text += 'and q<sub>2d</sub> > R<sub>d2_subgrade</sub>, ';
    } else {
        text += 'and q<sub>2d</sub> < R<sub>d2_subgrade</sub>, ';
    }

    
    if (q1dA < Rd1_subgrade || q2dA < Rd2_subgrade) {
        text += 'therefore a working platform is not required for plant support';
    } else { 
        text += 'therefore a working platform is required for plant support';
    }
    twpDecision.innerHTML = text;
}

export function platformStronger(Rd1_platform, Rd2_platform, Rd1, Rd2) {
  return !(Rd1_platform < Rd1 || Rd2_platform < Rd2);
}

export function displayPlatformStrongertText(Rd1_platform, Rd2_platform, Rd1_subgrade, Rd2_subgrade){
    let text = "";
    if(Rd1_platform > Rd1_subgrade){
        text += 'Now R<sub>d1_platform</sub> > R<sub>d1_subgrade</sub> ';
    }else {
        text += 'Now R<sub>d1_platform</sub>  < R<sub>d1_subgrade</sub> ';
    }

    if(Rd2_platform > Rd2_subgrade){
        text += 'and R<sub>d2_platform</sub>  > R<sub>d2_subgrade</sub>, ';
    }else {
        text += 'and R<sub>d2_platform</sub>  < R<sub>d2_subgrade</sub>, ';
    }

    if(Rd1_platform < Rd1_subgrade || Rd2_platform < Rd2_subgrade){
        text += " therefore platform is not stronger than subgrade"
    }else{
        text+= " therefore platform is stronger than subgrade";
        //showElement("platform-resistance-box");
    }

    subgradeVplatform.innerHTML = text;
}

export function platformResistive(Rd1_platform, Rd2_platform, q1dB, q2dB){
    return !(q1dB > Rd1_platform || q2dB > Rd2_platform);
}

export function displayPlatformResistiveText(Rd1_platform, Rd2_platform, q1dB, q2dB){
    let text = "";
    if (q1dB < Rd1_platform) {
        text += 'Now q<sub>1d</sub> < R<sub>d1_platform</sub> ';
    } else {
        text += 'Now q<sub>1d</sub> > R<sub>d1_platform</sub> ';
    }

    if (q2dB < Rd2_platform) {
        text += 'and q<sub>2d</sub> < R<sub>d2_platform</sub>,';
    } else {
        text += 'and q<sub>2d</sub> > R<sub>d2_platform</sub>,';
    }

    
    if (q1dB > Rd1_platform || q2dB > Rd2_platform) {
        text += 'therefore chosen platform material cannot provide the required bearing resistance';
    } else { 
        text += 'therefore chosen platform material can provide the required bearing resistance';
    }
    bearingResistance.innerHTML = text;
}


// Update No Geogrid Thickness and related boxes
export function updateNoGeogridThickness() {
    const thicknessInput = parseFloat(document.getElementById("thickness-input-no-geogrid").value);
    const required = parseFloat(calculatedData.DlargerNoGeorgrid).toFixed(2);
    const geogridSelect = document.getElementById("geogrid-yesorno").value;


    if (isNaN(thicknessInput)) {
        return; // return if user hasnt input anything yet
    }
    console.log("Required No Geogrid Thickness: ", required);
    console.log("User Input No Geogrid Thickness: ", thicknessInput);

    hideElement("with-geogrid-thickness-alert");
    hideElement("point-three-alert");




    // Only continue flow if valid input or alert has been dismissed
    if ((thicknessInput >= required) || state.alertNoGeoDismissed) {
        hideElement("no-geogrid-thickness-alert");
        if (geogridSelect == "yes"){
            showElement("with-geogrid-thickness-box");
            hideElement("summary-box");
        }else{
            showElement("summary-box");
            hideElement("with-geogrid-thickness-box");
        }
    }else {// Otherwise wait for valid input or dismissal
        showElement("no-geogrid-thickness-alert");
        hideElement("summary-box");
        hideElement("with-geogrid-thickness-box");
    }
}

export function updateWithGeogridThickness(){
    const thicknessInput = parseFloat(document.getElementById("thickness-input-with-geogrid").value);
    const required = parseFloat(calculatedData.DlargerWithGeorgrid).toFixed(2);

    
    if (isNaN(thicknessInput)) {
        return; // return if user hasnt input anything yet
    }

        // Only continue flow if valid input or alert has been dismissed
    if ((thicknessInput >= required) || state.alertWithGeoDismissed) {
        hideElement("with-geogrid-thickness-alert");
        showElement("summary-box");
    }else {// Otherwise wait for valid input or dismissal
        showElement("with-geogrid-thickness-alert");
        hideElement("summary-box");
    }


}
