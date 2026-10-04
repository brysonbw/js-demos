import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import { configDefaults } from 'vitest/config';
import eslint from 'vite-plugin-eslint';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDevHTTPSEnabled =
    typeof env.HTTPS_CERT === 'string' && typeof env.HTTPS_KEY === 'string';
  return {
    base: mode === 'production' ? '/js-demos/' : '/',
    server: isDevHTTPSEnabled
      ? {
          https: {
            key: fs.readFileSync(env.HTTPS_KEY),
            cert: fs.readFileSync(env.HTTPS_CERT),
          },
        }
      : undefined,
    test: {
      environment: 'jsdom',
      pool: 'vmThreads',
      globals: true,
      setupFiles: './src/testing/setup.js',
      include: ['src/**/*.{spec,test}.js', 'tests/**/*.{spec,test}.js'],
      coverage: {
        reporter: ['text', 'html'],
        exclude: [...configDefaults.exclude, 'dist'],
        clean: true,
        cleanOnRerun: false,
        thresholds: {
          lines: 80,
          functions: 75,
          branches: 70,
          statements: 80,
        },
      },
    },
    plugins: [
      eslint(),
      {
        name: 'csp',
        apply: 'build',
        transformIndexHtml(html) {
          const csp = `default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self'; form-action 'self'; object-src 'none'; media-src 'self'; base-uri 'none'; upgrade-insecure-requests;`;
          html = html.replace(
            /<head>/,
            `<head>\n<meta http-equiv="Content-Security-Policy" content="${csp}">`
          );
          return html;
        },
      },
    ],
    build: {
      outDir: 'dist/browser',
      modulePreload: { polyfill: false },
      rollupOptions: {
        output: {
          entryFileNames: '[name].[hash].js',
          chunkFileNames: '[name].[hash].js',
          assetFileNames: '[name].[hash].[ext]',
        },
      },
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        format: {
          comments: false,
        },
        parse: {
          html5_comments: false,
        },
        sourceMap: false,
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  };
});
