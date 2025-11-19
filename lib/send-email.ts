import { Resend } from 'resend'

// Lazy initialization pour éviter les erreurs de variables d'environnement
function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY non configuré dans les variables d\'environnement')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

export interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  replyTo?: string
}

/**
 * Envoie un email unitaire depuis contact@meilleures-cyclosportives.com
 */
export async function sendEmail(options: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY non configuré')
  }

  const emailData: any = {
    from: 'contact@meilleures-cyclosportives.com',
    to: options.to,
    subject: options.subject,
    ...(options.html && { html: options.html }),
    ...(options.text && { text: options.text }),
    ...(options.replyTo && { replyTo: options.replyTo }),
  }

  try {
    const resend = getResendClient()
    const result = await resend.emails.send(emailData)
    console.log('✅ Email envoyé:', result.data?.id)
    return result
  } catch (error) {
    console.error('❌ Erreur envoi email:', error)
    throw error
  }
}

/**
 * Template d'email simple avec le design Meilleures Cyclosportives
 */
export function createEmailTemplate(title: string, content: string, footer?: string) {
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🚴‍♂️ Meilleures Cyclosportives</h1>
      </div>
      
      <div style="padding: 40px 30px; background: #f8f9fa;">
        <h2 style="color: #333; margin-bottom: 20px;">${title}</h2>
        
        <div style="color: #666; font-size: 16px; line-height: 1.6;">
          ${content}
        </div>
        
        ${footer ? `
        <div style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
          <p style="margin: 0; color: #1976d2; font-size: 14px;">
            ${footer}
          </p>
        </div>
        ` : ''}
      </div>
      
      <div style="background: #333; padding: 20px; text-align: center;">
        <p style="color: #999; margin: 0; font-size: 14px;">
          © 2025 Meilleures Cyclosportives - Plateforme de classement des courses cyclosportives
        </p>
      </div>
    </div>
  `
}

/**
 * Exemples d'utilisation rapide
 */
export const emailTemplates = {
  // Email de bienvenue
  welcome: (name: string) => ({
    subject: `Bienvenue ${name} sur Meilleures Cyclosportives !`,
    html: createEmailTemplate(
      `Bienvenue ${name} !`,
      `
        <p>Merci de rejoindre notre communauté de passionnés de cyclosportives.</p>
        <p>Vous pouvez maintenant :</p>
        <ul>
          <li>Découvrir les meilleures courses</li>
          <li>Voter pour vos cyclosportives préférées</li>
          <li>Partager vos expériences</li>
        </ul>
      `,
      '🚴‍♂️ Bonne route et à bientôt sur les routes !'
    )
  }),

  // Email de notification
  notification: (title: string, message: string) => ({
    subject: `Notification - ${title}`,
    html: createEmailTemplate(title, `<p>${message}</p>`)
  }),

  // Email personnalisé simple
  simple: (title: string, content: string) => ({
    subject: title,
    html: createEmailTemplate(title, content)
  })
}
