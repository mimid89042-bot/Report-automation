import { MIN_CU, MAX_CU } from './constants.js';

export function validateInputs() {
    const cu = parseFloat(document.getElementById("cu").value);
    if (cu <= MIN_CU) {
        return false;
    }
    if (cu >= MAX_CU) {
        return false;
    }
    return true;
}


