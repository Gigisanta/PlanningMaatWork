import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Fix html2canvas unsupported color function "lab" by replacing all lab/oklch colors in the HTML string itself
# before putting it in the iframe for PDF rendering, or before running html2pdf.
# Wait, the error is html2canvas failing to parse a color function like lab().
# Next.js 15+ tailwind uses `oklch()` or `lab()` for colors sometimes, or Shadcn UI does.
# Let's override `html2canvas`'s `onclone` behavior in `html2pdf.js` options.

old_opt = """      const opt = {
        margin:       0,
        filename:     `plan-${profesion.replace(/\s+/g, '_')}-${edad}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 1.5, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'] }
      };"""

new_opt = """      const opt = {
        margin:       0,
        filename:     `plan-${profesion.replace(/\\s+/g, '_')}-${edad}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  {
          scale: 1.5,
          useCORS: true,
          logging: false,
          onclone: (clonedDoc: Document) => {
            // html2canvas fails on lab() or oklch() colors. We need to force them to hex or rgb in the cloned DOM.
            const allElements = clonedDoc.querySelectorAll('*');
            allElements.forEach((el) => {
              const element = el as HTMLElement;
              const computedStyle = clonedDoc.defaultView?.getComputedStyle(element);
              if (computedStyle) {
                if (computedStyle.backgroundColor.includes('lab') || computedStyle.backgroundColor.includes('oklch')) {
                  element.style.setProperty('background-color', 'rgb(255, 255, 255)', 'important');
                }
                if (computedStyle.color.includes('lab') || computedStyle.color.includes('oklch')) {
                  element.style.setProperty('color', 'rgb(0, 0, 0)', 'important');
                }
                if (computedStyle.borderColor.includes('lab') || computedStyle.borderColor.includes('oklch')) {
                  element.style.setProperty('border-color', 'rgb(200, 200, 200)', 'important');
                }
              }
            });
          }
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'] }
      };"""

# We must be careful because page.tsx has `profesion.replace(/\s+/g, '_')` which gets double-escaped in python if we aren't careful.
# Instead let's just use string replace on the html2canvas config line.

old_line = "html2canvas:  { scale: 1.5, useCORS: true, logging: false },"
new_line = """html2canvas:  {
          scale: 1.5,
          useCORS: true,
          logging: false,
          onclone: (clonedDoc: any) => {
            // html2canvas fails on lab() or oklch() colors. We need to force them to hex or rgb in the cloned DOM.
            const allElements = clonedDoc.querySelectorAll('*');
            allElements.forEach((el: any) => {
              if (el.style) {
                 if (el.style.backgroundColor && (el.style.backgroundColor.includes('lab(') || el.style.backgroundColor.includes('oklch('))) {
                    el.style.backgroundColor = '#FFFFFF';
                 }
                 if (el.style.color && (el.style.color.includes('lab(') || el.style.color.includes('oklch('))) {
                    el.style.color = '#000000';
                 }
              }
            });

            // Also sanitize inline styles string in the DOM
            const html = clonedDoc.documentElement.innerHTML;
            if (html.includes('lab(') || html.includes('oklch(')) {
                // regex replace simple cases
                clonedDoc.documentElement.innerHTML = html.replace(/lab\\([^)]+\\)/g, '#FFFFFF').replace(/oklch\\([^)]+\\)/g, '#FFFFFF');
            }
          }
        },"""

content = content.replace(old_line, new_line)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
