// data.js
import { DEFAULT_PHI, DEFAULT_GAMMA } from './constants.js';
import { updateValue } from './dom.js';

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
    q2k: null,
    Tult: 30
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
    subgradeBC1: null,
    subgradeBC2: null,
    D1: null,
    D2: null,
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

    // Update all spans that represent this input
    updateValue(`.${id}_value`, value);

    return value;
}

// Load calculated value into calculatedData and update corresponding span
export function loadCalculated(key, value) {
    // Store in calculatedData
    calculatedData[key] = value;

   updateValue('.${id}_value', value);
}
