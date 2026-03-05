with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Revert previous onclone that had regex parsing errors and just completely strip Tailwind color strings or use a simpler sanitize
old_line = """html2canvas:  {
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
                clonedDoc.documentElement.innerHTML = html.replace(/lab\([^)]+\)/g, '#FFFFFF').replace(/oklch\([^)]+\)/g, '#FFFFFF');
            }
          }
        },"""

new_line = "html2canvas:  { scale: 1.5, useCORS: true, logging: false },"
content = content.replace(old_line, new_line)

# Let's clean the root variables directly inside generatePlan.ts instead where the HTML is built.
with open("src/app/page.tsx", "w") as f:
    f.write(content)

with open("src/lib/generatePlan.ts", "r") as f:
    plan_content = f.read()

plan_content = plan_content.replace('oklch', 'rgb').replace('lab', 'rgb')

with open("src/lib/generatePlan.ts", "w") as f:
    f.write(plan_content)
