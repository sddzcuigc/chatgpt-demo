#!/usr/bin/env sh
set -eu

IMAGE_NAME="chatgpt-demo-node24-proof"

printf '%s\n' "[node24-proof] building ${IMAGE_NAME}"
docker build -f Dockerfile.node24 -t "${IMAGE_NAME}" .

printf '%s\n' "[node24-proof] running isolated Node 24 verification"
docker run --rm "${IMAGE_NAME}"

printf '%s\n' "[node24-proof] PASS"
