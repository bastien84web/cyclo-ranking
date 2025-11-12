import * as dotenv from 'dotenv'
import * as path from 'path'
import { sendVerificationEmail } from '../lib/email'

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

async function testResend() {
  console.log('🧪 Test d\'envoi d\'email via Resend...\n')
  
  // Vérifier la configuration
  const hasResend = !!process.env.RESEND_API_KEY
  const emailFrom = process.env.EMAIL_FROM
  
  console.log('⚙️  Configuration:')
  console.log(`   - RESEND_API_KEY: ${hasResend ? '✅ Défini' : '❌ Non défini'}`)
  console.log(`   - EMAIL_FROM: ${emailFrom || '❌ Non défini'}`)
  console.log(`   - Service: ${hasResend ? 'Resend' : 'Gmail SMTP (fallback)'}\n`)
  
  if (!hasResend && !process.env.EMAIL_SERVER_HOST) {
    console.error('❌ Erreur: Aucun service email configuré !')
    console.log('\n💡 Configurez RESEND_API_KEY dans .env.local')
    return
  }
  
  // Remplacez par votre email pour recevoir le test
  const testEmail = 'beaurinbastien@gmail.com'
  const testToken = 'test-token-' + Date.now()
  
  console.log(`🌐 Domaine d'envoi: ${process.env.EMAIL_FROM}\n`)
  
  console.log(`📧 Envoi d'un email de test à: ${testEmail}`)
  console.log(`🔗 Token de vérification: ${testToken}\n`)
  
  const result = await sendVerificationEmail(testEmail, testToken)
  
  if (result) {
    console.log('✅ Email envoyé avec succès !')
    console.log('\n📝 Vérifiez votre boîte de réception:')
    console.log(`   - Email: ${testEmail}`)
    console.log(`   - Sujet: "Vérifiez votre adresse email - Meilleures Cyclosportives"`)
    console.log('\n💡 Si vous ne voyez pas l\'email:')
    console.log('   1. Vérifiez votre dossier spam/courrier indésirable')
    console.log('   2. Vérifiez que RESEND_API_KEY est bien configuré dans .env.local')
    console.log('   3. Vérifiez que votre domaine est vérifié dans Resend (ou utilisez onboarding@resend.dev)')
  } else {
    console.log('❌ Échec de l\'envoi de l\'email')
    console.log('\n🔍 Vérifications:')
    console.log('   1. RESEND_API_KEY est-il défini dans .env.local ?')
    console.log('   2. EMAIL_FROM est-il configuré ?')
    console.log('   3. Le domaine EMAIL_FROM est-il vérifié dans Resend ?')
    console.log('\n💡 Pour tester sans configurer de domaine, utilisez:')
    console.log('   EMAIL_FROM="onboarding@resend.dev"')
  }
}

testResend()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur:', error)
    process.exit(1)
  })
