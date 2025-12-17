// calculations.js

// === Calculation Functions ===
export function NgammaF(phi) {
    const theta = phi * Math.PI / 180;
    const tanTheta = Math.tan(theta);
    return 2 * tanTheta * (1 + Math.exp(Math.PI * tanTheta) * Math.pow(Math.tan(Math.PI/4 + theta/2), 2));
}

export function kptandeltaF(phi){
    const powerArg = -0.5061 + 0.01095 * phi + 5.03 * 10 ** -4 * phi ** 2
    return 10 ** powerArg;
}

export function scF(W, L) { 
    return 1 + 0.2 * (W / L); 
}

export function sgammaF(W, L) { 
    return 1 - 0.3 * (W / L); 
}

export function spF(W, L) { 
    return 1 + (W / L); 
}

export function Rd_subgradeF(c_u, s_c){
    return c_u * (2+ Math.PI) * s_c;
}

export function Rd_platformF(gamma, W, Ngamma, sgamma){
    return 0.5 * gamma * W * Ngamma * sgamma;
}

export function q1dAF(q1k){
    return 2.0 * q1k;
}

export function q2dAF(q2k){
    return 1.5 * q2k;
}

export function q1dBF(q1k){
    return 1.6 * q1k;
}

export function q2dBF(q2k){
    return 1.2 * q2k;
}

export function q1dCF(q1k){
    return 1.25 * q1k;
}

export function q2dCF(q2k){
    return 1.05 * q2k;
}

export function DNoGeogridF(W, qdA, Rd_subgrade, gamma, kptandelta, sp){
    return (W *Math.max(0,(qdA - Rd_subgrade)) / (gamma * kptandelta * sp)) ** 0.5;
}

export function DWithGeogridF(W, qdB, Rd_subgrade, T, gamma, kptandelta, sp){
    return (W * Math.max(0,(qdB - Rd_subgrade - 2*T/W)) / (gamma * kptandelta * sp)) ** 0.5;
}

//console.log(DNoGeogrid(2.4, 1.6*180, (2+Math.PI)* 40*1.14, 20, 109, 1.71)); // Example usage
//TO TEST FUNCTIONS --> open power shell --> cd "file path" --> uncomment line ^^ with desired function
//and input --> node calculations.js --> should return value in console