// print.js

export function preparePrintHeader() {
    console.log("preparePrintHeader called");
    const screenHeader = document.getElementById("screen-header");
    const printHeader = document.getElementById("print-header");

    if (!screenHeader || !printHeader){
           console.log("Header elements missing!");
           return;
    }
        console.log("Found headers");
    // Clone the header
    let clone = screenHeader.cloneNode(true);

    // Replace each input by ID
    const projectNoInput = clone.querySelector("#projectNo");
    const designerInput = clone.querySelector("#designerName");
    const dateInput = clone.querySelector("#reportDate");

    if (projectNoInput) {
        const span = document.createElement("span");
        span.textContent = projectNoInput.value || "";
        projectNoInput.replaceWith(span);
    }

    if (designerInput) {
        const span = document.createElement("span");
        span.textContent = designerInput.value || "";
        designerInput.replaceWith(span);
    }

    if (dateInput) {
        const span = document.createElement("span");
        span.textContent = dateInput.value || "";
        dateInput.replaceWith(span);
    }

    // Inject into print header
    printHeader.innerHTML = "";
    printHeader.appendChild(clone);
}
