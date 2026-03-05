with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Replace opt block using simpler string replacement.
old_opt = """      const opt = {
        margin:       0,
        filename:     `plan-${profesion.replace(/\\s+/g, '_')}-${edad}.pdf`,
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
          onclone: (clonedDoc: any) => {
            const elements = clonedDoc.querySelectorAll('*');
            for (let i = 0; i < elements.length; i++) {
                const el = elements[i];
                const computed = clonedDoc.defaultView?.getComputedStyle(el);
                if (!computed) continue;
                if (computed.backgroundColor && (computed.backgroundColor.includes('lab') || computed.backgroundColor.includes('oklch'))) {
                    el.style.backgroundColor = '#ffffff';
                }
                if (computed.color && (computed.color.includes('lab') || computed.color.includes('oklch'))) {
                    el.style.color = '#000000';
                }
                if (computed.borderColor && (computed.borderColor.includes('lab') || computed.borderColor.includes('oklch'))) {
                    el.style.borderColor = '#e5e7eb';
                }
            }
          }
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'] }
      };"""

content = content.replace(old_opt, new_opt)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
