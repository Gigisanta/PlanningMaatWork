import re

with open('src/app/__tests__/store.test.tsx', 'r') as f:
    content = f.read()

# Fix types in tests that are failing
content = re.sub(
    r'(expect\(parsed\.edad\)\.toBe\(35\))',
    r'\1\n    expect(parsed.aporteInicial).toBe(1000)',
    content
)

content = re.sub(
    r'(usePortfolioStore\.getState\(\)\.setEdad\(35\))',
    r'\1\n    usePortfolioStore.getState().setAporteInicial(1000)',
    content
)

content = re.sub(
    r'(expect\(state\.edad\)\.toBe\(30\))',
    r'\1\n    expect(state.aporteInicial).toBe(0)',
    content
)

# And fix syntax errors at the end of the file.
lines = content.split('\n')
for i in range(len(lines)):
    if "  const [tipoAporte, setTipoAporte] = useState" in lines[i]:
        lines[i] = ""
    elif "  const [aporteMensual, setAporteMensual] = useState" in lines[i]:
        lines[i] = ""

with open('src/app/__tests__/store.test.tsx', 'w') as f:
    f.write('\n'.join(lines))
