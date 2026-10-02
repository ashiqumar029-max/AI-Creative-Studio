import JSZip from 'jszip';
import type { Project, Generation } from '../types';

export async function exportProjectAsZip(
  project: Project,
  generations: Generation[] = []
): Promise<void> {
  const zip = new JSZip();

  // 1. Structured JSON Metadata
  const projectMetadata = {
    id: project.id,
    name: project.name,
    type: project.type,
    status: project.status,
    description: project.description,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    generationsCount: generations.length,
    license: 'Commercial Usage Authorized via AI Creative Studio',
  };
  zip.file('project-metadata.json', JSON.stringify(projectMetadata, null, 2));

  // 2. Formatted Markdown Production Document
  const markdownBrief = `# ${project.name.toUpperCase()}
**Creative Medium:** ${project.type.replace('_', ' ').toUpperCase()}  
**Status:** ${project.status.toUpperCase()}  
**Last Updated:** ${new Date(project.updatedAt).toLocaleString()}  
**Workspace ID:** ${project.id}  

---

## 📌 Creative Brief & Direction
${project.description || 'No detailed description specified.'}

---

## 🎨 Asset Inventory (${generations.length} Generations)
${
  generations.length === 0
    ? '*No generated assets currently linked to this container.*'
    : generations
        .map(
          (g, idx) => `
### ${idx + 1}. [${g.toolType.toUpperCase()}] Generated at ${new Date(g.createdAt).toLocaleDateString()}
- **Prompt:** "${g.prompt}"
- **Status:** ${g.status}
${
  g.result?.hook
    ? `- **Hook:** "${g.result.hook}"`
    : ''
}
${
  g.result?.imageUrl
    ? `- **Media Asset URL:** ${g.result.imageUrl}`
    : ''
}
${
  g.result?.videoUrl
    ? `- **Video Stream URL:** ${g.result.videoUrl}`
    : ''
}
`
        )
        .join('\n')
}

---
*Generated securely with AI Creative Studio — Studio Production Pipeline.*
`;
  zip.file('PROJECT_BRIEF.md', markdownBrief);

  // 3. Manifest file
  const manifest = `PROJECT EXPORT MANIFEST
=======================
Project Name: ${project.name}
Export Timestamp: ${new Date().toISOString()}
Total Assets: ${generations.length}
Platform: AI Creative Studio
`;
  zip.file('manifest.txt', manifest);

  // 4. Generate ZIP blob and trigger browser download
  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);

  const cleanName = project.name.toLowerCase().replace(/[^a-z0-9]/gi, '_');
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = `${cleanName}_assets_bundle.zip`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}

export function exportProjectAsPdf(
  project: Project,
  generations: Generation[] = []
): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export the PDF dossier.');
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${project.name} - Project Dossier</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #ffffff;
      color: #1a1a24;
      padding: 40px;
      line-height: 1.6;
    }
    .header {
      border-bottom: 2px solid #6366f1;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      background: #f1f5f9;
      color: #475569;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      margin-right: 8px;
    }
    .status-active {
      background: #ecfdf5;
      color: #059669;
    }
    h1 {
      font-size: 26px;
      margin: 10px 0 5px 0;
      color: #0f172a;
    }
    .brief-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
    }
    .asset-item {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 12px;
    }
    .footer {
      margin-top: 40px;
      font-size: 11px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 15px;
    }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="header">
    <span class="badge status-active">${project.type}</span>
    <span class="badge">${project.status}</span>
    <h1>${project.name}</h1>
    <p style="color: #64748b; font-size: 13px; margin: 4px 0;">
      Created: ${new Date(project.createdAt).toLocaleDateString()} | Updated: ${new Date(project.updatedAt).toLocaleDateString()} | ID: ${project.id}
    </p>
  </div>

  <h3>Creative Brief & Objectives</h3>
  <div class="brief-box">
    ${project.description || 'No creative brief specified.'}
  </div>

  <h3>Generated Assets & Storyboards (${generations.length})</h3>
  ${
    generations.length === 0
      ? '<p style="color: #64748b;">No individual generations linked to this project container.</p>'
      : generations
          .map(
            (g, idx) => `
    <div class="asset-item">
      <div style="display:flex; justify-content:space-between; margin-bottom: 6px;">
        <strong style="text-transform: uppercase; font-size: 12px; color: #4338ca;">Asset #${idx + 1} (${g.toolType})</strong>
        <span style="font-size: 11px; color: #64748b;">${new Date(g.createdAt).toLocaleDateString()}</span>
      </div>
      <p style="font-size: 13px; margin: 4px 0;"><strong>Prompt:</strong> "${g.prompt}"</p>
      ${g.result?.hook ? `<p style="font-size: 12px; color: #047857; margin: 4px 0;"><strong>Hook:</strong> ${g.result.hook}</p>` : ''}
    </div>
  `
          )
          .join('')
  }

  <div class="footer">
    AI Creative Studio • Commercial Project Asset Dossier • Confirmed Verification
  </div>

  <script>
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
`;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
