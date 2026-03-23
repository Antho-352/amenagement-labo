/**
 * WordPress Contact Form 7 API Client
 *
 * Soumet les formulaires de contact vers l'API REST de Contact Form 7
 * Documentation: https://contactform7.com/rest-api/
 */

const WP_API_URL = 'https://wp.amenagement-labo.fr/wp-json/contact-form-7/v1';

// TODO: Remplacer par l'ID réel du formulaire après création dans WordPress
// Pour trouver l'ID: WP Admin → Contact → Votre formulaire → L'ID est dans l'URL
const FORM_ID = '123';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  project?: string;
  surface?: number;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Soumet le formulaire de contact via l'API WordPress
 */
export async function submitContactForm(data: ContactFormData): Promise<ContactFormResponse> {
  const formData = new FormData();

  // Mapping des champs vers les noms Contact Form 7
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

    // Contact Form 7 renvoie status: 'mail_sent' en cas de succès
    if (result.status === 'mail_sent') {
      return {
        success: true,
        message: result.message || 'Votre message a été envoyé avec succès.',
      };
    } else {
      return {
        success: false,
        error: result.message || result.invalid_fields?.[0]?.message || 'Une erreur est survenue.',
      };
    }
  } catch (error) {
    console.error('Contact form submission error:', error);
    return {
      success: false,
      error: 'Erreur de connexion. Veuillez réessayer plus tard.',
    };
  }
}
