from playwright.sync_api import Page, sync_playwright
import time
import os

def verify_feature(page: Page):
  print("Navigating to localhost:3000...")
  page.goto("http://localhost:3000")
  page.wait_for_timeout(3000)

  print("Taking full page screenshot")
  os.makedirs("/home/jules/verification", exist_ok=True)
  page.screenshot(path="/home/jules/verification/verification.png", full_page=True)

if __name__ == "__main__":
  with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    os.makedirs("/home/jules/verification/video", exist_ok=True)
    context = browser.new_context(record_video_dir="/home/jules/verification/video")
    page = context.new_page()
    try:
      verify_feature(page)
    except Exception as e:
      print(f"Error: {e}")
      page.screenshot(path="/home/jules/verification/error.png")
    finally:
      context.close()
      browser.close()
