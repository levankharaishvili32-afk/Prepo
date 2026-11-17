// Hero-ს ვიდეოს შეკუმშვა: H.264 MP4 + VP9 WebM (უხმოდ) და poster კადრი.
// გაშვება: npm run video
import ffmpeg from 'ffmpeg-static';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const input = 'assets-original/video-clean.mp4';
fs.mkdirSync('public/video', { recursive: true });
fs.mkdirSync('src/assets', { recursive: true });
const run = (args) => execFileSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', ...args], { stdio: 'inherit' });
const vf = 'scale=720:-2';

run(['-i', input, '-an', '-vf', vf, '-c:v', 'libx264', '-preset', 'slow', '-b:v', '1150k', '-maxrate', '1500k', '-bufsize', '3000k',
  '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', 'public/video/hero.mp4']);
run(['-i', input, '-an', '-vf', vf, '-c:v', 'libvpx-vp9', '-b:v', '850k', '-maxrate', '1200k', '-bufsize', '2400k',
  '-row-mt', '1', '-cpu-used', '2', '-deadline', 'good', 'public/video/hero.webm']);
// poster = პირველი კადრი (astro:assets შემდეგ თვითონ გადაიყვანს WebP/AVIF-ში)
run(['-i', input, '-frames:v', '1', '-q:v', '2', 'src/assets/hero-poster.jpg']);
for (const f of ['hero.mp4', 'hero.webm']) console.log(f, (fs.statSync('public/video/' + f).size / 1024).toFixed(0) + ' KB');
