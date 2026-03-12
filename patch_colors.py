import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# Apply CSS color-mix to create gradients for the UI
content = re.sub(
    r'(<div className="min-h-screen bg-\[\#FAFAF8\] flex flex-col" style=\{\{"--primary": colorPrincipal \|\| "\#2D5A4A", "--primary-light": colorPrincipal \|\| "\#3D7A5F", "--accent": colorAcento \|\| "\#C4846C"\} as React\.CSSProperties\}>)',
    r'<div className="min-h-screen bg-[#FAFAF8] flex flex-col" style={{"--primary": colorPrincipal || "#2D5A4A", "--primary-light": colorPrincipal ? `color-mix(in srgb, ${colorPrincipal} 80%, white)` : "#3D7A5F", "--primary-dark": colorPrincipal ? `color-mix(in srgb, ${colorPrincipal} 80%, black)` : "#1F4A3D", "--accent": colorAcento || "#C4846C", "--accent-light": colorAcento ? `color-mix(in srgb, ${colorAcento} 80%, white)` : "#D9A58B", "--accent-dark": colorAcento ? `color-mix(in srgb, ${colorAcento} 80%, black)` : "#A36D59"} as React.CSSProperties}>',
    content
)
with open('src/app/page.tsx', 'w') as f:
    f.write(content)


with open('src/lib/generatePlan.ts', 'r') as f:
    content = f.read()

# Apply CSS color-mix to create gradients for the PDF
content = re.sub(
    r'(:root \{\n      --primary-dark: \$\{data\.colorPrincipal \|\| "\#2D5A4A"\};\n      --primary: \$\{data\.colorPrincipal \|\| "\#3D7A5F"\};\n      --primary-light: \$\{data\.colorPrincipal \|\| "\#5A9E7F"\};\n      --primary-pale: \#8BC4A8;\n      --primary-muted: \#B8DBC8;\n      --accent: \$\{data\.colorAcento \|\| "\#C4846C"\};\n      --accent-light: \$\{data\.colorAcento \|\| "\#D9A58B"\};\n      --accent-pale: \#F0DFD5;)',
    r':root {\n      --primary-dark: ${data.colorPrincipal ? `color-mix(in srgb, ${data.colorPrincipal} 80%, black)` : "#2D5A4A"};\n      --primary: ${data.colorPrincipal || "#3D7A5F"};\n      --primary-light: ${data.colorPrincipal ? `color-mix(in srgb, ${data.colorPrincipal} 80%, white)` : "#5A9E7F"};\n      --primary-pale: ${data.colorPrincipal ? `color-mix(in srgb, ${data.colorPrincipal} 40%, white)` : "#8BC4A8"};\n      --primary-muted: ${data.colorPrincipal ? `color-mix(in srgb, ${data.colorPrincipal} 20%, white)` : "#B8DBC8"};\n      --accent: ${data.colorAcento || "#C4846C"};\n      --accent-light: ${data.colorAcento ? `color-mix(in srgb, ${data.colorAcento} 80%, white)` : "#D9A58B"};\n      --accent-pale: ${data.colorAcento ? `color-mix(in srgb, ${data.colorAcento} 30%, white)` : "#F0DFD5"};',
    content
)
with open('src/lib/generatePlan.ts', 'w') as f:
    f.write(content)
