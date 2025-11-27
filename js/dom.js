export function showElement(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
}

export function hideElement(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
}

// // updates R_d value and qd values
export function displayTWPrequired(q1d, q2d, Rd) {
    //TWP decision with comparisons
    let text = "";
    if (q1d > Rd) {
        text += 'Now &nbsp;&nbsp; q<sub>1d</sub> > R<sub>d</sub> <br>';
    } else {
        text += 'Now &nbsp;&nbsp;&nbsp; q<sub>1d</sub> < R<sub>d</sub> <br>';
    }

    if (q2d > Rd) {
        text += 'and &nbsp;&nbsp;&nbsp; q<sub>2d</sub> > R<sub>d</sub> <br>';
    } else {
        text += 'and &nbsp;&nbsp;&nbsp; q<sub>2d</sub> < R<sub>d</sub> <br>';
    }

    
    if (q1d > Rd && q2d > Rd) {
        text += 'therefore a working platform is required for plant support';
        //make platformMaterial box visible
        showElement("platformMaterial");
    } else { text += 'therefore a working platform is NOT required for plant support';

    }
    twpDecision.innerHTML = text; // use innerHTML to allow <br>
}

export function display_subgradeVplatform(platformBC, Rd){
    let text = "Now 0.5γ<sub>p</sub>W<sub>d</sub> N<sub>γp</sub> s<sub>γ</sub> ";
    if(platformBC > Rd){
        text += '> c<sub>u</sub>N<sub>c</sub>s<sub>c</sub> and platform is stronger than subgrade';
        showElement("subgradeVplatform");
    }else {
        text += '< c<sub>u</sub>N<sub>c</sub>s<sub>c</sub> and platform is NOT stronger than subgrade';
    }
    subgradeVplatform.innerHTML = text;
}


export function display_bearingResistance(platformBC, q1d2, q2d2){
    let text = "Now ";
    if (q1d2 < platformBC) {
        text += '&nbsp;&nbsp; q<sub>1d</sub> < 0.5γ<sub>p</sub>W<sub>d</sub> N<sub>γp</sub> s<sub>γ</sub> <br>';
    } else {
        text += '&nbsp;&nbsp;  q<sub>1d</sub> > 0.5γ<sub>p</sub>W<sub>d</sub> N<sub>γp</sub> s<sub>γ</sub> <br>';
    }

    if (q2d2 < platformBC) {
        text += 'and &nbsp;&nbsp;&nbsp; q<sub>2d</sub> < 0.5γ<sub>p</sub>W<sub>d</sub> N<sub>γp</sub> s<sub>γ</sub> <br>';
    } else {
        text += 'and &nbsp;&nbsp;&nbsp;  q<sub>2d</sub> > 0.5γ<sub>p</sub>W<sub>d</sub> N<sub>γp</sub> s<sub>γ</sub> <br>';
    }

    
    if (q1d2 < platformBC && q2d2 < platformBC) {
        text += 'therefore chosen platform material can provide the required bearing resistance';
        showElement("thickness");
    } else { text += 'therefore chosen platform material canNOT provide the required bearing resistance';
    }
    bearingResistance.innerHTML = text;
}


