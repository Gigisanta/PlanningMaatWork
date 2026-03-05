with open("src/app/page.tsx", "r") as f:
    content = f.read()

# WinAnsi cannot encode emoji "💬"
# Remove the emoji from the text
content = content.replace('const text = "Recomendar asesor 💬";', 'const text = "Recomendar asesor";')

with open("src/app/page.tsx", "w") as f:
    f.write(content)
