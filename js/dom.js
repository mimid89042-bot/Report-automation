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
    let decisionText = "";
    if (q1d > Rd) {
        decisionText += 'Now &nbsp;&nbsp; q<sub>1d</sub> > R<sub>d</sub> <br>';
    } else {
        decisionText += 'Now &nbsp;&nbsp;&nbsp; q<sub>1d</sub> < R<sub>d</sub> <br>';
    }

    if (q2d > Rd) {
        decisionText += 'and &nbsp;&nbsp;&nbsp; q<sub>2d</sub> > R<sub>d</sub> <br>';
    } else {
        decisionText += 'and &nbsp;&nbsp;&nbsp; q<sub>2d</sub> < R<sub>d</sub> <br>';
    }

    
    if (q1d > Rd && q2d > Rd) {
        decisionText += 'therefore a working platform is required for plant support';
        //make platformMaterial box visible
        showElement("platformMaterial");
    } else { decisionText += 'therefore a working platform is NOT required for plant support';

    }
    twpDecision.innerHTML = decisionText; // use innerHTML to allow <br>
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


