import { initEventListeners, } from './events.js';
import { updatePrintHeader } from './print.js';

document.addEventListener("DOMContentLoaded", async () => {
    initEventListeners();


    document.getElementById("download-pdf-btn").addEventListener("click", async () => {

    // 1. Get the report HTML
    const reportDiv = document.getElementById("report-content");
    const reportHTML = reportDiv.outerHTML;

    // 2. Construct full HTML document
    const fullHTML = `
    <html>
    <head>
        <link rel="stylesheet" href="css/styles.css">
    </head>
    <body>
        ${reportHTML}
    </body>
    </html>`;

    // 3. Send to SelectPdf
    const response = await fetch("https://selectpdf.com/api2/convert/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            key: "YOUR_SELECTPDF_KEY",

            html: fullHTML,
            base_url: window.location.origin,

            // --- PDF SETTINGS ---
            page_size: "A4",
            page_orientation: "Portrait",

            // --- HEADER ---
            show_header: true,
            header_html: "<div style='text-align:center;font-size:12px;border-bottom:1px solid #000;'>Report Header</div>",
            header_height: 40,

            // --- FOOTER ---
            show_footer: true,
            footer_html: "<div style='text-align:center;font-size:12px;border-top:1px solid #000;'>Page <span class='pageNumber'></span></div>",
            footer_height: 40,
        })
    });

    // 4. Download PDF
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    window.open(url); // opens the PDF in new tab
});

});

