#!/bin/bash

echo "🚀 Déploiement automatique d'Aménagement Labo"
echo "=============================================="
echo ""

# 1. Récupérer les derniers changements
echo "📥 [1/4] Récupération des changements depuis GitHub..."
git pull origin main
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du pull"
    exit 1
fi
echo "✅ Changements récupérés"
echo ""

# 2. Installer/mettre à jour les dépendances
echo "📦 [2/4] Vérification des dépendances..."
npm install
echo "✅ Dépendances OK"
echo ""

# 3. Compiler le site
echo "🔨 [3/4] Compilation du site..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la compilation"
    exit 1
fi
echo "✅ Site compilé"
echo ""

# 4. Créer le zip de déploiement
echo "📦 [4/4] Création du fichier de déploiement..."
cd dist
rm -f ../site-deploy.zip
zip -r ../site-deploy.zip . > /dev/null
cd ..
echo "✅ site-deploy.zip créé ($(du -h site-deploy.zip | cut -f1))"
echo ""

echo "════════════════════════════════════════════"
echo "✅ Déploiement prêt!"
echo ""
echo "📌 Prochaines étapes:"
echo "   1. Le fichier site-deploy.zip est prêt"
echo "   2. Connectez-vous à o2switch"
echo "   3. Supprimez tout dans /public_html/"
echo "   4. Uploadez site-deploy.zip"
echo "   5. Dézippez dans /public_html/"
echo ""
echo "🌐 Votre site sera en ligne sur amenagement-labo.fr"
echo "════════════════════════════════════════════"
