#!/bin/bash
# Render Empire Builder ad video from HTML using headless browser + ffmpeg
# Requirements: chromium/chrome, ffmpeg, python3
# Usage: bash render-ad.sh

set -e
cd "$(dirname "$0")"

WIDTH=1080
HEIGHT=1920
FPS=30
DURATION=10
TOTAL_FRAMES=$((FPS * DURATION))
FRAMES_DIR="./frames"
OUTPUT="../assets/empire-builder-ad.mp4"

echo "🎬 Empire Builder Ad Video Renderer"
echo "===================================="
echo "Resolution: ${WIDTH}x${HEIGHT}"
echo "Duration: ${DURATION}s @ ${FPS}fps"
echo "Total frames: ${TOTAL_FRAMES}"
echo ""

# Clean up
rm -rf "$FRAMES_DIR"
mkdir -p "$FRAMES_DIR"

# Step 1: Use Chromium to render the HTML at the right resolution
echo "📸 Step 1: Capturing frames from HTML..."

# Try different Chrome/Chromium paths
CHROME=""
for path in \
  /usr/bin/google-chrome-stable \
  /usr/bin/google-chrome \
  /usr/bin/chromium-browser \
  /usr/bin/chromium \
  /snap/bin/chromium \
  /usr/bin/chrome; do
  if [ -f "$path" ]; then
    CHROME="$path"
    break
  fi
done

if [ -z "$CHROME" ]; then
  echo "❌ Chrome/Chromium not found. Install with:"
  echo "   sudo apt install chromium-browser"
  echo ""
  echo "Trying with puppeteer/playwright fallback..."
  
  # Fallback: use node with puppeteer
  if command -v node &>/dev/null; then
    echo "Using Node.js puppeteer approach..."
    node -e "
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: $WIDTH, height: $HEIGHT });
  await page.goto('file://$(pwd)/ad-video.html');
  
  const totalFrames = $TOTAL_FRAMES;
  const fps = $FPS;
  
  for (let i = 0; i < totalFrames; i++) {
    const time = i / fps;
    // Set CSS animation time
    await page.evaluate((t) => {
      document.querySelectorAll('*').forEach(el => {
        el.style.animationPlayState = 'paused';
        el.style.animationDelay = '0s';
        el.style.animationDuration = '0s';
      });
      // Manually advance animations by setting document time
      document.documentElement.style.setProperty('--ad-time', t + 's');
    }, time);
    
    await page.screenshot({
      path: '$FRAMES_DIR/frame_' + String(i).padStart(4, '0') + '.png',
      clip: { x: 0, y: 0, width: $WIDTH, height: $HEIGHT }
    });
    
    if (i % 30 === 0) process.stdout.write('Frame ' + i + '/' + totalFrames + ' (' + Math.round(i/totalFrames*100) + '%)\n');
  }
  
  await browser.close();
  console.log('Done capturing frames!');
})();
" 2>&1 || echo "Puppeteer failed, trying direct Chrome..."
  fi
fi

if [ -n "$CHROME" ]; then
  echo "Using Chrome: $CHROME"
  
  # Method: Use Chrome DevTools Protocol to capture frames
  python3 << 'PYEOF'
import subprocess, time, os, json, websocket, base64, threading

WIDTH = 1080
HEIGHT = 1920
FPS = 30
DURATION = 10
TOTAL_FRAMES = FPS * DURATION
FRAMES_DIR = "./frames"
CHROME = os.environ.get("CHROME_PATH", "/usr/bin/chromium-browser")

# Launch Chrome with remote debugging
chrome_proc = subprocess.Popen([
    CHROME,
    f"--window-size={WIDTH},{HEIGHT}",
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--remote-debugging-port=9222",
    f"file://{os.path.abspath('ad-video.html')}"
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

time.sleep(3)  # Wait for Chrome to start

# Get WebSocket URL
import urllib.request
tabs = json.loads(urllib.request.urlopen("http://localhost:9222/json").read())
ws_url = tabs[0]["webSocketDebuggerUrl"]

ws = websocket.create_connection(ws_url)
msg_id = 0

def send_cmd(method, params=None):
    global msg_id
    msg_id += 1
    cmd = {"id": msg_id, "method": method}
    if params:
        cmd["params"] = params
    ws.send(json.dumps(cmd))
    while True:
        resp = json.loads(ws.recv())
        if resp.get("id") == msg_id:
            return resp
        # Skip events

# Set viewport
send_cmd("Emulation.setDeviceMetricsOverride", {
    "width": WIDTH, "height": HEIGHT, "deviceScaleFactor": 1, "mobile": True
})

# Capture frames by advancing CSS animations
for frame in range(TOTAL_FRAMES):
    t = frame / FPS
    
    # Pause all animations and set their time
    send_cmd("Runtime.evaluate", {
        "expression": f"""
        (function() {{
          const allElements = document.querySelectorAll('*');
          allElements.forEach(el => {{
            el.style.animationPlayState = 'paused';
          }});
          // Set document timeline
          document.timeline.currentTime = {t * 1000};
        }})();
        """
    })
    
    # Take screenshot
    result = send_cmd("Page.captureScreenshot", {"format": "png"})
    img_data = base64.b64decode(result["result"]["data"])
    
    frame_path = f"{FRAMES_DIR}/frame_{frame:04d}.png"
    with open(frame_path, "wb") as f:
        f.write(img_data)
    
    if frame % 30 == 0:
        print(f"Frame {frame}/{TOTAL_FRAMES} ({frame*100//TOTAL_FRAMES}%)")

ws.close()
chrome_proc.terminate()
print("Done capturing frames!")
PYEOF
fi

# Step 2: Encode frames to MP4 with ffmpeg
echo ""
echo "🎬 Step 2: Encoding MP4..."
ffmpeg -y \
  -framerate $FPS \
  -i "$FRAMES_DIR/frame_%04d.png" \
  -c:v libx264 \
  -preset slow \
  -crf 18 \
  -pix_fmt yuv420p \
  -vf "scale=${WIDTH}:${HEIGHT}" \
  -movflags +faststart \
  "$OUTPUT" 2>/dev/null

echo ""
echo "✅ Ad video rendered!"
echo "📁 Output: $OUTPUT"
echo "📐 Size: ${WIDTH}x${HEIGHT} @ ${FPS}fps, ${DURATION}s"
echo ""

# Get file size
ls -lh "$OUTPUT" 2>/dev/null

# Cleanup
rm -rf "$FRAMES_DIR"
echo "🧹 Cleaned up frames"
