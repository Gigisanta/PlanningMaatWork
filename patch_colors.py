import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Replace any lab() colors that html2canvas is choking on.
# Or better yet, we can sanitize the DOM right before passing to html2pdf.

sanitize_code = """      // Use html2pdf on the iframe content body
      const content = iframe.contentDocument.body;

      // Ensure some layout stability
      const originalHeight = iframe.style.height;
      iframe.style.height = iframe.contentDocument.documentElement.scrollHeight + "px";

      // html2canvas (used by html2pdf) doesn't support 'lab()' or 'oklch()' color functions.
      // We must sanitize the computed styles of elements that have these before passing to html2pdf.
      // Easiest is to replace root variables if they contain it, or just use a regex replace on the raw HTML
      // but since the browser computes it, we can just replace the textContent of the cloned node or style tags
      const style = document.createElement('style');
      style.textContent = `
        * {
          background-color: transparent; /* allow inheritance */
        }
        body { background-color: #FAFAF8 !important; }
      `;
      content.appendChild(style);"""

old_code = """      // Use html2pdf on the iframe content body
      const content = iframe.contentDocument.body;

      // Ensure some layout stability
      const originalHeight = iframe.style.height;
      iframe.style.height = iframe.contentDocument.documentElement.scrollHeight + "px";"""

content = content.replace(old_code, sanitize_code)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
