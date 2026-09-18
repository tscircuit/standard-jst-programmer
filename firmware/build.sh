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
git -C "$firmware_work/pico-sdk" checkout 079c6f39023649b154152db30f1d781e884879bc
git -C "$firmware_work/pico-sdk" submodule update --init --recursive
cp "$repo_root/firmware/board_standard_jst_config.h" "$firmware_work/debugprobe/include/board_standard_jst_config.h"
python3 - "$firmware_work/debugprobe" <<'PY'
from pathlib import Path
import sys
p = Path(sys.argv[1]) / 'src/probe_config.h'
s = p.read_text()
s = s.replace('#include "board_debug_probe_config.h"', '#include "board_standard_jst_config.h"')
p.write_text(s)

PY
cmake -S "$firmware_work/debugprobe" -B "$firmware_work/build" \
  -DPICO_SDK_PATH="$firmware_work/pico-sdk" \
  -DPICO_BOARD=standard_jst_programmer \
  -DPICO_BOARD_HEADER_DIRS="$repo_root/firmware" \
  -DDEBUG_ON_PICO=OFF -DCMAKE_BUILD_TYPE=Release
cmake --build "$firmware_work/build" --parallel 4
mkdir -p "$repo_root/dist/firmware"
cp "$firmware_work/build/debugprobe.uf2" "$repo_root/dist/firmware/standard-jst-programmer.uf2"
