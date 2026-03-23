# 📧 Intégration Formulaire de Contact - Solution WordPress

## 🎯 Solution Choisie: WordPress REST API + Contact Form 7

### Pourquoi cette approche?

✅ **Centralisé** - Tous vos leads dans WordPress
✅ **Gratuit** - Pas de service externe payant
✅ **Flexible** - Personnalisation totale
✅ **Notifications** - Emails automatiques WP
✅ **Stockage** - Base de données WordPress

---

## 📝 Étape 1: Configurer WordPress (10 min)

### 1.1 Installer Contact Form 7

1. Connexion: https://wp.amenagement-labo.fr/wp-admin
2. Extensions → Ajouter
3. Rechercher "Contact Form 7"
4. Installer + Activer

### 1.2 Créer le Formulaire

1. Contact → Ajouter
2. Nom: **"Formulaire Devis Laboratoire"**
3. Champs (remplacer le contenu par):

```html
<label> Prénom & Nom (obligatoire)
    [text* your-name] </label>

<label> Email (obligatoire)
    [email* your-email] </label>

<label> Téléphone
    [tel your-phone] </label>

<label> Société
    [text your-company] </label>

<label> Type de projet
    [select your-project "Création laboratoire" "Rénovation" "Extension" "Équipement seulement" "Maintenance"] </label>

<label> Surface approximative (m²)
    [number your-surface min:10 max:10000] </label>

<label> Message
    [textarea your-message] </label>

[acceptance consent] J'accepte que mes données soient traitées conformément à la <a href="/politique-confidentialite" target="_blank">politique de confidentialité</a>.

[submit "Envoyer ma demande"]
```

4. **Sauvegarder**
5. **Copier l'ID du formulaire** (ex: `123`)

### 1.3 Activer l'API REST

Contact Form 7 v5.4+ a l'API activée par défaut. Vérifiez:

**URL de test:**
```
https://wp.amenagement-labo.fr/wp-json/contact-form-7/v1/contact-forms
```

Si ça affiche du JSON → ✅ C'est bon!

---

## 💻 Étape 2: Intégrer dans Astro

### 2.1 Créer le Client API

Créez `/src/lib/contact-api.ts`:

```typescript
const WP_API_URL = 'https://wp.amenagement-labo.fr/wp-json/contact-form-7/v1';
const FORM_ID = '123'; // Remplacer par votre ID

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  project?: string;
  surface?: number;
  message: string;
}) {
  const formData = new FormData();
  formData.append('your-name', data.name);
  formData.append('your-email', data.email);
  if (data.phone) formData.append('your-phone', data.phone);
  if (data.company) formData.append('your-company', data.company);
  if (data.project) formData.append('your-project', data.project);
  if (data.surface) formData.append('your-surface', data.surface.toString());
  formData.append('your-message', data.message);

  try {
    const response = await fetch(
      `${WP_API_URL}/contact-forms/${FORM_ID}/feedback`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    if (result.status === 'mail_sent') {
      return { success: true, message: result.message };
    } else {
      return { success: false, error: result.message };
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return { success: false, error: 'Erreur de connexion' };
  }
}
```

### 2.2 Créer le Composant Astro

Créez `/src/components/ContactFormWP.astro`:

```astro
---
// Pas de props, juste le composant
---

<div class="md:w-2/3 p-12">
  <h3 class="font-heading text-3xl text-primary mb-8">Parlez-nous de votre projet</h3>

  <form id="contactForm" class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="flex flex-col">
      <label class="text-sm font-bold text-neutral-500 mb-2">Prénom & Nom *</label>
      <input name="name" type="text" required
        class="p-4 bg-bg-alt border border-neutral-200 focus:border-secondary outline-none transition-all rounded" />
    </div>

    <div class="flex flex-col">
      <label class="text-sm font-bold text-neutral-500 mb-2">Email *</label>
      <input name="email" type="email" required
        class="p-4 bg-bg-alt border border-neutral-200 focus:border-secondary outline-none transition-all rounded" />
    </div>

    <div class="flex flex-col">
      <label class="text-sm font-bold text-neutral-500 mb-2">Téléphone</label>
      <input name="phone" type="tel"
        class="p-4 bg-bg-alt border border-neutral-200 focus:border-secondary outline-none transition-all rounded" />
    </div>

    <div class="flex flex-col">
      <label class="text-sm font-bold text-neutral-500 mb-2">Société</label>
      <input name="company" type="text"
        class="p-4 bg-bg-alt border border-neutral-200 focus:border-secondary outline-none transition-all rounded" />
    </div>

    <div class="flex flex-col">
      <label class="text-sm font-bold text-neutral-500 mb-2">Type de projet</label>
      <select name="project"
        class="p-4 bg-bg-alt border border-neutral-200 focus:border-secondary outline-none transition-all rounded">
        <option value="">Sélectionnez...</option>
        <option value="Création laboratoire">Création laboratoire</option>
        <option value="Rénovation">Rénovation</option>
        <option value="Extension">Extension</option>
        <option value="Équipement seulement">Équipement seulement</option>
        <option value="Maintenance">Maintenance</option>
      </select>
    </div>

    <div class="flex flex-col">
      <label class="text-sm font-bold text-neutral-500 mb-2">Surface (m²)</label>
      <input name="surface" type="number" min="10" max="10000"
        class="p-4 bg-bg-alt border border-neutral-200 focus:border-secondary outline-none transition-all rounded" />
    </div>

    <div class="md:col-span-2 flex flex-col">
      <label class="text-sm font-bold text-neutral-500 mb-2">Message *</label>
      <textarea name="message" required rows="4"
        class="p-4 bg-bg-alt border border-neutral-200 focus:border-secondary outline-none transition-all rounded resize-none"></textarea>
    </div>

    <div class="md:col-span-2 flex items-center gap-3">
      <input type="checkbox" id="consent" name="consent" required class="w-5 h-5 accent-secondary" />
      <label for="consent" class="text-xs text-neutral-500">
        J'accepte que mes données soient traitées conformément à la
        <a href="/politique-confidentialite" class="text-secondary underline">politique de confidentialité</a>.
      </label>
    </div>

    <div class="md:col-span-2">
      <button type="submit" id="submitBtn"
        class="w-full py-5 bg-gradient-to-r from-secondary to-[#A68B56] text-white font-bold text-lg
        hover:brightness-110 transition-all rounded shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
        Envoyer ma demande de devis
      </button>
    </div>

    <div id="formMessage" class="md:col-span-2 hidden p-4 rounded"></div>
  </form>
</div>

<script>
  import { submitContactForm } from '../lib/contact-api';

  const form = document.getElementById('contactForm') as HTMLFormElement;
  const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
  const messageDiv = document.getElementById('formMessage') as HTMLDivElement;

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable submit
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';
    messageDiv.classList.add('hidden');

    // Get form data
    const formData = new FormData(form);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || undefined,
      company: formData.get('company') as string || undefined,
      project: formData.get('project') as string || undefined,
      surface: formData.get('surface') ? Number(formData.get('surface')) : undefined,
      message: formData.get('message') as string,
    };

    // Submit
    const result = await submitContactForm(data);

    // Show result
    messageDiv.classList.remove('hidden');
    if (result.success) {
      messageDiv.className = 'md:col-span-2 p-4 rounded bg-green-100 border border-green-300 text-green-800';
      messageDiv.textContent = '✅ Merci! Votre demande a été envoyée. Nous vous répondrons sous 48h.';
      form.reset();
    } else {
      messageDiv.className = 'md:col-span-2 p-4 rounded bg-red-100 border border-red-300 text-red-800';
      messageDiv.textContent = `❌ ${result.error || 'Une erreur est survenue. Veuillez réessayer.'}`;
    }

    // Re-enable submit
    submitBtn.disabled = false;
    submitBtn.textContent = 'Envoyer ma demande de devis';
  });
</script>
```

### 2.3 Utiliser dans contact-devis.astro

Remplacez la section `<!-- Form Column -->` par:

```astro
import ContactFormWP from '../components/ContactFormWP.astro';

<!-- ... -->

<ContactFormWP />
```

---

## 🧪 Étape 3: Tester

1. **Rebuild:**
   ```bash
   npm run dev
   ```

2. **Accéder:**
   http://localhost:4321/contact-devis

3. **Tester le formulaire:**
   - Remplir tous les champs
   - Soumettre
   - Vérifier que vous recevez un email (configuré dans WP)

4. **Vérifier dans WordPress:**
   - Contact → Contact Forms
   - Cliquez sur votre formulaire
   - Onglet "Messages stockés" (si plugin Flamingo installé)

---

## 🔒 Étape 4: Sécurité & Production

### 4.1 Ajouter un Honeypot (anti-spam)

Dans le formulaire WP, ajoutez:
```
[text* website class:hidden]
```

Puis dans `contact-api.ts`, si `website` est rempli → rejeter (c'est un bot).

### 4.2 Rate Limiting

Installez un plugin WP comme:
- **WP Armour** (gratuit)
- **Limit Login Attempts Reloaded**

### 4.3 HTTPS

Vérifiez que votre WordPress est bien en HTTPS:
```
https://wp.amenagement-labo.fr/wp-admin
```

---

## 🎨 Bonus: Customisation

### Emails WordPress

Contact Form 7 → Votre formulaire → Onglet "Mail"

**Personnalisez:**
- **Destinataire:** `contact@amenagement-labo.fr`
- **Sujet:** `[Nouveau Devis] [your-name] - [your-project]`
- **Corps:**
```
Nouvelle demande de devis depuis amenagement-labo.fr

Nom: [your-name]
Email: [your-email]
Téléphone: [your-phone]
Société: [your-company]
Type: [your-project]
Surface: [your-surface] m²

Message:
[your-message]

---
Envoyé depuis: https://amenagement-labo.fr/contact-devis
```

### Auto-répondeur

Onglet "Mail (2)" → Cocher "Activer"

**Sujet:** `Confirmation de votre demande - Aménagement Labo`
**Corps:**
```
Bonjour [your-name],

Merci pour votre demande de devis concernant votre projet de [your-project].

Nous avons bien reçu votre message et notre équipe va l'étudier dans les plus brefs délais.
Vous recevrez une réponse personnalisée sous 48h maximum.

Cordialement,
L'équipe Aptik Solutions

---
Ce message est automatique, merci de ne pas y répondre.
Pour toute question: contact@amenagement-labo.fr
```

---

## 🚀 Déploiement

1. **Build:**
   ```bash
   ./deploy.sh
   ```

2. **Upload sur o2switch:**
   - Uploadez `site-deploy.zip`
   - Extrayez dans `/public_html/`

3. **Test en production:**
   - https://amenagement-labo.fr/contact-devis
   - Soumettez un test
   - Vérifiez réception email

---

## 🆘 Troubleshooting

### Erreur CORS

Si l'API WordPress bloque:

**Ajouter dans wp-config.php:**
```php
header('Access-Control-Allow-Origin: https://amenagement-labo.fr');
header('Access-Control-Allow-Methods: POST');
```

### Emails non reçus

1. Installer **WP Mail SMTP** (plugin)
2. Configurer avec Gmail/SMTP o2switch
3. Tester l'envoi

### Form ID introuvable

Dans WP Admin → Contact → Votre formulaire
L'ID est dans l'URL: `...post.php?post=123&action=edit`

---

## ✅ Checklist Finale

- [ ] Contact Form 7 installé sur WordPress
- [ ] Formulaire "Devis Laboratoire" créé
- [ ] ID du formulaire copié
- [ ] API REST testée (`/wp-json/contact-form-7/v1/contact-forms`)
- [ ] `/src/lib/contact-api.ts` créé avec bon ID
- [ ] `/src/components/ContactFormWP.astro` créé
- [ ] Importé dans `contact-devis.astro`
- [ ] Test en local réussi
- [ ] Emails reçus correctement
- [ ] Déployé en production
- [ ] Test en production réussi

Votre formulaire est opérationnel! 🎉
