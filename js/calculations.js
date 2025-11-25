// calculations.js

// Local JS functions
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
    return 2 * tanTheta * (1 + Math.exp(Math.PI * tanTheta) * Math.pow(Math.tan(Math.PI / 4 + theta / 2), 2));
}

export function R_d(c_u, N_c, s_c_val) {
    return c_u * N_c * s_c_val;
}



//console.log(N_γp(40)); // Example usage
//TO TEST FUNCTIONS --> open power shell --> cd "file path" --> uncomment line ^^ with desired function
//and input --> node calculations.js --> should return value in console