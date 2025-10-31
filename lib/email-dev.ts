// Service email de développement (simulation)
// Utilisé quand les ports SMTP sont bloqués

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`
  
  // En développement, on simule l'envoi et on affiche le lien
  console.log('='.repeat(80))
  console.log('📧 EMAIL DE VÉRIFICATION SIMULÉ')
  console.log('='.repeat(80))
  console.log(`Destinataire: ${email}`)
  console.log(`Lien de vérification: ${verificationUrl}`)
  console.log('='.repeat(80))
  console.log('⚠️  COPIEZ CE LIEN DANS VOTRE NAVIGATEUR POUR VÉRIFIER LE COMPTE')
  console.log('='.repeat(80))
  
  // Simuler un délai d'envoi
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return true
}

export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36)
}
