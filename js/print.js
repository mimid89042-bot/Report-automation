// REMOVE this import line
// import html2pdf from 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';

export function updatePrintHeader() {
    const btn = document.getElementById('download-pdf-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        const content = document.getElementById('report-content');
        if (!content) return;

        // Render MathJax first
        await MathJax.typesetPromise([content]);

        const opt = {
            margin: [15, 10, 15, 10],
            filename: 'report.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 0.5, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'] }
        };

        // html2pdf is available on the global window object
        window.html2pdf().set(opt).from(content).save();
    });
}
