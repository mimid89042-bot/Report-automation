import { initEventListeners } from './events.js';
import { inputData, loadInput } from './data.js';

document.addEventListener("DOMContentLoaded", () => {
    initEventListeners();
});



document.addEventListener("DOMContentLoaded", () => {
    // First, set up all event listeners
    initEventListeners();

    // Then, populate initial values and update spans
    for (const key in inputData) {
        loadInput(key);
    }
});