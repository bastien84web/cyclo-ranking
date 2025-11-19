import * as dotenv from 'dotenv'
import * as path from 'path'
import { Resend } from 'resend'

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendSingleEmail() {
  console.log('📧 Envoi d\'un email unitaire...\n')
  
  // Configuration de l'email
  const emailConfig = {
    from: 'contact@meilleures-cyclosportives.com',
    to: 'beaurinbastien@gmail.com', // Remplacez par l'email du destinataire
    subject: 'Test d\'envoi depuis contact@meilleures-cyclosportives.com',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🚴‍♂️ Meilleures Cyclosportives</h1>
        </div>
        
        <div style="padding: 40px 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Email de test</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Ceci est un email de test envoyé depuis <strong>contact@meilleures-cyclosportives.com</strong>
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">✅ Configuration validée</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Domaine configuré dans Resend</li>
              <li>Enregistrements DNS SPF/DKIM en place</li>
              <li>Email envoyé avec succès depuis contact@</li>
            </ul>
          </div>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Vous pouvez maintenant utiliser cette adresse pour tous vos envois d'emails !
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #999; font-size: 14px;">
              📅 Envoyé le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
            </p>
          </div>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: #999; margin: 0; font-size: 14px;">
            © 2025 Meilleures Cyclosportives - Email de test automatique
          </p>
        </div>
      </div>
    `,
    text: `
      Email de test - Meilleures Cyclosportives
      
      Ceci est un email de test envoyé depuis contact@meilleures-cyclosportives.com
      
      Configuration validée :
      - Domaine configuré dans Resend
      - Enregistrements DNS SPF/DKIM en place  
      - Email envoyé avec succès depuis contact@
      
      Vous pouvez maintenant utiliser cette adresse pour tous vos envois d'emails !
      
      Envoyé le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
      
      © 2025 Meilleures Cyclosportives
    `
  }
  
  // Vérifier la configuration
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY non défini dans .env.local')
    return
  }
  
  console.log('⚙️  Configuration:')
  console.log(`   - From: ${emailConfig.from}`)
  console.log(`   - To: ${emailConfig.to}`)
  console.log(`   - Subject: ${emailConfig.subject}`)
  console.log('')
  
  try {
    console.log('🔄 Envoi en cours...')
    
    const result = await resend.emails.send(emailConfig)
    
    console.log('✅ Email envoyé avec succès !')
    console.log('📧 Détails de l\'envoi:')
    console.log(`   - ID: ${result.data?.id}`)
    console.log(`   - From: ${emailConfig.from}`)
    console.log(`   - To: ${emailConfig.to}`)
    console.log('')
    console.log('💡 Vérifiez votre boîte de réception !')
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi:', error)
    console.log('')
    console.log('🔍 Vérifications:')
    console.log('   1. RESEND_API_KEY est-il correct ?')
    console.log('   2. Le domaine est-il vérifié dans Resend ?')
    console.log('   3. Les enregistrements DNS sont-ils propagés ?')
  }
}

// Permettre de personnaliser l'email via les arguments
const args = process.argv.slice(2)
if (args.length >= 2) {
  const [to, subject, ...messageParts] = args
  const message = messageParts.join(' ')
  
  console.log('📝 Email personnalisé détecté:')
  console.log(`   - Destinataire: ${to}`)
  console.log(`   - Sujet: ${subject}`)
  if (message) console.log(`   - Message: ${message}`)
  console.log('')
}

sendSingleEmail()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur:', error)
    process.exit(1)
  })
