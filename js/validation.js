import { MIN_CU, MAX_CU } from './constants.js';

export function validateCu() {
    const cu = parseFloat(document.getElementById("cu").value);
    if (cu < MIN_CU) {
        return false;
    }
    if (cu > MAX_CU) {
        return false;
    }
    return true;
}

export function validateNOGeorgridThickness(DlargerNoGeorgrid){
    const thicknessNoGeogridUserInput = 
    parseFloat(document.getElementById("thicknessNoGeogridUserInput").value);
    if (thicknessNoGeogridUserInput < DlargerNoGeorgrid){
        return false;
    }
    return true
}

export function validateWITHGeorgridThickness(DlargerWithGeorgrid){
    const thicknessNoGeogridUserInput = 
    parseFloat(document.getElementById("thicknessNoGeogridUserInput").value);
    if (thicknessNoGeogridUserInput < DlargerWithGeorgrid){
        return false;
    }
    return true
}
