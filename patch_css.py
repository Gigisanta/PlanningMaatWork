import re

with open("src/lib/generatePlan.ts", "r") as f:
    content = f.read()

# Add page-break styles
css_insertion = """      body { margin: 0; padding: 0; background: #FAFAF8; }

      @media print {
        .page-container, .section, .card {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .html2pdf__page-break {
          page-break-before: always;
          break-before: page;
        }
      }"""

content = content.replace("body { margin: 0; padding: 0; background: #FAFAF8; }", css_insertion)

# Replace display: flex with display: block on main layout elements as flex interferes with html2pdf page breaks
content = content.replace("display: flex; flex-direction: column;", "")
content = content.replace("min-height: 100vh;", "")

with open("src/lib/generatePlan.ts", "w") as f:
    f.write(content)

print("Applied CSS patches to generatePlan.ts")
