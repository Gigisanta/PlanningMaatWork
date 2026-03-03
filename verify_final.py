import asyncio
from playwright.async_api import async_playwright
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        # Start dev server
        os.system("kill $(lsof -t -i :3000) 2>/dev/null || true")
        # Run in background
        os.system("bun x next dev -p 3000 > next_log.txt 2>&1 &")

        # Wait for server
        print("Waiting for server...")
        for i in range(30):
            try:
                await page.goto("http://localhost:3000")
                print("Server is up!")
                break
            except:
                await asyncio.sleep(2)

        await asyncio.sleep(5)

        # Click on Biblioteca
        print("Opening Biblioteca...")
        await page.click("button:has-text('Biblioteca')")
        await asyncio.sleep(2)
        await page.screenshot(path="verification/library_dialog.png")

        # Apply a template (Moderado)
        print("Applying template...")
        await page.click("h4:has-text('Moderado (Dolarizado)')")
        await asyncio.sleep(2)

        # Close dialog (if not closed automatically)
        await page.keyboard.press("Escape")

        # Go to Cartera tab
        print("Checking Cartera tab...")
        await page.click("button:has-text('Cartera')")
        await asyncio.sleep(2)
        await page.screenshot(path="verification/cartera_tab_updated.png")

        # Generate Plan
        print("Generating plan...")
        await page.click("button:has-text('Generar Plan Maestro')")
        # Increase wait time for the API
        await asyncio.sleep(15)

        # Screenshot of preview
        print("Capturing preview...")
        await page.screenshot(path="verification/preview_updated.png")

        await browser.close()
        os.system("kill $(lsof -t -i :3000) 2>/dev/null || true")

if __name__ == "__main__":
    os.makedirs("verification", exist_ok=True)
    asyncio.run(verify())
