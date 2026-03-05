with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Fix pdfDoc.context.string to pdf-lib's PDFString
content = content.replace("const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');", "const { PDFDocument, StandardFonts, rgb, PDFString } = await import('pdf-lib');")
content = content.replace("URI: pdfDoc.context.string(url),", "URI: PDFString.of(url),")

with open("src/app/page.tsx", "w") as f:
    f.write(content)
