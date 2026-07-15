// Gera os ícones PNG do PWA a partir de public/icon.svg usando sharp.
// Rode com: npm run gen-icons
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pub = resolve(__dirname, '..', 'public')
const src = readFileSync(resolve(pub, 'icon.svg'))

const azul = { r: 29, g: 78, b: 216, alpha: 1 } // #1d4ed8

const alvos = [
  { arquivo: 'icon-192.png', tamanho: 192, fundo: false },
  { arquivo: 'icon-512.png', tamanho: 512, fundo: false },
  // Maskable: o conteúdo já está na zona segura central; fundo opaco garante bordas.
  { arquivo: 'icon-512-maskable.png', tamanho: 512, fundo: true },
  // Apple touch icon: sem transparência.
  { arquivo: 'apple-touch-icon.png', tamanho: 180, fundo: true },
]

for (const { arquivo, tamanho, fundo } of alvos) {
  let img = sharp(src).resize(tamanho, tamanho)
  if (fundo) img = img.flatten({ background: azul })
  await img.png().toFile(resolve(pub, arquivo))
  console.log(`✓ ${arquivo} (${tamanho}px)`)
}

console.log('Ícones gerados.')
