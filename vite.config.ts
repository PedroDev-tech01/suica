import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

const metaPixelHeadPlugin = (): Plugin => ({
  name: 'meta-pixel-head-inject',
  transformIndexHtml: {
    order: 'post',
    handler(html: string) {
      const noscriptTag = `<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2198456244248121&ev=PageView&noscript=1" /></noscript>`;
      // Remove noscript fallback from body if present
      let cleaned = html.replace(/<!-- Meta Pixel Code \(Noscript fallback\) -->[\s\S]*?<!-- End Meta Pixel Code -->/, '');
      cleaned = cleaned.replace(noscriptTag, '');
      // Place noscript tag inside <head> before closing </head>
      return cleaned.replace('</head>', `    ${noscriptTag}\n  </head>`);
    },
  },
});

/**
 * Creates static directories and fallback index.html / 404.html copies
 * so that static cloud preview servers (e.g. Google Cloud Run static proxy, Netlify, Cloudflare)
 * can serve direct URLs like /optimizer-access and /v2 without "Page not found" 404 errors.
 */
const spaStaticRoutesPlugin = (): Plugin => ({
  name: 'spa-static-routes-plugin',
  closeBundle() {
    const distPath = path.resolve(__dirname, 'dist');
    const indexHtmlPath = path.resolve(distPath, 'index.html');

    if (!fs.existsSync(indexHtmlPath)) return;

    const htmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');

    // 1. Create 404.html fallback
    fs.writeFileSync(path.resolve(distPath, '404.html'), htmlContent);

    // 2. Create subdirectories with index.html for direct navigation
    const routes = ['optimizer-access'];
    for (const route of routes) {
      const routeDir = path.resolve(distPath, route);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      fs.writeFileSync(path.resolve(routeDir, 'index.html'), htmlContent);
      fs.writeFileSync(path.resolve(distPath, `${route}.html`), htmlContent);
    }
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), metaPixelHeadPlugin(), spaStaticRoutesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },
  };
});
