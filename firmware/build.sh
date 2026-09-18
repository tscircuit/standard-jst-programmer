#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "$0")/.." && pwd)"
firmware_work="$repo_root/work/firmware"
mkdir -p "$firmware_work"
if [ ! -d "$firmware_work/debugprobe/.git" ]; then
  git clone https://github.com/raspberrypi/debugprobe.git "$firmware_work/debugprobe"
fi
git -C "$firmware_work/debugprobe" checkout 3fff5b240ca8200c7ad538cb61c02dfc39bda831
git -C "$firmware_work/debugprobe" submodule update --init --recursive
if [ ! -d "$firmware_work/pico-sdk/.git" ]; then
  git clone https://github.com/raspberrypi/pico-sdk.git "$firmware_work/pico-sdk"
fi
git -C "$firmware_work/pico-sdk" checkout a1438dff1d38bd9c65dbd693f0e5db4b9ae91779
git -C "$firmware_work/pico-sdk" submodule update --init --recursive
cp "$repo_root/firmware/board_standard_jst_config.h" "$firmware_work/debugprobe/include/board_standard_jst_config.h"
python3 - "$firmware_work/debugprobe" <<'PY'
from pathlib import Path
import sys
p = Path(sys.argv[1]) / 'src/probe_config.h'
s = p.read_text()
s = s.replace('#include "board_debug_probe_config.h"', '#include "board_standard_jst_config.h"')
p.write_text(s)
# Disable the probe-side reset pull-up; the board has a pull-up to TARGET_V3_3.
# This avoids sourcing 3.3 V into the target reset when its own supply is absent.
p = Path(sys.argv[1]) / 'src/probe.pio'
p.write_text(p.read_text().replace('gpio_pull_up(PROBE_PIN_RESET);', 'gpio_disable_pulls(PROBE_PIN_RESET);'))
PY
cmake -S "$firmware_work/debugprobe" -B "$firmware_work/build" \
  -DPICO_SDK_PATH="$firmware_work/pico-sdk" \
  -DPICO_BOARD=waveshare_rp2040_zero \
  -DDEBUG_ON_PICO=OFF -DCMAKE_BUILD_TYPE=Release
cmake --build "$firmware_work/build" --parallel 4
mkdir -p "$repo_root/dist/firmware"
cp "$firmware_work/build/debugprobe.uf2" "$repo_root/dist/firmware/standard-jst-programmer.uf2"
