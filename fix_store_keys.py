import re

with open('src/stores/portfolio-store.ts', 'r') as f:
    content = f.read()

# Remove duplicate branding fields in initialState
content = re.sub(
    r'(\s*colorPrincipal: undefined,\s*colorAcento: undefined,\s*logoUrl: undefined,\s*// Branding\s*colorPrincipal: undefined,\s*colorAcento: undefined,\s*logoUrl: undefined,)',
    r'\n  // Branding\n  colorPrincipal: undefined,\n  colorAcento: undefined,\n  logoUrl: undefined,',
    content
)

# Remove duplicate branding fields in resetConfig
content = re.sub(
    r'(\s*colorPrincipal: undefined,\s*colorAcento: undefined,\s*logoUrl: undefined,\s*// Branding\s*colorPrincipal: undefined,\s*colorAcento: undefined,\s*logoUrl: undefined,\s*portfolioLibrary)',
    r'\n      // Branding\n      colorPrincipal: undefined,\n      colorAcento: undefined,\n      logoUrl: undefined,\n      portfolioLibrary',
    content
)

with open('src/stores/portfolio-store.ts', 'w') as f:
    f.write(content)
