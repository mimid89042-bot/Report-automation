export function showElement(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
}

export function hideElement(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
}


export function display_platformRequired(q1dA, q2dA, Rd) {
    //TWP decision with comparisons
    let text = "";
    if (q1dA > Rd) {
        text += 'Now &nbsp;&nbsp; q<sub>1d</sub> > R<sub>d</sub> <br>';
    } else {
        text += 'Now &nbsp;&nbsp;&nbsp; q<sub>1d</sub> < R<sub>d</sub> <br>';
    }

    if (q2dA > Rd) {
        text += 'and &nbsp;&nbsp;&nbsp; q<sub>2d</sub> > R<sub>d</sub> <br>';
    } else {
        text += 'and &nbsp;&nbsp;&nbsp; q<sub>2d</sub> < R<sub>d</sub> <br>';
    }

    
    if (q1dA > Rd && q2dA > Rd) {
        text += 'therefore a working platform is required for plant support';
        //make platformMaterial box visible
        showElement("platformMaterial");
    } else { text += '<span class="warning">therefore a working platform is NOT required for plant support</span>';

    }
    twpDecision.innerHTML = text; // use innerHTML to allow <br>
}

export function display_subgradeVplatform(platformBC, Rd){
    let text = "Now 0.5γ<sub>p</sub>W<sub>d</sub> N<sub>γp</sub> s<sub>γ</sub> ";
    if(platformBC > Rd){
        text += '> c<sub>u</sub>N<sub>c</sub>s<sub>c</sub> and platform is stronger than subgrade';
    }else {
        text += '<span style="color:red; font-weight:bold;"><c<sub>u</sub>N<sub>c</sub>s<sub>c</sub> and platform is NOT stronger than subgrade</span>';
    }
    showElement("subgradeVplatform");
    subgradeVplatform.innerHTML = text;
}


export function display_bearingResistance(platformBC, q1dB, q2dB){
    let text = "Now ";
    if (q1dB < platformBC) {
        text += '&nbsp;&nbsp; q<sub>1d</sub> < 0.5γ<sub>p</sub>W<sub>d</sub> N<sub>γp</sub> s<sub>γ</sub> <br>';
    } else {
        text += '&nbsp;&nbsp;  q<sub>1d</sub> > 0.5γ<sub>p</sub>W<sub>d</sub> N<sub>γp</sub> s<sub>γ</sub> <br>';
    }

    if (q2dB < platformBC) {
        text += 'and &nbsp;&nbsp;&nbsp; q<sub>2d</sub> < 0.5γ<sub>p</sub>W<sub>d</sub> N<sub>γp</sub> s<sub>γ</sub> <br>';
    } else {
        text += 'and &nbsp;&nbsp;&nbsp;  q<sub>2d</sub> > 0.5γ<sub>p</sub>W<sub>d</sub> N<sub>γp</sub> s<sub>γ</sub> <br>';
    }

    
    if (q1dB < platformBC && q2dB < platformBC) {
        text += 'therefore chosen platform material can provide the required bearing resistance';
    } else { 
        text += '<span style="color:red; font-weight:bold;">therefore chosen platform material canNOT provide the required bearing resistance</span>';
    }
    showElement("thickness");
    bearingResistance.innerHTML = text;
}

export function display_geogridGreaterThanPointThree(DlargerWithGeorgrid){
    let text = "";
    if(DlargerWithGeorgrid > 0.3){
        text += 'Appropriate value with the gesoynthetic reinforcement is therefore D = ' + DlargerWithGeorgrid + ' m';
    } else {
        text += 'Thickness is unsuitable as is < 0.3 m';
    }
    pointThree.innerHTML = text;
}