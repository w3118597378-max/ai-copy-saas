#!/bin/bash
set -e

# Add env vars to admin project (already linked in root)
echo "=== Adding env vars to ai-copy-admin ==="
cd "F:/ai business/ai-copy-saas"
echo "https://ai-copy-q5iqzncni-lunas-projects-79d821ca.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production --yes 2>&1
echo "https://ai-copy-admin-pdx6ow65t-lunas-projects-79d821ca.vercel.app" | vercel env add NEXT_PUBLIC_ADMIN_URL production --yes 2>&1

# Link and add to www project
echo ""
echo "=== Linking and adding env vars to ai-copy-www ==="
cd "F:/ai business/ai-copy-saas/apps/www"
vercel link --yes --project ai-copy-www --scope lunas-projects-79d821ca 2>&1
echo "https://ai-copy-q5iqzncni-lunas-projects-79d821ca.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production --yes 2>&1
echo "https://ai-copy-admin-pdx6ow65t-lunas-projects-79d821ca.vercel.app" | vercel env add NEXT_PUBLIC_ADMIN_URL production --yes 2>&1

echo ""
echo "=== All env vars added! ==="
