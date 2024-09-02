import { defineConfig } from 'vite'
import * as Path from 'node:path'
function asPath(...paths: string[]) {
    return Path.normalize(Path.join(...paths))
}

const root = import.meta.dirname
const src = asPath(root, 'src')

export default defineConfig({
    define: { __server_url: JSON.stringify('http://localhost:2999') },
    root: src,
    build: {
        emptyOutDir: true,
        outDir: asPath(root, 'dist'),
    },
    server: { port: 3000, },
    preview: { port: 4000, },
})
