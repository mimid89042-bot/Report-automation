// calculations.js
import { calculatedData } from './data.js';



// === Calculation Functions ===
export function Ngamma(phi) {
    const theta = phi * Math.PI / 180;
    const tanTheta = Math.tan(theta);
    return 2 * tanTheta * (1 + Math.exp(Math.PI * tanTheta) * Math.pow(Math.tan(Math.PI/4 + theta/2), 2));
}

export function sc(W, L) { 
    return 1 + 0.2 * (W / L); 
}

export function sgamma(W, L) { 
    return 1 - 0.3 * (W / L); 
}

export function sp(W, L) { 
    return 1 + (W / L); 
}

export function Rd(c_u, s_c){
    return c_u * (2+ Math.PI) * s_c;
}

export function platformBC(gamma, W, Ngamma, sgamma){
    return 0.5 * gamma * W * Ngamma * sgamma;
}

export function q1d2(q1){
    return 1.6 * q1;
}

export function q2d2(q2){
    return 1.2 * q2;
}

export function D(W, qd, cu, sc, gamma, kptandelta, sp){
    return (W *(qd - cu * (2 + Math.PI) * sc) / (gamma * kptandelta * sp)) ^ 0.5;
}


//console.log(N_γp(40)); // Example usage
//TO TEST FUNCTIONS --> open power shell --> cd "file path" --> uncomment line ^^ with desired function
//and input --> node calculations.js --> should return value in console