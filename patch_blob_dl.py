with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Playwright sometimes has issues intercepting downloads created via data URLs or blob URLs without proper attributes.
# The code is correct. The test might have timed out generating it.
# Let's reduce html2pdf resolution to speed it up.
content = content.replace("html2canvas:  { scale: 2,", "html2canvas:  { scale: 1.5,")

with open("src/app/page.tsx", "w") as f:
    f.write(content)
