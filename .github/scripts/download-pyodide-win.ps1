# Pode ser executado com: pwsh scripts/download-pyodide-win.sh
$PYODIDE_URL = "https://firebasestorage.googleapis.com/v0/b/automations-pedroaba-tech.firebasestorage.app/o/pyodide.zip?alt=media&token=81a45b45-965c-4963-854a-87ab9f581953"
$TARGET_DIR = "src/renderer/public/pyodide"

Write-Host "Removendo diretório antigo, se existir..."
Remove-Item -Recurse -Force $TARGET_DIR -ErrorAction Ignore

Write-Host "Criando diretório alvo..."
New-Item -ItemType Directory -Force -Path $TARGET_DIR | Out-Null

Write-Host "Baixando Pyodide..."
Invoke-WebRequest -Uri $PYODIDE_URL -OutFile pyodide.zip

Write-Host "Extraindo..."
Expand-Archive -Path pyodide.zip -DestinationPath $TARGET_DIR

Remove-Item pyodide.zip

Write-Host "Pyodide baixado e extraído em $TARGET_DIR"
