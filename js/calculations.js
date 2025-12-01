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

export function RdNoGeoGrid(c_u, s_c){
    return c_u * (2+ Math.PI) * s_c;
}

export function platformBC(gamma, W, Ngamma, sgamma){
    return 0.5 * gamma * W * Ngamma * sgamma;
}

export function q1dA(q1k){
    return 2.0 * q1k;
}

export function q2dA(q2k){
    return 1.5 * q2k;
}

export function q1dB(q1k){
    return 1.6 * q1k;
}

export function q2dB(q2k){
    return 1.2 * q2k;
}

export function q1dC(q1k){
    return 1.25 * q1k;
}

export function q2dC(q2k){
    return 1.05 * q2k;
}

export function subgradeBC(cu, sc){
    return cu * (2 + Math.PI) * sc;
}

export function DNoGeogrid(W, qdA, subgradeBC, gamma, kptandelta, sp){
    return (W *(qdA - subgradeBC) / (gamma * kptandelta * sp)) ** 0.5;
}

export function DWithGeogrid(W, qdB, subgradeBC, T, gamma, kptandelta, sp){
    return (W *(qdB - subgradeBC - 2*T/W) / (gamma * kptandelta * sp)) ** 0.5;
}

export function finalRd(cu, sc, D, W, gamma, kptandelta, sp){
    return cu * (2 + Math.PI) * sc + D^2 / W * gamma * kptandelta * sp;
}

//console.log(N_γp(40)); // Example usage
//TO TEST FUNCTIONS --> open power shell --> cd "file path" --> uncomment line ^^ with desired function
//and input --> node calculations.js --> should return value in console