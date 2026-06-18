/**
 * Fast ad renderer — 4 static frames → crossfaded MP4
 */
const puppeteer = require('puppeteer-core');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const W = 1080, H = 1920;
const ADS = path.join(__dirname);
const FRAMES = path.join(ADS, 'frames');
const OUTPUT = path.join(ADS, '..', 'assets', 'empire-builder-ad.mp4');
const DUR = 3; // seconds per frame
const FADE = 0.5; // crossfade duration

async function main() {
  console.log('🎬 Empire Builder Ad — Fast Renderer\n');

  fs.rmSync(FRAMES, { recursive: true, force: true });
  fs.mkdirSync(FRAMES, { recursive: true });

  const chromePaths = ['/usr/bin/google-chrome-stable', '/usr/bin/google-chrome', '/usr/bin/chromium-browser'];
  const chrome = chromePaths.find(p => fs.existsSync(p));
  if (!chrome) { console.error('❌ Chrome not found'); process.exit(1); }

  const browser = await puppeteer.launch({
    executablePath: chrome, headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu',
           '--font-render-hinting=none', `--window-size=${W},${H}`],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

  const files = ['p1.html', 'p2.html', 'p3.html', 'p4.html'];
  const framePaths = [];

  for (let i = 0; i < files.length; i++) {
    await page.goto(`file://${path.join(ADS, files[i])}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500)); // let fonts + gradients render
    const fp = path.join(FRAMES, `f${i}.png`);
    await page.screenshot({ path: fp, type: 'png' });
    framePaths.push(fp);
    console.log(`  📸 ${files[i]} → f${i}.png`);
  }

  await browser.close();
  console.log('\n✅ Frames captured\n');

  // ffmpeg xfade chain
  console.log('🎬 Encoding MP4 with crossfades...');
  const inputs = framePaths.map(p => `-loop 1 -t ${DUR} -i "${p}"`).join(' ');

  // Build xfade filter
  let filter = '';
  let prev = '[0:v]';
  for (let i = 1; i < 4; i++) {
    const offset = DUR * i - FADE * i;
    const out = i < 3 ? `[v${i}]` : '[vout]';
    filter += `${prev}[${i}:v]xfade=transition=fade:duration=${FADE}:offset=${offset.toFixed(2)}${out};`;
    prev = out;
  }
  filter = filter.replace(/;$/, '');

  const cmd = `ffmpeg -y ${inputs} -filter_complex "${filter}" -map "[vout]" ` +
    `-c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -movflags +faststart "${OUTPUT}"`;

  try {
    execSync(cmd, { stdio: 'pipe', timeout: 120000 });
    const stats = fs.statSync(OUTPUT);
    const mb = (stats.size / 1024 / 1024).toFixed(1);
    const totalDur = DUR * 4 - FADE * 3;
    console.log(`\n✅ DONE!`);
    console.log(`📁 ${OUTPUT}`);
    console.log(`📐 ${W}x${H} | ${totalDur.toFixed(1)}s | ${mb}MB`);
  } catch (err) {
    console.error('❌ xfade failed, trying simple concat...');
    const cmd2 = `ffmpeg -y ${inputs} -filter_complex "[0:v][1:v][2:v][3:v]concat=n=4:v=1:a=0[vout]" ` +
      `-map "[vout]" -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p -movflags +faststart "${OUTPUT}"`;
    try {
      execSync(cmd2, { stdio: 'pipe', timeout: 120000 });
      console.log(`✅ DONE (concat)! ${OUTPUT}`);
    } catch (e2) {
      console.error('❌ Failed:', e2.stderr?.toString());
    }
  }

  fs.rmSync(FRAMES, { recursive: true, force: true });
  console.log('🧹 Cleaned up');
}

main().catch(e => { console.error('❌', e); process.exit(1); });
