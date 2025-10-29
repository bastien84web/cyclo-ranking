// Script pour créer des images par défaut pour éviter les erreurs 404
const fs = require('fs')
const path = require('path')

// Template SVG pour les images par défaut
const createImageSVG = (title, color1 = '#3b82f6', color2 = '#1e40af') => `
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="200" fill="url(#gradient)"/>
  
  <!-- Mountains -->
  <polygon points="0,200 80,100 160,140 240,80 320,120 400,90 400,200" fill="rgba(255,255,255,0.2)"/>
  <polygon points="40,200 120,120 200,160 280,100 360,140 400,110 400,200" fill="rgba(255,255,255,0.1)"/>
  
  <!-- Text background -->
  <rect x="20" y="160" width="${Math.min(360, title.length * 12 + 40)}" height="25" fill="rgba(0,0,0,0.7)" rx="5"/>
  <text x="30" y="178" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold">
    ${title}
  </text>
</svg>
`

// Template SVG pour les logos par défaut
const createLogoSVG = (text, bgColor = '#f3f4f6', textColor = '#374151') => `
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="100" fill="${bgColor}" stroke="#d1d5db" stroke-width="2" rx="8"/>
  <text x="100" y="45" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="${textColor}" font-weight="bold">
    ${text.substring(0, 20)}
  </text>
  <text x="100" y="65" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="${textColor}">
    Cyclosportive
  </text>
</svg>
`

// Images à créer avec leurs couleurs spécifiques
const imagesToCreate = [
  // Images spécifiques aux événements
  { name: 'alpe-dhuez.jpg', title: 'Alpe d\'Huez', colors: ['#4ade80', '#22c55e'] },
  { name: 'ardechoise.jpg', title: 'L\'Ardéchoise', colors: ['#f59e0b', '#d97706'] },
  { name: 'mont-ventoux.jpg', title: 'Mont Ventoux', colors: ['#8b5cf6', '#7c3aed'] },
  { name: 'marmotte-alpes.jpg', title: 'La Marmotte', colors: ['#06b6d4', '#0891b2'] },
  { name: 'tourmalet.jpg', title: 'Col du Tourmalet', colors: ['#ef4444', '#dc2626'] },
  { name: 'galibier.jpg', title: 'Col du Galibier', colors: ['#3b82f6', '#2563eb'] },
  { name: 'col-loze.jpg', title: 'Col de la Loze', colors: ['#10b981', '#059669'] },
  { name: 'col-bonette.jpg', title: 'Col de la Bonette', colors: ['#f97316', '#ea580c'] },
  { name: 'gorges-verdon.jpg', title: 'Gorges du Verdon', colors: ['#06b6d4', '#0891b2'] },
  { name: 'mont-blanc.jpg', title: 'Mont Blanc', colors: ['#e5e7eb', '#9ca3af'] },
  
  // Images par défaut par région
  { name: 'default-alpes.jpg', title: 'Alpes Françaises', colors: ['#3b82f6', '#1e40af'] },
  { name: 'default-provence.jpg', title: 'Provence', colors: ['#8b5cf6', '#7c3aed'] },
  { name: 'default-pyrenees.jpg', title: 'Pyrénées', colors: ['#ef4444', '#dc2626'] },
  { name: 'default-volcans.jpg', title: 'Volcans d\'Auvergne', colors: ['#f59e0b', '#d97706'] },
  { name: 'default-alsace.jpg', title: 'Alsace', colors: ['#10b981', '#059669'] },
  { name: 'default-bretagne.jpg', title: 'Bretagne', colors: ['#06b6d4', '#0891b2'] },
  { name: 'default-normandie.jpg', title: 'Normandie', colors: ['#84cc16', '#65a30d'] },
  { name: 'default-vignobles.jpg', title: 'Vignobles de Bourgogne', colors: ['#7c2d12', '#92400e'] }
]

// Logos à créer
const logosToCreate = [
  // Logos spécifiques
  { name: 'gfny-logo.png', text: 'GFNY', bgColor: '#1f2937', textColor: '#ffffff' },
  { name: 'marmotte-logo.png', text: 'LA MARMOTTE', bgColor: '#0ea5e9', textColor: '#ffffff' },
  { name: 'ardechoise-logo.png', text: 'L\'ARDÉCHOISE', bgColor: '#f59e0b', textColor: '#ffffff' },
  { name: 'mont-ventoux-logo.png', text: 'MONT VENTOUX', bgColor: '#8b5cf6', textColor: '#ffffff' },
  { name: 'etape-du-tour-logo.png', text: 'ÉTAPE DU TOUR', bgColor: '#eab308', textColor: '#000000' },
  
  // Logos par défaut par région
  { name: 'default-alpes.png', text: 'ALPES', bgColor: '#3b82f6', textColor: '#ffffff' },
  { name: 'default-paca.png', text: 'PACA', bgColor: '#8b5cf6', textColor: '#ffffff' },
  { name: 'default-aquitaine.png', text: 'AQUITAINE', bgColor: '#ef4444', textColor: '#ffffff' },
  { name: 'default-auvergne.png', text: 'AUVERGNE', bgColor: '#f59e0b', textColor: '#ffffff' },
  { name: 'default-alsace.png', text: 'ALSACE', bgColor: '#10b981', textColor: '#ffffff' },
  { name: 'default-bretagne.png', text: 'BRETAGNE', bgColor: '#06b6d4', textColor: '#ffffff' },
  { name: 'default-normandie.png', text: 'NORMANDIE', bgColor: '#84cc16', textColor: '#ffffff' },
  { name: 'default-bourgogne.png', text: 'BOURGOGNE', bgColor: '#7c2d12', textColor: '#ffffff' }
]

function createDefaultAssets() {
  const imagesDir = path.join(__dirname, '..', 'public', 'images')
  const logosDir = path.join(__dirname, '..', 'public', 'logos')

  // Créer les dossiers s'ils n'existent pas
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }
  if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true })
  }

  console.log('🖼️  Création des images par défaut...')

  // Créer les images
  imagesToCreate.forEach(image => {
    const filePath = path.join(imagesDir, image.name.replace('.jpg', '.svg'))
    const svgContent = createImageSVG(image.title, image.colors[0], image.colors[1])
    
    fs.writeFileSync(filePath, svgContent)
    console.log(`✅ Image créée: ${image.name} -> ${image.title}`)
  })

  console.log('\n🎨 Création des logos par défaut...')

  // Créer les logos
  logosToCreate.forEach(logo => {
    const filePath = path.join(logosDir, logo.name.replace('.png', '.svg'))
    const svgContent = createLogoSVG(logo.text, logo.bgColor, logo.textColor)
    
    fs.writeFileSync(filePath, svgContent)
    console.log(`✅ Logo créé: ${logo.name} -> ${logo.text}`)
  })

  console.log(`\n🎉 ${imagesToCreate.length} images et ${logosToCreate.length} logos créés avec succès !`)
  console.log('\n💡 Note: Les fichiers sont en format SVG pour une qualité optimale.')
  console.log('   Vous pouvez les remplacer par de vraies photos/logos plus tard.')
}

// Exécuter le script
createDefaultAssets()
