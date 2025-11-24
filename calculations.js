// calculations.js

// Factor for subgrade
export function s_c(W, L) {
    return 1 + 0.2 * (W / L);
}

export function s_gamma(W, L) {
    return 1 - 0.3 * (W / L);
}

export function s_p(W, L) {
    return 1 + (W / L);
}

// Example: can add more complex formulas here, e.g., N_gamma_p(phi)
export function N_gamma_p(phi_p) {
    const theta = phi_p * Math.PI / 180;
    const tanTheta = Math.tan(theta);
    const term1 = 2 * tanTheta;
    const term2 = 1 + Math.exp(Math.PI * tanTheta) * Math.pow(Math.tan(Math.PI / 4 + theta / 2), 2);
    return term1 * term2;
}


//console.log(N_γp(40)); // Example usage
//TO TEST FUNCTIONS --> open power shell --> cd "file path" --> uncomment line ^^ with desired function
//and input --> node calculations.js --> should return value in console