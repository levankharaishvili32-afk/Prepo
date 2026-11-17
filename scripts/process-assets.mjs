// ორიგინალებიდან (assets-original/) ამზადებს საიტის სურათებს: src/assets/ და public/.
// გაშვება: npm run assets            (ყველაფერი)
//          npm run assets -- logos   (მხოლოდ ერთი ჯგუფი: logos | mascots | photos | icons | og)
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const SRC = 'assets-original';
const OUT = 'src/assets';
const PUB = 'public';
const CACHE = '.cache/cutouts';
for (const d of [OUT, PUB, CACHE]) fs.mkdirSync(d, { recursive: true });

const CREAM = { r: 0xff, g: 0xf3, b: 0xdf };
const RED = { r: 0xd5, g: 0x2b, b: 0x1e };
const LOGO_RED = { r: 0xc8, g: 0x19, b: 0x1e };
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };
const only = process.argv.slice(2);
const want = (name) => only.length === 0 || only.includes(name);

/** ბრტყელი ორფერიანი ლოგო -> გამჭვირვალე PNG (პროექცია ფონის ფერსა და ლოგოს ფერს შორის). */
async function keyLogo(file, fg, out, { low = 0.1, high = 0.9 } = {}) {
  const { data, info } = await sharp(path.join(SRC, file)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const bg = { r: data[0], g: data[1], b: data[2] };
  // ლოგოს რეალური ფერი: ფონიდან ყველაზე შორს მყოფი პიქსელების საშუალო
  let max = 0;
  const dist = new Float32Array(info.width * info.height);
  for (let i = 0, p = 0; i < data.length; i += 3, p++) {
    const d = Math.hypot(data[i] - bg.r, data[i + 1] - bg.g, data[i + 2] - bg.b);
    dist[p] = d;
    if (d > max) max = d;
  }
  let sr = 0, sg = 0, sb = 0, n = 0;
  for (let i = 0, p = 0; i < data.length; i += 3, p++) {
    if (dist[p] > max * 0.92) { sr += data[i]; sg += data[i + 1]; sb += data[i + 2]; n++; }
  }
  const src = { r: sr / n, g: sg / n, b: sb / n };
  const v = { r: src.r - bg.r, g: src.g - bg.g, b: src.b - bg.b };
  const vv = v.r * v.r + v.g * v.g + v.b * v.b;
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, p = 0; i < data.length; i += 3, p++) {
    let t = ((data[i] - bg.r) * v.r + (data[i + 1] - bg.g) * v.g + (data[i + 2] - bg.b) * v.b) / vv;
    t = Math.min(1, Math.max(0, (t - low) / (high - low)));
    rgba[p * 4] = fg.r; rgba[p * 4 + 1] = fg.g; rgba[p * 4 + 2] = fg.b; rgba[p * 4 + 3] = Math.round(t * 255);
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .extend({ top: 8, bottom: 8, left: 8, right: 8, background: CLEAR })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, out));
  console.log('logo', out, 'bg', Object.values(bg), 'fg-src', Object.values(src).map(Math.round));
}

/** ML-ით ფონის მოშორება (შედეგი ქეშდება .cache-ში). */
async function cutout(file) {
  const cached = path.join(CACHE, file.replace(/\.\w+$/, '.png'));
  if (fs.existsSync(cached)) return fs.readFileSync(cached);
  execFileSync(process.execPath, ['scripts/cutout.mjs', path.join(SRC, file), cached], { stdio: 'inherit' });
  return fs.readFileSync(cached);
}

/**
 * ღია ფონზე დახატული პერსონაჟის ამოჭრა.
 * ML-ნიღაბი მარტო არ ვარგა (თვალის თეთრს ჭრის), ამიტომ ფონი იშლება კიდეებიდან "ჩასხმით":
 * პიქსელი ქრება, თუ კიდიდან მიიღწევა და ან ფონის ფერისაა, ან ML-ით ფონია და ღია-ნაცრისფერია (ჩრდილი).
 * კონტურით შემოსაზღვრული თეთრი ადგილები (თვალები, ნიორი) ხელუხლებელი რჩება.
 */
async function floodCutout(file) {
  const S = 1500;
  const { data, info } = await sharp(path.join(SRC, file)).resize(S, S, { fit: 'inside' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const ml = await sharp(await cutout(file)).resize(w, h, { fit: 'fill' }).ensureAlpha().extractChannel(3).raw().toBuffer();
  const bg = [data[0], data[1], data[2]];
  const bgLike = (p) => {
    const r = data[p * 3], g = data[p * 3 + 1], b = data[p * 3 + 2];
    const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
    return Math.hypot(r - bg[0], g - bg[1], b - bg[2]) < 30 || (mn > 205 && mx - mn < 48);
  };
  const gone = new Uint8Array(w * h);
  const flood = (seeds, pass) => {
    const stack = [];
    const push = (p) => { if (!gone[p] && pass(p)) { gone[p] = 1; stack.push(p); } };
    seeds(push);
    while (stack.length) {
      const p = stack.pop(), x = p % w;
      if (x > 0) push(p - 1);
      if (x < w - 1) push(p + 1);
      if (p >= w) push(p - w);
      if (p < w * (h - 1)) push(p + w);
    }
  };
  // 1) გარე ფონი: კიდეებიდან მიღწევადი ML-გამჭვირვალე არე (თვალის "ხვრელები" აქ ვერ ხვდება)
  flood((push) => {
    for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
    for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
  }, (p) => ml[p] < 128);
  // 2) გარე ფონიდან გაფართოება ფონის ფერის პიქსელებზე (კიდეების ბურუსი, ML-ის ნარჩენები)
  const outer = [];
  for (let p = 0; p < w * h; p++) if (gone[p]) outer.push(p);
  flood((push) => {
    for (const p of outer) {
      const x = p % w;
      if (x > 0) push(p - 1);
      if (x < w - 1) push(p + 1);
      if (p >= w) push(p - w);
      if (p < w * (h - 1)) push(p + w);
    }
  }, bgLike);
  const rgba = Buffer.alloc(w * h * 4);
  for (let p = 0; p < w * h; p++) {
    rgba[p * 4] = data[p * 3]; rgba[p * 4 + 1] = data[p * 3 + 1]; rgba[p * 4 + 2] = data[p * 3 + 2];
    rgba[p * 4 + 3] = gone[p] ? 0 : 255;
  }
  // წვრილი ნარჩენი წერტილების მოშორება: ალფას მცირე ეროზია და უკან გაფართოება
  const alpha = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).extractChannel(3).blur(2).threshold(200).png().toBuffer();
  const grown = await sharp(alpha).blur(2).threshold(40).png().toBuffer();
  const alpha2 = await sharp(grown).blur(0.6).extractChannel(0).toBuffer();
  return sharp(data, { raw: { width: w, height: h, channels: 3 } }).joinChannel(alpha2).png().toBuffer();
}

/** გამჭვირვალე პერსონაჟი -> სტიკერი კრემისფერი კონტურით. */
async function sticker(buf, out, { size = 1100, stroke = 30, outline = CREAM } = {}) {
  const pad = stroke * 3;
  // სუსტი ნარჩენი ალფა (ბურუსი) იჭრება
  const clean = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < clean.data.length; i += 4) if (clean.data[i] < 40) clean.data[i] = 0;
  const base = await sharp(clean.data, { raw: clean.info })
    .trim({ threshold: 1 })
    .resize(size - pad * 2, size - pad * 2, { fit: 'inside' })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: CLEAR })
    .png()
    .toBuffer();
  const meta = await sharp(base).metadata();
  // sharp ოპერაციებს ფიქსირებული რიგით ასრულებს, ამიტომ თითო ნაბიჯი ცალკე pipeline-ია
  const spread = await sharp(base).extractChannel(3).blur(stroke * 0.55).toBuffer();
  const hard = await sharp(spread).threshold(18).toBuffer();
  const mask = await sharp(hard).blur(1.2).toBuffer();
  const ring = await sharp({ create: { width: meta.width, height: meta.height, channels: 3, background: outline } })
    .joinChannel(mask)
    .png()
    .toBuffer();
  await sharp(ring).composite([{ input: base }]).png({ compressionLevel: 9 }).toFile(path.join(OUT, out));
  console.log('sticker', out, meta.width, meta.height);
}

const photo = (file, out, width) =>
  sharp(path.join(SRC, file))
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(OUT, out))
    .then(() => console.log('photo', out));

if (want('logos')) {
  await keyLogo('profile-cream.png', LOGO_RED, 'logo-red.png');
  await keyLogo('profile-red.png', CREAM, 'logo-cream.png');
  await keyLogo('logo-source.png', LOGO_RED, 'logo-full-red.png', { low: 0.18 });
}
if (want('mascots')) {
  await sticker(await floodCutout('mascot-arrabbiata.png'), 'mascot-arrabbiata.png');
  await sticker(await floodCutout('mascot-pesto.png'), 'mascot-pesto.png');
  await sticker(fs.readFileSync(path.join(SRC, 'mascot-sitting.png')), 'mascot-sitting.png');
}
if (want('photos')) {
  await photo('packaging-mockup.png', 'packaging-mockup.jpg', 1800);
  await photo('promo-ingredients.jpg', 'promo-ingredients.jpg', 1080);
  await photo('promo-kitchen.jpg', 'promo-kitchen.jpg', 1080);
  await photo('promo-red-green.jpg', 'promo-red-green.jpg', 1080);
  await photo('hero-vertical.png', 'hero-vertical.jpg', 1200);
}
if (want('icons')) {
  const src = path.join(SRC, 'profile-red.png');
  await sharp(src).resize(32).png().toFile(path.join(PUB, 'favicon-32.png'));
  await sharp(src).resize(192).png().toFile(path.join(PUB, 'favicon-192.png'));
  await sharp(src).resize(180).png().toFile(path.join(PUB, 'apple-touch-icon.png'));
  console.log('icons ok');
}
if (want('og')) {
  // 1200x630: წითელი ფონი, კრემისფერი ლოგო, პროდუქტის ფოტო მომრგვალებულ ბარათში, მასკოტი
  const W = 1200, H = 630, P = 470;
  const round = Buffer.from(`<svg width="${P}" height="${P}"><rect width="${P}" height="${P}" rx="56" fill="#000"/></svg>`);
  const card = await sharp(path.join(SRC, 'promo-ingredients.jpg')).resize(P, P).composite([{ input: round, blend: 'dest-in' }]).png().toBuffer();
  const frame = await sharp(Buffer.from(`<svg width="${P + 24}" height="${P + 24}"><rect width="${P + 24}" height="${P + 24}" rx="68" fill="#FFF3DF"/></svg>`)).png().toBuffer();
  const logo = await sharp(path.join(OUT, 'logo-cream.png')).resize({ width: 500 }).toBuffer();
  const mascot = await sharp(path.join(OUT, 'mascot-sitting.png')).resize({ width: 250 }).rotate(-8, { background: CLEAR }).toBuffer();
  const lm = await sharp(logo).metadata();
  await sharp({ create: { width: W, height: H, channels: 3, background: RED } })
    .composite([
      { input: frame, left: W - P - 24 - 68, top: (H - P - 24) / 2 },
      { input: card, left: W - P - 12 - 68, top: (H - P) / 2 },
      { input: logo, left: 80, top: Math.round((H - lm.height) / 2) - 20 },
      { input: mascot, left: 400, top: 360 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(PUB, 'og.jpg'));
  console.log('og ok');
}
