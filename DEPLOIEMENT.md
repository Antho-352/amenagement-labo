# 🚀 Guide de Déploiement - Aménagement Labo

## ⚡ Méthode Rapide (Recommandé)

```bash
cd /Users/anthonyrusso/amenagement-labo/amenagement-labo-fr
./deploy.sh
```

Le script fait automatiquement:
1. ✅ Récupère les changements depuis GitHub
2. ✅ Installe les dépendances si nécessaire
3. ✅ Compile le site
4. ✅ Crée `site-deploy.zip` prêt à uploader

## 📋 Workflow Complet

### 1. Modifier le site

**Option A: Sur GitHub**
- Allez sur https://github.com/Antho-352/amenagement-labo
- Éditez les fichiers directement (bouton ✏️)
- Commit sur `main`

**Option B: Localement sur Mac**
- Modifiez les fichiers dans `src/`
- `git add .`
- `git commit -m "description"`
- `git push origin main`

### 2. Déployer

**Sur Mac:**
```bash
./deploy.sh
```

**Sur o2switch:**
1. FileManager → `/public_html/`
2. **Supprimer TOUT** dans ce dossier
3. Upload `site-deploy.zip`
4. Clic droit → Extraire
5. Vérifier que `index.html` est à la racine

## 🖼️ Modifier les Images

Les images viennent de **WordPress** (`wp.amenagement-labo.fr`)

1. Connexion: https://wp.amenagement-labo.fr/wp-admin
2. Médiathèque → Modifier/Remplacer l'image
3. Relancer `./deploy.sh` pour regénérer le site

## 🎨 Modifier le Design

Les fichiers à éditer:

### Couleurs & Styles
- `src/styles/global.css` - CSS global
- `tailwind.config.mjs` - Configuration Tailwind

### Pages
- `src/pages/index.astro` - Page d'accueil
- `src/pages/contact-devis.astro` - Page contact
- etc.

### Composants
- `src/components/Header.astro` - En-tête
- `src/components/Footer.astro` - Pied de page
- `src/components/Hero.astro` - Bandeau principal

## 📝 Exemple Complet

```bash
# 1. Vous modifiez sur GitHub
# (éditez src/pages/index.astro)

# 2. Sur votre Mac
cd /Users/anthonyrusso/amenagement-labo/amenagement-labo-fr
./deploy.sh

# 3. Le script affiche "✅ site-deploy.zip créé"

# 4. Sur o2switch
# - Supprimer /public_html/*
# - Upload site-deploy.zip
# - Extraire

# 5. Site en ligne! 🎉
```

## ❓ Questions Fréquentes

**Q: Pourquoi le site n'apparaît pas après upload?**
R: Vérifiez que `index.html` est **directement** dans `/public_html/`, pas dans un sous-dossier.

**Q: Je veux ajouter une nouvelle page?**
R: Créez `src/pages/ma-page.astro` → elle sera accessible sur `/ma-page/`

**Q: Comment voir le site en local avant de déployer?**
R: `npm run dev` → ouvrez http://localhost:4321

**Q: Le WordPress et le site Astro sont liés?**
R: Oui! Le site Astro récupère les articles/images de WordPress via GraphQL.

## 🆘 Aide

En cas de problème, vérifiez:
1. `git status` - pas de modifications non commitées
2. `npm run build` - compile sans erreur
3. Structure du zip - `index.html` à la racine
