#!/bin/bash
set -e

PYODIDE_URL="https://firebasestorage.googleapis.com/v0/b/automations-pedroaba-tech.firebasestorage.app/o/pyodide.zip?alt=media&token=81a45b45-965c-4963-854a-87ab9f581953"
TARGET_DIR="src/renderer/public/pyodide"

# Limpa o destino
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

echo "Baixando Pyodide..."
curl -L "$PYODIDE_URL" -o pyodide.zip

echo "Extraindo..."
unzip -q pyodide.zip -d "$TARGET_DIR"
rm pyodide.zip

echo "Pyodide baixado e extraído em $TARGET_DIR"
