import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

const metaPixelHeadPlugin = (): Plugin => ({
  name: 'meta-pixel-head-inject',
  transformIndexHtml: {
    order: 'post',
    handler(html: string) {
      const noscriptTag = `<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1378703800651707&ev=PageView&noscript=1" /></noscript>`;
      // Remove noscript fallback from body if present
      let cleaned = html.replace(/<!-- Meta Pixel Code \(Noscript fallback\) -->[\s\S]*?<!-- End Meta Pixel Code -->/, '');
      cleaned = cleaned.replace(noscriptTag, '');
      // Place noscript tag inside <head> before closing </head>
      return cleaned.replace('</head>', `    ${noscriptTag}\n  </head>`);
    },
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), metaPixelHeadPlugin()],
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
