# 🔍 Guide d'Indexation Google - Aménagement Labo

## ⚠️ Problème Actuel

Votre site n'est PAS indexé sur Google parce que:
1. ❌ Mauvais fichiers uploadés (sources au lieu du site compilé)
2. ❌ Sitemap pas accessible
3. ❌ Site pas soumis à Google Search Console

## ✅ Solution Complète (30 minutes)

### ÉTAPE 1: Déployer le BON site (10 min)

#### Sur Mac:
Le fichier `site-deploy.zip` est PRÊT (il contient sitemap + robots.txt)

#### Sur o2switch:

1. **Connexion FileManager**
   - Allez sur votre espace o2switch
   - Ouvrez le FileManager/Gestionnaire de fichiers

2. **Nettoyer /public_html/**
   ```
   ⚠️ IMPORTANT: Sélectionnez TOUT dans /public_html/
   → Supprimer (Corbeille)
   ```

3. **Upload site-deploy.zip**
   - Uploadez `site-deploy.zip` dans `/public_html/`
   - Clic droit → **Extraire** (Extract)
   - ✅ Vérifiez que vous avez:
     ```
     /public_html/
     ├── index.html          ← À LA RACINE!
     ├── robots.txt
     ├── sitemap-index.xml
     ├── sitemap-0.xml
     ├── _astro/
     ├── blog/
     └── ...
     ```

4. **Vérifier l'accès**
   - Ouvrez: https://amenagement-labo.fr
   - Ouvrez: https://amenagement-labo.fr/robots.txt
   - Ouvrez: https://amenagement-labo.fr/sitemap-index.xml

   ✅ Tous doivent s'afficher correctement!

---

### ÉTAPE 2: Soumettre à Google Search Console (10 min)

#### 2.1 Créer un compte Google Search Console

1. Allez sur: https://search.google.com/search-console
2. Connectez-vous avec votre compte Google
3. Cliquez **Ajouter une propriété**
4. Choisissez **Domaine** ou **Préfixe d'URL**
   - Recommandé: **Préfixe d'URL** → `https://amenagement-labo.fr`

#### 2.2 Vérifier la propriété

**Option A: Balise HTML (Plus simple)**

Google vous donnera un code comme:
```html
<meta name="google-site-verification" content="ABC123...">
```

1. Copiez ce code
2. Je vais vous aider à l'ajouter dans le `<head>` du site
3. Redéployez
4. Cliquez "Vérifier" sur Google Search Console

**Option B: Fichier HTML**

1. Google vous donne un fichier `google123abc.html`
2. Uploadez-le à la racine de `/public_html/`
3. Vérifiez l'accès: `https://amenagement-labo.fr/google123abc.html`
4. Cliquez "Vérifier" sur Google Search Console

**Option C: DNS (Si vous gérez vos DNS)**

1. Google vous donne un enregistrement TXT
2. Ajoutez-le dans votre zone DNS chez o2switch
3. Attendez quelques minutes
4. Cliquez "Vérifier"

#### 2.3 Soumettre le sitemap

Une fois vérifié:

1. Dans Google Search Console, menu de gauche → **Sitemaps**
2. Champ "Ajouter un sitemap" → Entrez: `sitemap-index.xml`
3. Cliquez **Envoyer**

✅ Google va commencer à crawler votre site!

---

### ÉTAPE 3: Vérifications Post-Soumission (10 min)

#### 3.1 Tester le sitemap

Utilisez l'outil de test de Google:
- https://search.google.com/test/rich-results
- Entrez: `https://amenagement-labo.fr/sitemap-index.xml`

#### 3.2 Demander une indexation manuelle

Dans Google Search Console:

1. **Inspection d'URL** (en haut)
2. Entrez: `https://amenagement-labo.fr`
3. Cliquez **Demander une indexation**
4. Répétez pour vos pages importantes:
   - `/conception-laboratoires`
   - `/installation-equipements-techniques`
   - `/blog/securite-en-laboratoire...`

#### 3.3 Vérifier robots.txt

Dans Google Search Console → **Paramètres** → **Testeur de robots.txt**

Vérifiez que votre robots.txt est bien lu:
```
User-agent: *
Allow: /
Sitemap: https://amenagement-labo.fr/sitemap-index.xml
```

---

## 📊 Délais d'Indexation

| Étape | Délai |
|-------|-------|
| Soumission du sitemap | Immédiat |
| Premier crawl Google | 1-48 heures |
| Apparition dans résultats | 3-7 jours |
| Indexation complète | 1-4 semaines |

## 🔄 Maintenance Continue

### Quand vous ajoutez du contenu:

1. **Nouvel article WordPress** → Le sitemap se met à jour automatiquement au prochain build
2. **Nouvelle page** → Ajoutez dans `src/pages/` → rebuild
3. **Après chaque déploiement:**
   ```bash
   ./deploy.sh
   # Uploadez site-deploy.zip sur o2switch
   ```
4. **Google Search Console** → "Demander une indexation" pour la nouvelle page

### Vérifier l'indexation:

```
site:amenagement-labo.fr
```
Dans Google Search → Voir combien de pages sont indexées

---

## 🆘 Problèmes Courants

### ❌ "Sitemap introuvable"
→ Vérifiez: https://amenagement-labo.fr/sitemap-index.xml s'affiche

### ❌ "Erreur 404 robots.txt"
→ Vérifiez: https://amenagement-labo.fr/robots.txt s'affiche

### ❌ "URL non indexée"
→ Attendez 3-7 jours après soumission
→ Demandez indexation manuelle dans GSC

### ❌ "Sitemap contient 0 URL"
→ Vous avez uploadé les sources au lieu de dist/
→ Refaites ÉTAPE 1

---

## ✅ Checklist Finale

- [ ] Site-deploy.zip uploadé et extrait dans /public_html/
- [ ] https://amenagement-labo.fr affiche le site
- [ ] https://amenagement-labo.fr/robots.txt accessible
- [ ] https://amenagement-labo.fr/sitemap-index.xml accessible
- [ ] Compte Google Search Console créé
- [ ] Propriété vérifiée
- [ ] Sitemap soumis
- [ ] Indexation manuelle demandée pour homepage
- [ ] Test `site:amenagement-labo.fr` dans Google (peut prendre quelques jours)

---

## 📞 Besoin d'Aide?

Si après 7 jours vous n'êtes toujours pas indexé, vérifiez:
1. Google Search Console → **Couverture** → Erreurs?
2. **Paramètres** → **Testeur de robots.txt**
3. **Inspection d'URL** → État d'indexation

Le problème est souvent:
- Mauvaise structure de fichiers uploadés
- robots.txt qui bloque l'indexation
- Sitemap non accessible
