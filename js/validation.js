import { inputData } from './data.js';
import { MIN_CU, MAX_CU } from './constants.js';

export function validateInputs() {
    const cu = parseFloat(document.getElementById("cu").value);
    if (cu <= MIN_CU) {
        alert("Subgrade too soft");
        return false;
    }
    if (cu >= MAX_CU) {
        alert("Subgrade too stiff");
        return false;
    }

    // Other validations can go here
    return true;
}

