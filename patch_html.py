import re

with open("src/lib/generatePlan.ts", "r") as f:
    content = f.read()

# Add the attached PDF links for the HTML view in generatePlan.ts
html_attachments_block = """
  ${(data.attachedFiles && data.attachedFiles.length > 0) ? `
  <div style="page-break-before: always;" class="html2pdf__page-break"></div>
  <div class="page-container" style="justify-content: center; padding: 40px 0;">
    <div class="header" style="margin-bottom: 40px; text-align: center;">
      <div class="header-logo" style="justify-content: center; margin-bottom: 10px;">Cactus</div>
      <div class="header-title" style="text-align: center;">Model Portfolios</div>
    </div>
    <div class="content" style="display: flex; align-items: center; justify-content: center;">
      <div class="section" style="width: 100%; max-width: 600px; margin: 0 auto; box-shadow: none; border: none; background: transparent;">
        <div class="card" style="margin-top: 40px; text-align: center; padding: 60px 40px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E8E6E0; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
          <div style="font-size: 64px; margin-bottom: 24px;">📄</div>
          <h2 style="color: #2D5A4A; font-size: 28px; margin-bottom: 16px; font-weight: 800;">Documentos y Proyecciones</h2>
          <p style="color: #333333; font-size: 16px; line-height: 1.6; max-width: 400px; margin: 0 auto; margin-bottom: 30px;">
            A continuación se adjuntan las proyecciones detalladas y la documentación técnica relacionada con este plan financiero.
          </p>
          <div style="display: flex; flex-direction: column; gap: 15px;">
            ${data.attachedFiles.map(file => `
              <a href="${file.data}" download="${file.name}" style="display: flex; align-items: center; padding: 16px; background: #F5F4F0; border-radius: 12px; text-decoration: none; color: #1F2D26; transition: background 0.2s; border: 1px solid #E8E6E0;">
                <span style="font-size: 24px; margin-right: 15px;">📑</span>
                <div style="text-align: left; flex: 1;">
                  <div style="font-weight: 600; font-size: 15px;">${file.name}</div>
                  <div style="font-size: 13px; color: #7A8B80;">PDF Document - ${(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <span style="padding: 8px 16px; background: #2D5A4A; color: white; border-radius: 8px; font-size: 14px; font-weight: 500;">Ver PDF</span>
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>
  ` : ''}
</body>
"""

# Replace the previous block we added for PDFs (which didn't have the <a> links)
old_attachments_block_regex = r"\$\{\(data\.attachedFiles && data\.attachedFiles\.length > 0\) \? `\n  <div style=\"page-break-before: always;\" class=\"html2pdf__page-break\"></div>\n  <div class=\"page-container\".*?</body>"

if re.search(old_attachments_block_regex, content, re.DOTALL):
    content = re.sub(old_attachments_block_regex, html_attachments_block, content, flags=re.DOTALL)
    print("Replaced attachedFiles block")
else:
    print("Could not find the old block, trying another way")

with open("src/lib/generatePlan.ts", "w") as f:
    f.write(content)
