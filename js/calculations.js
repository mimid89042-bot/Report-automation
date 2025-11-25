// calculations.js

// === Calculation Functions ===
export function s_c(W, L) { 
    return 1 + 0.2 * (W / L); 
}

export function s_gamma(W, L) { 
    return 1 - 0.3 * (W / L); 
}

export function s_p(W, L) { 
    return 1 + (W / L); 
}

export function N_gamma_p(phi_p) {
    const theta = phi_p * Math.PI / 180;
    const tanTheta = Math.tan(theta);
    return 2 * tanTheta * (1 + Math.exp(Math.PI * tanTheta) * Math.pow(Math.tan(Math.PI/4 + theta/2), 2));
}

// === UI Update Function ===
export function updateCase(caseId, W, L) {
    document.getElementById(`sc_${caseId}`).textContent = s_c(W,L).toFixed(2);
    document.getElementById(`sgamma_${caseId}`).textContent = s_gamma(W,L).toFixed(2);
    document.getElementById(`sp_${caseId}`).textContent = s_p(W,L).toFixed(2);
}


//console.log(N_γp(40)); // Example usage
//TO TEST FUNCTIONS --> open power shell --> cd "file path" --> uncomment line ^^ with desired function
//and input --> node calculations.js --> should return value in console