const fs = require('fs');
const path = require('path');

const htmlFile = path.join(__dirname, 'index.html'); // your HTML file
const baseDir = __dirname; // root folder of your project

function generateLinks(dir, baseURL = './') {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let html = '<ul>\n';

  files.forEach(file => {
    if (file.isDirectory()) {
      html += `<li class="note">${file.name}</li>\n`;
      html += generateLinks(path.join(dir, file.name), path.join(baseURL, file.name));
    } else if (file.isFile() && file.name.endsWith('.html')) {
      html += `<li><a href="${path.join(baseURL, file.name)}">${file.name}</a></li>\n`;
    }
  });

  html += '</ul>\n';
  return html;
}

// Example: Update Class Section
const classHTML = generateLinks(path.join(baseDir, 'class'));
const labHTML = generateLinks(path.join(baseDir, 'lab'));
const appHTML = generateLinks(path.join(baseDir, 'App'));

// Read the existing HTML
let htmlContent = fs.readFileSync(htmlFile, 'utf-8');

// Replace the existing sections (you can define special comments as markers)
htmlContent = htmlContent.replace(/<!-- CLASS_SECTION_START -->[\s\S]*<!-- CLASS_SECTION_END -->/, `<!-- CLASS_SECTION_START -->\n${classHTML}<!-- CLASS_SECTION_END -->`);
htmlContent = htmlContent.replace(/<!-- LAB_SECTION_START -->[\s\S]*<!-- LAB_SECTION_END -->/, `<!-- LAB_SECTION_START -->\n${labHTML}<!-- LAB_SECTION_END -->`);
htmlContent = htmlContent.replace(/<!-- APP_SECTION_START -->[\s\S]*<!-- APP_SECTION_END -->/, `<!-- APP_SECTION_START -->\n${appHTML}<!-- APP_SECTION_END -->`);

// Write back updated HTML
fs.writeFileSync(htmlFile, htmlContent, 'utf-8');

console.log('HTML updated successfully!');
