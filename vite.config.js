import { defineConfig } from 'vite';
const modelUrl = await import(`../../public/model/box.glb`);

if (modelUrl) {
    console.log('Model URL:', modelUrl);
}
export default defineConfig({
    root: './src',
    publicDir: '../public',
    server: {
        port: 3000,
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
    },
    assetsInclude: ['**/*.glb']
});