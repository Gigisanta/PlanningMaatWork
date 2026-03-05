import re
with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Instead of just string replace, let's walk through all elements and nuke the colors
code_to_add = """
      // Deep sanitize ALL inline styles in the cloned document body
      const elements = content.querySelectorAll('*');
      elements.forEach((el: any) => {
        if (el.style) {
           const computed = window.getComputedStyle(el);
           if (computed.backgroundColor && (computed.backgroundColor.includes('lab') || computed.backgroundColor.includes('oklch') || el.style.backgroundColor.includes('lab') || el.style.backgroundColor.includes('oklch'))) {
              el.style.backgroundColor = 'transparent';
           }
           if (computed.color && (computed.color.includes('lab') || computed.color.includes('oklch') || el.style.color.includes('lab') || el.style.color.includes('oklch'))) {
              el.style.color = '#000000';
           }
           if (computed.borderColor && (computed.borderColor.includes('lab') || computed.borderColor.includes('oklch') || el.style.borderColor.includes('lab') || el.style.borderColor.includes('oklch'))) {
              el.style.borderColor = 'transparent';
           }
        }
      });
      // Sanitize standard HTML attributes
      const rawHTML = content.innerHTML;
      content.innerHTML = rawHTML.replace(/lab\\([^)]+\\)/g, '#FFFFFF').replace(/oklch\\([^)]+\\)/g, '#FFFFFF');
"""

old_code = """      // Strip oklch/lab colors as html2canvas fails parsing them
      const htmlStr = content.innerHTML.replace(/oklch\\([^)]+\\)/g, '#FFFFFF').replace(/lab\\([^)]+\\)/g, '#FFFFFF');
      content.innerHTML = htmlStr;"""

content = content.replace(old_code, code_to_add)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
