import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Replace the handleDownloadPDF function
old_pdf_func = """  const handleDownloadPDF = async () => {
    if (!previewRef.current) return
    setIsDownloadingPdf(true)
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')])
      const iframe = previewRef.current.querySelector('iframe')
      if (!iframe || !iframe.contentDocument) throw new Error('No iframe')

      const originalHeight = iframe.style.height;
      iframe.style.height = iframe.contentDocument.documentElement.scrollHeight + "px";
      const content = iframe.contentDocument.body

            const canvas = await html2canvas(content, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        logging: false,
        windowWidth: 850
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const imgWidth = 210, pageHeight = 297, imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight, position = 0

      // Function to add WhatsApp link to a page
      const addWhatsAppLink = (pdfInstance: any) => {
          if (!asesorTelefono && !asesorMensajePredefinido) return;
          const msg = asesorMensajePredefinido || `Hola, te comparto el contacto de mi asesor financiero ${asesorNombre} (Tel: ${asesorTelefono || ''}).`;
          const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;

          pdfInstance.setFontSize(10);
          pdfInstance.setTextColor(37, 211, 102); // WhatsApp green
          const text = "Recomendar asesor 💬";
          const x = 160;
          const y = 285;
          pdfInstance.textWithLink(text, x, y, { url });

          // Add a subtle underline
          pdfInstance.setDrawColor(37, 211, 102);
          pdfInstance.setLineWidth(0.2);
          pdfInstance.line(x, y + 1, x + 35, y + 1);
      };

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      addWhatsAppLink(pdf);
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        addWhatsAppLink(pdf);
        heightLeft -= pageHeight
      }

      pdf.save(`plan-${profesion.replace(/\\s+/g, '_')}-${edad}.pdf`)
      iframe.style.height = originalHeight;
    } catch (error) { console.error('Error al generar PDF:', error); alert('Error al generar PDF') } finally { setIsDownloadingPdf(false) }
  }"""

new_pdf_func = """  const handleDownloadPDF = async () => {
    if (!previewRef.current) return
    setIsDownloadingPdf(true)
    try {
      // Import the html2pdf library dynamically
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;

      const { PDFDocument } = await import('pdf-lib');

      const iframe = previewRef.current.querySelector('iframe')
      if (!iframe || !iframe.contentDocument) throw new Error('No iframe')

      // Use a clone to not mess with the visual iframe layout
      const content = iframe.contentDocument.body.cloneNode(true) as HTMLElement;

      // Inject some CSS to handle page breaks properly
      const style = document.createElement('style');
      style.textContent = `
        @media print {
          .card, .section, .html2pdf__page-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
        .page-container {
          page-break-before: always;
          break-before: page;
        }
      `;
      content.appendChild(style);

      const opt = {
        margin:       [10, 10, 10, 10], // top, left, bottom, right
        filename:     `plan-${profesion.replace(/\\s+/g, '_')}-${edad}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'] }
      };

      // Generate the primary PDF as an ArrayBuffer
      const primaryPdfBuffer = await html2pdf().set(opt).from(content).output('arraybuffer');

      // Load the generated PDF into pdf-lib
      const pdfDoc = await PDFDocument.load(primaryPdfBuffer);

      // Add WhatsApp Link to all pages
      if (asesorTelefono || asesorMensajePredefinido) {
        const msg = asesorMensajePredefinido || `Hola, te comparto el contacto de mi asesor financiero ${asesorNombre} (Tel: ${asesorTelefono || ''}).`;
        const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;

        const pages = pdfDoc.getPages();
        for (const page of pages) {
          const { width, height } = page.getSize();

          // Add a simple invisible link annotation over text we would draw
          const linkAnnotation = pdfDoc.context.obj({
            Type: 'Annot',
            Subtype: 'Link',
            Rect: [width - 60, 20, width - 10, 35], // x, y, width, height from bottom-left
            Border: [0, 0, 0],
            C: [0, 0, 0],
            A: {
              Type: 'Action',
              S: 'URI',
              URI: pdfDoc.context.obj(url),
            },
          });

          const linkRef = pdfDoc.context.register(linkAnnotation);
          page.node.set(
            pdfDoc.context.obj('Annots'),
            pdfDoc.context.obj([linkRef])
          );
        }
      }

      // Merge attached PDFs
      if (attachedFiles && attachedFiles.length > 0) {
        for (const file of attachedFiles) {
          if (file.type === 'application/pdf' && file.data) {
            try {
              // file.data is a Data URI: data:application/pdf;base64,JVBERi0xLjQK...
              const base64Data = file.data.split(',')[1];
              if (!base64Data) continue;

              const attachedPdfBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
              const attachedPdfDoc = await PDFDocument.load(attachedPdfBytes);

              const copiedPages = await pdfDoc.copyPages(attachedPdfDoc, attachedPdfDoc.getPageIndices());
              copiedPages.forEach((page) => {
                pdfDoc.addPage(page);
              });
            } catch (err) {
              console.error(`Error merging attached PDF ${file.name}:`, err);
            }
          }
        }
      }

      // Save the final merged PDF
      const finalPdfBytes = await pdfDoc.save();
      const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = opt.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar PDF');
    } finally {
      setIsDownloadingPdf(false);
    }
  }"""

if old_pdf_func in content:
    content = content.replace(old_pdf_func, new_pdf_func)
    with open("src/app/page.tsx", "w") as f:
        f.write(content)
    print("Patched handleDownloadPDF successfully.")
else:
    print("Could not find exact old function signature to replace.")
