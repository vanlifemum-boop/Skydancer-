// One-time migration of the verified original assets; no vehicle edits.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = process.argv[2];
if (!source || !path.isAbsolute(source)) throw new Error('Pass the absolute verified asset directory.');
const require = createRequire(import.meta.url);
const sharp = require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + '/sharp');
const original = fs.readFileSync(path.join(source,'assets/index-BQ-g3cev.css'),'utf8');
const start = original.indexOf(':root{--ink:');
const end = original.indexOf('@property --tw-translate-x',start);
if (start < 0 || end < start) throw new Error('Existing design boundaries not found.');
let css = original.slice(start,end).replaceAll('#ecd6b4','#dce9f3').replace(/\.hotspot-garage\{[^}]*\}/g,'');
const service = original.indexOf('.service-link{',end);
if (service >= 0) css += original.slice(service).replaceAll('#ecd6b4','#dce9f3');
fs.writeFileSync(path.join(root,'assets/site-v2.css'),css);
for (const file of ['skydancer-diamond-front','skydancer-diamond-side','skydancer-diamond-panorama','skydancer-video']) {
  fs.copyFileSync(path.join(source,file+'.jpg'),path.join(root,file+'.jpg'));
  await sharp(path.join(source,file+'.jpg')).webp({quality:82,effort:6}).toFile(path.join(root,'assets',file+'.webp'));
  await sharp(path.join(source,file+'.jpg')).resize({width:768,withoutEnlargement:true}).webp({quality:80,effort:6}).toFile(path.join(root,'assets',file+'-768.webp'));
}
fs.copyFileSync(path.join(source,'logo-original.png'),path.join(root,'logo-original.png'));
console.log('Preserved original photos and logo; generated responsive WebP copies and extracted the existing design CSS.');
