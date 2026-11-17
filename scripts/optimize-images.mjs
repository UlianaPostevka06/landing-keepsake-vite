import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'src/assets/images';
const OUT_DIR = 'public/images';

await fs.mkdir(OUT_DIR, { recursive: true });
const files = await fs.readdir(SRC_DIR);

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;

  const name = path.basename(file, ext);
  const input = path.join(SRC_DIR, file);
  const meta = await sharp(input).metadata();
  const baseWidth = Math.round((meta.width || 400) / 2);

  for (const [suffix, width] of [['@1x', baseWidth], ['@2x', meta.width || 800]]) {
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(OUT_DIR, `${name}${suffix}.webp`));
    await sharp(input).resize({ width, withoutEnlargement: true }).avif({ quality: 65 }).toFile(path.join(OUT_DIR, `${name}${suffix}.avif`));
    await sharp(input).resize({ width, withoutEnlargement: true }).jpeg({ quality: 85 }).toFile(path.join(OUT_DIR, `${name}${suffix}.jpg`));
  }
}
console.log('Images optimized!');