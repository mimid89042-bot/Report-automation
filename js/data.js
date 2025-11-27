// data.js
import { DEFAULT_PHI, DEFAULT_GAMMA } from './constants.js';

// Store user inputs and calculated values
export const inputData = {
    //COHESIVE
    cu: null,
    phi: DEFAULT_PHI,
    gamma: DEFAULT_GAMMA,
    W: null,
    L1: null,
    L2: null,
    q1k: null,
    q2k: null
};

//any value that is attained (in order of page 28)
export const calculatedData = {
    //COHESIVE
    Ngamma: null,
    kptandelta: 5.5,
    sc1: null,
    sc2: null,
    sgamma1: null,
    sgamma2: null,
    sp1: null,
    sp2: null,
    sc_min: null,
    Rd: null,
    q1d: null,
    q2d: null,
    sgamma_min: null,
    platformBC: null,
    q1d2: null,
    q2d2: null,
    D1: null,
    D2: null,
    Tult: null,
    Td: null
};


// Automate input and calculation w data storage (called from events.js)
export function loadInput(id) {
    const el = document.getElementById(id);
    if (!el) {
        console.warn(`Element with ID "${id}" not found!`);
        return 0;
    }

    const value = parseFloat(el.value) || 0;
    inputData[id] = value;

    const span = document.getElementById(`${id}_value`);
    if (span) span.textContent = value;

    return value;
}

// Load calculated value into calculatedData and update corresponding span
export function loadCalculated(key, value) {
    // Store in calculatedData
    calculatedData[key] = value;

    // Update corresponding <span> if it exists
    const span = document.getElementById(`${key}_value`);
    if (span) span.textContent = value.toFixed(2); // optional formatting

    return value;
}

// export function loadInput(id) {
//     // Get the numeric value from the input field
//     const value = parseFloat(document.getElementById(id).value);

//     // Store the value inside inputData using the provided key
//     inputData[id] = value;

//     // Update the corresponding <span> (id="xxx_value") if it exists
//     const span = document.getElementById(`${id}_value`);
//     if (span) span.textContent = value;

//     return value;
// }

