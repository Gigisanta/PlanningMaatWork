import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# Replace hardcoded hover/dark variants with CSS variables for dynamic hovering UI
content = content.replace('hover:bg-[#3D7A5F]', 'hover:bg-[var(--primary-light)]')
content = content.replace('hover:bg-[#A36D59]', 'hover:bg-[var(--accent-dark)]')
content = content.replace('hover:bg-[#5A9E7F]', 'hover:bg-[var(--primary-light)]')
content = content.replace('bg-[#A36D59]', 'bg-[var(--accent-dark)]')

with open('src/app/page.tsx', 'w') as f:
    f.write(content)

with open('src/components/portfolio/PortfolioEditor.tsx', 'r') as f:
    content = f.read()

# Replace hover colors in editor too
content = content.replace('hover:bg-[#3D7A5F]', 'hover:bg-[var(--primary-light)]')
content = content.replace('hover:bg-[#A36D59]', 'hover:bg-[var(--accent-dark)]')

with open('src/components/portfolio/PortfolioEditor.tsx', 'w') as f:
    f.write(content)

with open('src/components/portfolio/PortfolioPreview.tsx', 'r') as f:
    content = f.read()

content = content.replace('hover:bg-[#3D7A5F]', 'hover:bg-[var(--primary-light)]')

with open('src/components/portfolio/PortfolioPreview.tsx', 'w') as f:
    f.write(content)
