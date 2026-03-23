# 🚀 Configuration WordPress - Checklist Rapide

## ✅ Ce qui est fait (côté Astro)

- ✅ Composant formulaire créé (`ContactFormWP.astro`)
- ✅ Client API WordPress créé (`contact-api.ts`)
- ✅ Formulaire intégré dans `/contact-devis`
- ✅ Design responsive avec messages succès/erreur
- ✅ Validation côté client
- ✅ Build testé et fonctionnel

## 🔧 Ce qu'il reste à faire (côté WordPress)

### Étape 1: Installer Contact Form 7 (2 min)

1. Connexion: **https://wp.amenagement-labo.fr/wp-admin**
2. **Extensions** → **Ajouter**
3. Rechercher: **"Contact Form 7"**
4. **Installer** + **Activer**

---

### Étape 2: Créer le Formulaire (5 min)

1. **Contact** → **Ajouter**

2. **Nom du formulaire:** `Formulaire Devis Laboratoire`

3. **Remplacer tout le contenu par:**

```html
<label> Prénom & Nom (obligatoire)
    [text* your-name placeholder "Jean Dupont"] </label>

<label> Email (obligatoire)
    [email* your-email placeholder "jean.dupont@entreprise.fr"] </label>

<label> Téléphone
    [tel your-phone placeholder "06 12 34 56 78"] </label>

<label> Société
    [text your-company placeholder "Nom de votre société"] </label>

<label> Type de projet
    [select your-project include_blank "Création laboratoire" "Rénovation" "Extension" "Équipement seulement" "Maintenance"] </label>

<label> Surface approximative (m²)
    [number your-surface min:10 max:10000 placeholder "100"] </label>

<label> Décrivez votre projet (obligatoire)
    [textarea* your-message placeholder "Décrivez brièvement votre projet, vos besoins spécifiques et votre calendrier..."] </label>

[acceptance consent] J'accepte que mes données soient traitées conformément à la <a href="https://amenagement-labo.fr/politique-confidentialite" target="_blank">politique de confidentialité</a>.

[submit "Envoyer ma demande"]
```

4. **Sauvegarder**

5. **IMPORTANT:** Copier l'**ID du formulaire**
   - L'ID apparaît en haut: `Vous modifiez le formulaire de contact 123`
   - OU dans l'URL: `...post.php?post=123&action=edit`

---

### Étape 3: Configurer les Emails (3 min)

#### Onglet "Mail"

**Destinataire:**
```
contact@amenagement-labo.fr
```

**Expéditeur:**
```
[your-name] <noreply@amenagement-labo.fr>
```

**Sujet:**
```
[Nouveau Devis] [your-name] - [your-project]
```

**Corps du message:**
```
Nouvelle demande de devis depuis amenagement-labo.fr

─────────────────────────────────
INFORMATIONS CLIENT
─────────────────────────────────
Nom: [your-name]
Email: [your-email]
Téléphone: [your-phone]
Société: [your-company]

─────────────────────────────────
PROJET
─────────────────────────────────
Type: [your-project]
Surface: [your-surface] m²

Message:
[your-message]

─────────────────────────────────
Envoyé le: [_date] à [_time]
Depuis: https://amenagement-labo.fr/contact-devis
IP: [_remote_ip]
```

#### Onglet "Mail (2)" - Auto-répondeur

**☑️ Cocher "Activer"**

**Destinataire:**
```
[your-email]
```

**Expéditeur:**
```
Aménagement Labo <contact@amenagement-labo.fr>
```

**Sujet:**
```
Confirmation de votre demande - Aménagement Labo
```

**Corps:**
```
Bonjour [your-name],

Merci pour votre demande de devis concernant votre projet de [your-project].

Nous avons bien reçu votre message et notre équipe va l'étudier dans les plus brefs délais.

Vous recevrez une réponse personnalisée sous 48h maximum de la part de l'un de nos experts en aménagement de laboratoires.

En attendant, n'hésitez pas à consulter nos réalisations :
https://amenagement-labo.fr/projets-realisations

Cordialement,
L'équipe Aptik Solutions

───────────────────────────────
VOTRE DEMANDE (rappel)
───────────────────────────────
Type de projet: [your-project]
Surface: [your-surface] m²
Message: [your-message]

───────────────────────────────
📧 contact@amenagement-labo.fr
🌐 https://amenagement-labo.fr

Ce message est automatique, merci de ne pas y répondre directement.
```

**Sauvegarder**

---

### Étape 4: Mettre à Jour le Code Astro (1 min)

**Ouvrir:** `/src/lib/contact-api.ts`

**Ligne 10, remplacer:**
```typescript
const FORM_ID = '123'; // ← Remplacer par votre ID réel
```

**Par (exemple si ID = 456):**
```typescript
const FORM_ID = '456';
```

---

### Étape 5: Tester l'API WordPress (30 sec)

**Ouvrir dans le navigateur:**
```
https://wp.amenagement-labo.fr/wp-json/contact-form-7/v1/contact-forms
```

**Vous devez voir du JSON comme:**
```json
[
  {
    "id": 123,
    "slug": "formulaire-devis-laboratoire",
    "title": "Formulaire Devis Laboratoire",
    ...
  }
]
```

✅ Si ça affiche du JSON → L'API fonctionne!
❌ Si erreur 404 → Contact Form 7 n'est pas activé

---

### Étape 6: Rebuild & Deploy (2 min)

```bash
cd /Users/anthonyrusso/amenagement-labo/amenagement-labo-fr

# 1. Rebuild avec le bon FORM_ID
npm run build

# 2. Créer le zip de déploiement
./deploy.sh

# 3. Uploader site-deploy.zip sur o2switch
# 4. Extraire dans /public_html/
```

---

### Étape 7: Test Final (1 min)

1. **Aller sur:** https://amenagement-labo.fr/contact-devis

2. **Remplir le formulaire** avec vos vraies infos

3. **Soumettre**

4. **Vérifier:**
   - ✅ Message de confirmation affiché
   - ✅ Email reçu sur `contact@amenagement-labo.fr`
   - ✅ Auto-répondeur reçu
   - ✅ Formulaire dans WP Admin → Contact → Soumissions

---

## 🔒 Bonus Sécurité (Recommandé)

### Anti-Spam: Honeypot

Dans votre formulaire WP, ajouter **avant** le bouton submit:

```html
[text* website class:hidden]
```

Puis dans `contact-api.ts`, ajouter après ligne 27:

```typescript
// Honeypot anti-spam
formData.append('website', '');
```

Les bots rempliront ce champ → CF7 rejettera automatiquement.

### Limite de Soumissions

Installer: **WP Armour - Honeypot Anti Spam**
- Gratuit
- Bloque les soumissions multiples rapides
- Anti-spam intelligent

---

## ❓ Troubleshooting

### "Erreur de connexion" dans le formulaire

**Problème:** L'API WordPress n'est pas accessible

**Solutions:**
1. Vérifier que CF7 est bien activé
2. Tester l'URL: `https://wp.amenagement-labo.fr/wp-json/contact-form-7/v1/contact-forms`
3. Vérifier qu'il n'y a pas de plugin de sécurité bloquant l'API REST

### "Invalid form ID"

**Problème:** Le FORM_ID dans `contact-api.ts` est incorrect

**Solution:**
1. WP Admin → Contact → Votre formulaire
2. Noter l'ID dans l'URL
3. Mettre à jour `contact-api.ts` ligne 10
4. Rebuild + redeploy

### Emails non reçus

**Problème:** Configuration SMTP de WordPress

**Solution:**
1. Installer **WP Mail SMTP**
2. Configurer avec Gmail ou SMTP o2switch
3. Envoyer un email de test
4. Vérifier les spams

### Erreur CORS

**Problème:** Le navigateur bloque les requêtes cross-origin

**Solution:** Ajouter dans `wp-config.php`:
```php
header('Access-Control-Allow-Origin: https://amenagement-labo.fr');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

---

## ✅ Checklist Complète

- [ ] Contact Form 7 installé
- [ ] Formulaire "Devis Laboratoire" créé
- [ ] ID du formulaire noté: `___`
- [ ] Emails configurés (Mail + Mail 2)
- [ ] API REST testée (JSON visible)
- [ ] `contact-api.ts` mis à jour avec le bon ID
- [ ] Build + deploy effectué
- [ ] Test de soumission réussi
- [ ] Email reçu
- [ ] Auto-répondeur reçu

🎉 **Votre formulaire est opérationnel!**

---

## 📞 Support

Si problème persistant après ces étapes:

1. Vérifier les logs WP: **Outils** → **Santé du site**
2. Tester avec un autre email
3. Désactiver temporairement les plugins de sécurité
4. Contacter le support o2switch pour vérifier la config SMTP
