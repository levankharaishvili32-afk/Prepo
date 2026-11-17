import sharp from 'sharp'; import fs from 'node:fs'; import path from 'node:path';
const out = process.argv[2]; fs.mkdirSync(out,{recursive:true});
for (const f of fs.readdirSync('assets-original')) {
  if (!/\.(png|jpg)$/.test(f)) continue;
  const m = await sharp('assets-original/'+f).metadata();
  console.log(f, m.width, m.height, m.hasAlpha);
  await sharp('assets-original/'+f).resize(520,520,{fit:'inside'}).flatten({background:'#888888'}).jpeg({quality:75}).toFile(path.join(out, f.replace(/\.\w+$/,'.jpg')));
}
