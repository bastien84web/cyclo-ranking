import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

// Helper pour envoyer un email de vérification
export async function sendVerificationEmail(
  email: string,
  token: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`
  
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@meilleures-cyclosportive.com',
      to: email,
      subject: 'Vérifiez votre adresse email - Cyclo Ranking',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .button {
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
              }
              .footer {
                text-align: center;
                color: #6b7280;
                font-size: 14px;
                margin-top: 30px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🚴‍♂️ Cyclo Ranking</h1>
            </div>
            <div class="content">
              <h2>Bienvenue sur Cyclo Ranking !</h2>
              <p>Merci de vous être inscrit. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
              
              <center>
                <a href="${verificationUrl}" class="button">Vérifier mon email</a>
              </center>
              
              <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              
              <p><strong>Ce lien expire dans 24 heures.</strong></p>
              
              <p>Si vous n'avez pas créé de compte sur Cyclo Ranking, vous pouvez ignorer cet email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Cyclo Ranking - Classement des meilleures cyclosportives</p>
            </div>
          </body>
        </html>
      `,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Error sending verification email:', error)
    return { success: false, error }
  }
}

// Helper pour envoyer un email de bienvenue
export async function sendWelcomeEmail(
  email: string,
  name: string
) {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@meilleures-cyclosportive.com',
      to: email,
      subject: 'Bienvenue sur Cyclo Ranking ! 🚴‍♂️',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .feature {
                background: white;
                padding: 15px;
                margin: 10px 0;
                border-radius: 5px;
                border-left: 4px solid #667eea;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🚴‍♂️ Bienvenue ${name} !</h1>
            </div>
            <div class="content">
              <p>Votre compte est maintenant actif. Vous pouvez profiter de toutes les fonctionnalités de Cyclo Ranking :</p>
              
              <div class="feature">
                <strong>📊 Consulter les classements</strong><br>
                Découvrez les cyclosportives les mieux notées par la communauté
              </div>
              
              <div class="feature">
                <strong>⭐ Voter et commenter</strong><br>
                Partagez votre expérience et aidez les autres cyclistes
              </div>
              
              <div class="feature">
                <strong>🗺️ Explorer la carte</strong><br>
                Trouvez les cyclosportives près de chez vous
              </div>
              
              <p style="margin-top: 30px;">
                <a href="${process.env.NEXTAUTH_URL}" style="color: #667eea; text-decoration: none; font-weight: bold;">
                  → Commencer à explorer
                </a>
              </p>
              
              <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                Bonne route ! 🚴‍♂️
              </p>
            </div>
          </body>
        </html>
      `,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error }
  }
}
