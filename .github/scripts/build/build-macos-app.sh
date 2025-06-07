#!/bin/bash
set -e

TAG_NAME="${GITHUB_REF_NAME}"  # Pega a tag do contexto do GitHub Actions
RELEASE_NAME="Release $TAG_NAME"
RELEASE_BODY="Build automático gerado via workflow."
REPO="pedroaba/queue-optimization-calculator"
ASSET_DIR="./dist"  # Altere se seu build gerar artefatos em outro lugar

# Verifica autenticação do GitHub CLI (opcional)
if ! gh auth status > /dev/null 2>&1; then
  echo "⚠️  GitHub CLI não está autenticado! Configure o GITHUB_TOKEN."
  exit 1
fi

# 1. Build do projeto
echo "🔧 Iniciando o build com pnpm..."
pnpm build:mac

# 2. Criação da release no GitHub (usa a tag já existente)
echo "🚀 Criando a release no GitHub (se não existir)..."
gh release create "$TAG_NAME" \
  --repo "$REPO" \
  --title "$RELEASE_NAME" \
  --notes "$RELEASE_BODY" \
  --latest \
  --verify-tag || echo "⚠️ Release já existe."

# 3. Upload dos arquivos de build para a release
echo "📤 Anexando arquivos de build à release..."
for file in "$ASSET_DIR"/*; do
  if [ -f "$file" ]; then
    echo "Anexando $file..."
    gh release upload "$TAG_NAME" "$file" --repo "$REPO" --clobber
  else
    echo "Pulando diretório $file"
  fi
done

echo "✅ Processo de build e release concluído com sucesso!"
