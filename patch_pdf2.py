import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Try regex replacement
match = re.search(r'  const handleDownloadPDF = async \(\) => \{.*?finally \{ setIsDownloadingPdf\(false\) \}\n  \}', content, re.DOTALL)
if match:
    old_pdf_func = match.group(0)

    new_pdf_func = """  const handleDownloadPDF = async () => {
    if (!previewRef.current) return
    setIsDownloadingPdf(true)
    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');

      const iframe = previewRef.current.querySelector('iframe')
      if (!iframe || !iframe.contentDocument) throw new Error('No iframe')

      // Use html2pdf on the iframe content body
      const content = iframe.contentDocument.body;

      // Ensure some layout stability
      const originalHeight = iframe.style.height;
      iframe.style.height = iframe.contentDocument.documentElement.scrollHeight + "px";

      const opt = {
        margin:       0,
        filename:     `plan-${profesion.replace(/\\s+/g, '_')}-${edad}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'] }
      };

      // Generate the primary PDF as Blob/ArrayBuffer
      console.log("Generating primary PDF...");
      const pdfBlob = await html2pdf().set(opt).from(content).outputPdf('blob');
      const arrayBuffer = await pdfBlob.arrayBuffer();

      console.log("Loading primary PDF into pdf-lib...");
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Add WhatsApp Link
      if (asesorTelefono || asesorMensajePredefinido) {
        const msg = asesorMensajePredefinido || `Hola, te comparto el contacto de mi asesor financiero ${asesorNombre} (Tel: ${asesorTelefono || ''}).`;
        const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;

        const pages = pdfDoc.getPages();
        const customFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        for (const page of pages) {
          const { width, height } = page.getSize();

          const text = "Recomendar asesor 💬";
          const textSize = 10;
          const textWidth = customFont.widthOfTextAtSize(text, textSize);

          const x = 160;
          const y = 15; // Bottom of page

          page.drawText(text, {
            x,
            y,
            size: textSize,
            font: customFont,
            color: rgb(37/255, 211/255, 102/255), // WhatsApp green
          });

          const linkAnnotation = pdfDoc.context.obj({
            Type: 'Annot',
            Subtype: 'Link',
            Rect: [x, y, x + textWidth, y + textSize],
            Border: [0, 0, 0],
            C: [0, 0, 0],
            A: {
              Type: 'Action',
              S: 'URI',
              URI: pdfDoc.context.string(url),
            },
          });

          const linkRef = pdfDoc.context.register(linkAnnotation);
          let annots = page.node.get(pdfDoc.context.obj('Annots'));
          if (!annots) {
             annots = pdfDoc.context.obj([]);
             page.node.set(pdfDoc.context.obj('Annots'), annots);
          }
          if (annots && typeof annots.push === 'function') {
              annots.push(linkRef);
          }
        }
      }

      // Merge attached PDFs
      if (attachedFiles && attachedFiles.length > 0) {
        console.log("Merging attached files...");
        for (const file of attachedFiles) {
          if (file.type === 'application/pdf' && file.data) {
            try {
              // Extract base64 part if it's a data URI
              let base64Data = file.data;
              if (file.data.startsWith('data:')) {
                base64Data = file.data.split(',')[1];
              }

              if (!base64Data) continue;

              const attachedPdfBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
              const attachedPdfDoc = await PDFDocument.load(attachedPdfBytes);

              const copiedPages = await pdfDoc.copyPages(attachedPdfDoc, attachedPdfDoc.getPageIndices());
              copiedPages.forEach((page) => {
                pdfDoc.addPage(page);
              });
              console.log(`Merged ${file.name}`);
            } catch (err) {
              console.error(`Error merging attached PDF ${file.name}:`, err);
            }
          }
        }
      }

      console.log("Saving final PDF...");
      const finalPdfBytes = await pdfDoc.save();
      const finalBlob = new Blob([finalPdfBytes], { type: 'application/pdf' });
      const finalUrl = URL.createObjectURL(finalBlob);

      const a = document.createElement('a');
      a.href = finalUrl;
      a.download = opt.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(finalUrl);

      iframe.style.height = originalHeight;

    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar PDF');
    } finally {
      setIsDownloadingPdf(false);
    }
  }"""

    content = content.replace(old_pdf_func, new_pdf_func)
    with open("src/app/page.tsx", "w") as f:
        f.write(content)
    print("Replaced handleDownloadPDF via regex")
else:
    print("Could not find regex match")
