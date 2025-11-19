import * as dotenv from 'dotenv'
import * as path from 'path'
import { sendEmail, emailTemplates } from '../lib/send-email'

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

async function quickSend() {
  const args = process.argv.slice(2)
  
  if (args.length < 2) {
    console.log('📧 Utilisation:')
    console.log('npm run quick:send destinataire@email.com "Sujet" "Message"')
    console.log('')
    console.log('Exemples:')
    console.log('npm run quick:send test@example.com "Test" "Ceci est un test"')
    console.log('npm run quick:send user@example.com "Bienvenue" --welcome "Jean"')
    return
  }

  const [to, subject, ...messageParts] = args
  
  try {
    if (subject === '--welcome' && messageParts[0]) {
      // Email de bienvenue
      const name = messageParts[0]
      console.log(`📧 Envoi email de bienvenue à ${name} (${to})...`)
      
      await sendEmail({
        to,
        ...emailTemplates.welcome(name)
      })
      
    } else {
      // Email simple
      const message = messageParts.join(' ')
      console.log(`📧 Envoi email à ${to}...`)
      console.log(`   Sujet: ${subject}`)
      
      await sendEmail({
        to,
        ...emailTemplates.simple(subject, `<p>${message}</p>`)
      })
    }
    
    console.log('✅ Email envoyé avec succès !')
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

quickSend()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur:', error)
    process.exit(1)
  })
