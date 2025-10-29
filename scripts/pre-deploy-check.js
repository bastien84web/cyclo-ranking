// Script de vérification avant déploiement
const fs = require('fs')
const path = require('path')

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, '..', filePath)
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${description}`)
    return true
  } else {
    console.log(`❌ ${description} - MANQUANT: ${filePath}`)
    return false
  }
}

function checkPreDeploy() {
  console.log('🔍 Vérification pré-déploiement...\n')
  
  let allGood = true
  
  // Fichiers essentiels
  console.log('📁 Fichiers de configuration:')
  allGood &= checkFile('netlify.toml', 'Configuration Netlify')
  allGood &= checkFile('next.config.js', 'Configuration Next.js')
  allGood &= checkFile('prisma/schema.production.prisma', 'Schéma Prisma production')
  
  console.log('\n📊 Scripts de peuplement:')
  allGood &= checkFile('scripts/seed-production.js', 'Script de seed principal')
  allGood &= checkFile('scripts/seed-comments-production.js', 'Script de commentaires')
  
  console.log('\n🎨 Assets et composants:')
  allGood &= checkFile('components/SafeImage.tsx', 'Composant SafeImage')
  allGood &= checkFile('public/logos/placeholder.svg', 'Logo placeholder')
  allGood &= checkFile('public/images/placeholder.svg', 'Image placeholder')
  
  console.log('\n🔧 APIs et fonctionnalités:')
  allGood &= checkFile('app/api/upload/route.ts', 'API Upload')
  allGood &= checkFile('app/api/races/[id]/route.ts', 'API Races CRUD')
  allGood &= checkFile('app/api/races/[id]/comments/route.ts', 'API Commentaires')
  allGood &= checkFile('app/admin/page.tsx', 'Interface Admin')
  allGood &= checkFile('components/CommentsModal.tsx', 'Modal Commentaires')
  
  console.log('\n📚 Documentation:')
  allGood &= checkFile('DEPLOYMENT_GUIDE.md', 'Guide de déploiement')
  allGood &= checkFile('ADMIN_COMPLETE_GUIDE.md', 'Guide admin complet')
  allGood &= checkFile('IMAGES_CONFIGURATION.md', 'Configuration images')
  
  // Vérifications spécifiques
  console.log('\n🔍 Vérifications spécifiques:')
  
  // Vérifier package.json
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'))
    if (packageJson.dependencies['@prisma/client'] && packageJson.dependencies['prisma']) {
      console.log('✅ Dépendances Prisma présentes')
    } else {
      console.log('❌ Dépendances Prisma manquantes')
      allGood = false
    }
    
    if (packageJson.dependencies['next-auth']) {
      console.log('✅ NextAuth configuré')
    } else {
      console.log('❌ NextAuth manquant')
      allGood = false
    }
  } catch (error) {
    console.log('❌ Erreur lecture package.json')
    allGood = false
  }
  
  // Vérifier next.config.js
  try {
    const nextConfig = fs.readFileSync(path.join(__dirname, '..', 'next.config.js'), 'utf8')
    if (nextConfig.includes('remotePatterns') && nextConfig.includes('hostname: \'**\'')) {
      console.log('✅ Configuration images externes OK')
    } else {
      console.log('❌ Configuration images externes manquante')
      allGood = false
    }
  } catch (error) {
    console.log('❌ Erreur lecture next.config.js')
    allGood = false
  }
  
  console.log('\n' + '='.repeat(50))
  
  if (allGood) {
    console.log('🎉 PRÊT POUR LE DÉPLOIEMENT !')
    console.log('\n📋 Étapes suivantes:')
    console.log('1. Configurer les variables d\'environnement sur Netlify')
    console.log('2. git add . && git commit -m "Ready for production deployment"')
    console.log('3. git push origin main')
    console.log('4. Vérifier le build sur Netlify')
    console.log('5. Tester l\'application déployée')
    
    console.log('\n🔑 Variables d\'environnement nécessaires:')
    console.log('- DATABASE_URL (PostgreSQL)')
    console.log('- NEXTAUTH_SECRET')
    console.log('- NEXTAUTH_URL')
    console.log('- EMAIL_* (optionnel)')
    
    process.exit(0)
  } else {
    console.log('❌ PROBLÈMES DÉTECTÉS - Corriger avant déploiement')
    process.exit(1)
  }
}

checkPreDeploy()
