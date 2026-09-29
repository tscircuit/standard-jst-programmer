#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "$0")/.." && pwd)"
: "${SBW_USB_VID:?Set an authorized USB VID (CI test ID is not a release allocation)}"
: "${SBW_USB_PID:?Set an authorized USB PID}"
sdk="$repo_root/work/firmware/pico-sdk"
# Share the SDK pinned by the existing SWD build.
if [ ! -d "$sdk/.git" ]; then git clone https://github.com/raspberrypi/pico-sdk.git "$sdk"; fi
git -C "$sdk" checkout 079c6f39023649b154152db30f1d781e884879bc
git -C "$sdk" submodule update --init --recursive
cmake -S "$repo_root/firmware/sbw" -B "$repo_root/work/firmware/build-sbw" \
  -DPICO_SDK_PATH="$sdk" -DPICO_BOARD=standard_jst_programmer \
  -DPICO_BOARD_HEADER_DIRS="$repo_root/firmware" -DCMAKE_BUILD_TYPE=Release \
  -DSBW_USB_VID="$SBW_USB_VID" -DSBW_USB_PID="$SBW_USB_PID"
cmake --build "$repo_root/work/firmware/build-sbw" --parallel 4
mkdir -p "$repo_root/dist/firmware"
cp "$repo_root/work/firmware/build-sbw/standard-jst-sbw.uf2" "$repo_root/dist/firmware/standard-jst-programmer-sbw.uf2"
