with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Let's use the onclone option which provides the actual cloned iframe that html2canvas is about to read.
code_to_add = """
      const opt = {
        margin:       0,
        filename:     `plan-${profesion.replace(/\\s+/g, '_')}-${edad}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  {
          scale: 1.5,
          useCORS: true,
          logging: false,
          onclone: (clonedDoc: any) => {
            // Some CSS variables from Tailwind Next.js cause lab() colors which html2canvas fails on
            const style = clonedDoc.createElement('style');
            style.textContent = `
              * {
                 --background: 0 0% 100% !important;
                 --foreground: 0 0% 0% !important;
                 --primary: 0 0% 0% !important;
                 --primary-foreground: 0 0% 100% !important;
                 --secondary: 0 0% 90% !important;
                 --secondary-foreground: 0 0% 0% !important;
                 --muted: 0 0% 90% !important;
                 --muted-foreground: 0 0% 40% !important;
                 --accent: 0 0% 90% !important;
                 --accent-foreground: 0 0% 0% !important;
                 --destructive: 0 100% 50% !important;
                 --destructive-foreground: 0 0% 100% !important;
                 --border: 0 0% 80% !important;
                 --input: 0 0% 80% !important;
                 --ring: 0 0% 0% !important;
                 --radius: 0.5rem !important;
              }
              body { background-color: #FAFAF8 !important; }
            `;
            clonedDoc.head.appendChild(style);

            const allElements = clonedDoc.querySelectorAll('*');
            allElements.forEach((el: any) => {
               const comp = clonedDoc.defaultView?.getComputedStyle(el);
               if (comp) {
                   if (comp.backgroundColor && (comp.backgroundColor.includes('lab') || comp.backgroundColor.includes('oklch'))) {
                       el.style.setProperty('background-color', '#ffffff', 'important');
                   }
                   if (comp.color && (comp.color.includes('lab') || comp.color.includes('oklch'))) {
                       el.style.setProperty('color', '#000000', 'important');
                   }
                   if (comp.borderColor && (comp.borderColor.includes('lab') || comp.borderColor.includes('oklch'))) {
                       el.style.setProperty('border-color', '#e5e7eb', 'important');
                   }
               }
            });
          }
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'] }
      };
"""

# Replace the previous opt block
import re
content = re.sub(r"      const opt = \{.*?pagebreak:    \{ mode: \['css', 'legacy'\] \}\n      \};", code_to_add, content, flags=re.DOTALL)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
