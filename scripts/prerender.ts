import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p: string) => path.resolve(__dirname, '..', p);

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8');

// Load the server entry we just built
const { render } = await import(toAbsolute('dist/server/entry-server.js'));

// Render the app
const { html } = render();

// Replace placeholder
const finalHtml = template.replace('<!--app-html-->', html);

// Write the file
const filePath = toAbsolute('dist/index.html');
fs.writeFileSync(filePath, finalHtml);

console.log('pre-rendered:', filePath);

// Clean up server build if desired, or keep it. Vercel only deploys 'dist' (static).
// We remove the server folder to avoid deploying it as static assets.
fs.rmSync(toAbsolute('dist/server'), { recursive: true, force: true });
console.log('cleaned up server build artifacts');
