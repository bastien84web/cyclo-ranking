import nodemailer from 'nodemailer'

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false, // true pour 465, false pour autres ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER,
    to: email,
    subject: 'Vérifiez votre adresse email - Cyclo Ranking',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🚴‍♂️ Cyclo Ranking</h1>
        </div>
        
        <div style="padding: 40px 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Bienvenue sur Cyclo Ranking !</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Merci de vous être inscrit sur notre plateforme de classement des courses cyclosportives.
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Pour activer votre compte et commencer à voter pour vos cyclosportives préférées, 
            veuillez cliquer sur le bouton ci-dessous :
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold;
                      display: inline-block;">
              Vérifier mon email
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; line-height: 1.6;">
            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
            <a href="${verificationUrl}" style="color: #667eea;">${verificationUrl}</a>
          </p>
          
          <p style="color: #999; font-size: 14px; line-height: 1.6;">
            Ce lien expirera dans 24 heures pour des raisons de sécurité.
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: #999; margin: 0; font-size: 14px;">
            © 2025 Cyclo Ranking - Plateforme de classement des courses cyclosportives
          </p>
        </div>
      </div>
    `,
    text: `
      Bienvenue sur Cyclo Ranking !
      
      Merci de vous être inscrit sur notre plateforme de classement des courses cyclosportives.
      
      Pour activer votre compte, veuillez cliquer sur ce lien :
      ${verificationUrl}
      
      Ce lien expirera dans 24 heures.
      
      © 2025 Cyclo Ranking
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Email de vérification envoyé à:', email)
    return true
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    return false
  }
}

// Fonction utilitaire pour générer un token de vérification
export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36)
}
