using SelectPdf;
using System;
using System.IO;

class Program
{
    static void Main(string[] args)
    {
        if(args.Length < 2)
        {
            Console.WriteLine("Usage: PdfGenerator.exe <input.html> <output.pdf>");
            return;
        }

        string htmlPath = args[0];
        string pdfPath = args[1];

        string htmlContent = File.ReadAllText(htmlPath);

        HtmlToPdf converter = new HtmlToPdf();
        converter.Options.PdfPageSize = PdfPageSize.A4;

        // Header
        converter.Options.DisplayHeader = true;
        converter.Header.Height = 50;
        converter.Header.DisplayOnFirstPage = true;
        converter.Header.Add(new PdfHtmlSection("<div style='text-align:center; font-size:12px; border-bottom:1px solid black;'>Report Header</div>"));

        // Footer
        converter.Options.DisplayFooter = true;
        converter.Footer.Height = 50;
        converter.Footer.DisplayOnFirstPage = true;
        converter.Footer.Add(new PdfHtmlSection("<div style='text-align:center; font-size:12px; border-top:1px solid black;'>Page {page_number}</div>"));

        // Convert HTML to PDF
        PdfDocument doc = converter.ConvertHtmlString(htmlContent);
        doc.Save(pdfPath);
        doc.Close();

        Console.WriteLine($"PDF saved to {pdfPath}");
    }
}
