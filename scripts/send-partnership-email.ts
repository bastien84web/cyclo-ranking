import * as dotenv from 'dotenv'
import * as path from 'path'
import { sendEmail } from '../lib/send-email'

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

function createPartnershipEmailTemplate(companyName: string, contactName?: string) {
  const greeting = contactName ? `Bonjour ${contactName}` : 'Bonjour'
  
  return {
    subject: `Partenariat publicitaire - Meilleures Cyclosportives & ${companyName}`,
    html: `
      <div style="max-width: 700px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🚴‍♂️ Meilleures Cyclosportives</h1>
          <p style="color: #e8eaff; margin: 10px 0 0 0; font-size: 16px;">Plateforme de référence des courses cyclosportives</p>
        </div>
        
        <div style="padding: 40px 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 25px;">Proposition de partenariat publicitaire</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            ${greeting},
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Je me permets de vous contacter concernant le site <strong>www.meilleures-cyclosportives.com</strong>, 
            la plateforme de référence pour le classement et la découverte des courses cyclosportives en France.
          </p>
          
          <div style="background: white; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">📊 Notre audience</h3>
            <ul style="color: #666; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li><strong>Cyclistes passionnés</strong> recherchant les meilleures courses</li>
              <li><strong>Organisateurs d'événements</strong> cyclosportifs</li>
              <li><strong>Communauté engagée</strong> de pratiquants réguliers</li>
              <li><strong>Cible qualifiée</strong> intéressée par l'équipement et les services cyclistes</li>
            </ul>
          </div>
          
          <h3 style="color: #333; margin-bottom: 15px;">🤝 Opportunités de partenariat</h3>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="color: #667eea; margin: 0 0 10px 0;">🎯 Espaces publicitaires</h4>
            <p style="color: #666; margin: 0; line-height: 1.6;">
              Bannières stratégiquement placées sur nos pages les plus visitées, 
              avec ciblage par région ou type de course.
            </p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="color: #667eea; margin: 0 0 10px 0;">🔗 Liens sponsorisés</h4>
            <p style="color: #666; margin: 0; line-height: 1.6;">
              Intégration naturelle de vos produits/services dans nos contenus, 
              avec liens vers votre site.
            </p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h4 style="color: #667eea; margin: 0 0 10px 0;">📧 Newsletter partenaire</h4>
            <p style="color: #666; margin: 0; line-height: 1.6;">
              <em>projet en cours</em> → Mise en avant de vos offres dans notre newsletter hebdomadaire 
              envoyée à notre base d'abonnés qualifiés.
            </p>
          </div>
          
          <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">💡 Pourquoi nous choisir ?</h3>
            <ul style="color: #1976d2; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>Audience <strong>100% cycliste</strong> et engagée</li>
              <li>Plateforme en <strong>forte croissance</strong></li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:contact@meilleures-cyclosportives.com" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold;
                      display: inline-block;">
              Nous contacter
            </a>
          </div>
          
          <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px;">
            <p style="color: #999; font-size: 14px; line-height: 1.6; margin: 0;">
              <strong>Bastien Beaurin</strong><br>
              Fondateur - Meilleures Cyclosportives<br>
              📧 contact@meilleures-cyclosportives.com<br>
              🌐 <a href="https://meilleures-cyclosportives.com" style="color: #667eea;">meilleures-cyclosportives.com</a>
            </p>
          </div>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: #999; margin: 0; font-size: 14px;">
            © 2025 Meilleures Cyclosportives - La référence des courses cyclosportives
          </p>
        </div>
      </div>
    `,
    text: `
      Proposition de partenariat publicitaire - Meilleures Cyclosportives & ${companyName}
      
      ${greeting},
      
      Je me permets de vous contacter concernant le site www.meilleures-cyclosportives.com, la plateforme de référence pour le classement et la découverte des courses cyclosportives en France.
      
      NOTRE AUDIENCE :
      - Cyclistes passionnés recherchant les meilleures courses
      - Organisateurs d'événements cyclosportifs  
      - Communauté engagée de pratiquants réguliers
      - Cible qualifiée intéressée par l'équipement et les services cyclistes
      
      OPPORTUNITÉS DE PARTENARIAT :
      
      🎯 Espaces publicitaires
      Bannières stratégiquement placées sur nos pages les plus visitées, avec ciblage par région ou type de course.
      
      🔗 Liens sponsorisés  
      Intégration naturelle de vos produits/services dans nos contenus, avec liens vers votre site.
      
      📧 Newsletter partenaire
      projet en cours → Mise en avant de vos offres dans notre newsletter hebdomadaire envoyée à notre base d'abonnés qualifiés.
      
      POURQUOI NOUS CHOISIR ?
      - Audience 100% cycliste et engagée
      - Plateforme en forte croissance
      
      Cordialement,
      
      Bastien Beaurin
      Fondateur - Meilleures Cyclosportives
      contact@meilleures-cyclosportives.com
      https://meilleures-cyclosportives.com
    `
  }
}

async function sendPartnershipEmail() {
  console.log('🤝 Envoi d\'email de partenariat...\n')
  
  // Récupérer les arguments de la ligne de commande
  const args = process.argv.slice(2)
  
  if (args.length < 2) {
    console.log('❌ Usage: npm run send:partnership [email] [entreprise] [contact?]')
    console.log('Exemple: npm run send:partnership "contact@decathlon.fr" "Decathlon" "Marie Martin"')
    process.exit(1)
  }
  
  const testConfig = {
    recipientEmail: args[0],
    companyName: args[1],
    contactName: args[2] || undefined
  }
  
  console.log('📧 Configuration de l\'email:')
  console.log(`   - Destinataire: ${testConfig.recipientEmail}`)
  console.log(`   - Entreprise: ${testConfig.companyName}`)
  console.log(`   - Contact: ${testConfig.contactName || 'Non spécifié'}`)
  console.log('')
  
  try {
    const emailContent = createPartnershipEmailTemplate(testConfig.companyName, testConfig.contactName)
    
    const result = await sendEmail({
      to: testConfig.recipientEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      replyTo: 'contact@meilleures-cyclosportives.com'
    })
    
    console.log('✅ Email de partenariat envoyé avec succès !')
    console.log(`📧 Sujet: ${emailContent.subject}`)
    console.log(`📬 Destinataire: ${testConfig.recipientEmail}`)
    console.log('')
    console.log('💡 Vérifiez votre boîte de réception !')
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi:', error)
  }
}

console.log('🚴‍♂️ Script d\'envoi d\'email de partenariat')
console.log('')

sendPartnershipEmail()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur:', error)
    process.exit(1)
  })
