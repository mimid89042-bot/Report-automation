import { initEventListeners, } from './events.js';
import { preparePrintHeader } from './print.js';        

document.addEventListener("DOMContentLoaded", () => {
    initEventListeners();
});

window.onbeforeprint = preparePrintHeader;

 