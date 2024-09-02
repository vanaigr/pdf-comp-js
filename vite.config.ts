import { defineConfig } from 'vite'
import * as Path from 'node:path'
function asPath(...paths) {
    return Path.normalize(Path.join(...paths))
}

const root = import.meta.dirname

export default defineConfig({
    root: asPath(root, 'src'),
    build: {
        emptyOutDir: true,
        outDir: asPath(root, 'dist'),
    },
    server: { port: 3000, },
    preview: { port: 4000, },
})
