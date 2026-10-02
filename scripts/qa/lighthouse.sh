#!/bin/bash
# Lighthouse do build de produção (rode `npm run build && npx next start -p 3200` antes).
# Uso: scripts/qa/lighthouse.sh <url> <saida.json> [desktop]
# Usa o Chromium do Playwright se existir; senão, o Chrome do sistema.
pw=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux*/chrome 2>/dev/null | tail -1)
[ -n "$pw" ] && export CHROME_PATH="$pw"
extra=""
[ "$3" = "desktop" ] && extra="--preset=desktop"
npx -y lighthouse@12 "$1" --quiet $extra --chrome-flags="--headless=new --no-sandbox" \
  --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="$2" >/dev/null 2>&1
node -e 'const r=require(require("path").resolve(process.argv[1]));const c=r.categories;const a=r.audits;console.log(Object.keys(c).map(k=>k.slice(0,4)+"="+Math.round(c[k].score*100)).join(" "), "| FCP",a["first-contentful-paint"].displayValue,"LCP",a["largest-contentful-paint"].displayValue,"TBT",a["total-blocking-time"].displayValue,"CLS",a["cumulative-layout-shift"].displayValue)' "$2"
