// Script pour créer tous les assets manquants
const fs = require('fs')
const path = require('path')

// Template SVG pour les images
const createImageSVG = (title, color1 = '#3b82f6', color2 = '#1e40af') => `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient${title.replace(/\s/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="200" fill="url(#gradient${title.replace(/\s/g, '')})"/>
  <polygon points="0,200 80,100 160,140 240,80 320,120 400,90 400,200" fill="rgba(255,255,255,0.2)"/>
  <polygon points="40,200 120,120 200,160 280,100 360,140 400,110 400,200" fill="rgba(255,255,255,0.1)"/>
  <rect x="20" y="160" width="${Math.min(360, title.length * 12 + 40)}" height="25" fill="rgba(0,0,0,0.7)" rx="5"/>
  <text x="30" y="178" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold">${title}</text>
</svg>`

// Template SVG pour les logos
const createLogoSVG = (text, bgColor = '#f3f4f6', textColor = '#374151') => `<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="100" fill="${bgColor}" stroke="#d1d5db" stroke-width="2" rx="8"/>
  <text x="100" y="45" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="${textColor}" font-weight="bold">${text.substring(0, 20)}</text>
  <text x="100" y="65" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="${textColor}">Cyclosportive</text>
</svg>`

// Liste des assets manquants à créer
const missingAssets = [
  // Images manquantes
  { type: 'image', name: 'tour-mont-blanc.jpg', title: 'Tour du Mont Blanc', colors: ['#e5e7eb', '#9ca3af'] },
  { type: 'image', name: 'col-madeleine.jpg', title: 'Col de la Madeleine', colors: ['#3b82f6', '#2563eb'] },
  { type: 'image', name: 'mont-blanc.jpg', title: 'Mont Blanc', colors: ['#e5e7eb', '#9ca3af'] },
  { type: 'image', name: 'col-loze.jpg', title: 'Col de la Loze', colors: ['#10b981', '#059669'] },
  { type: 'image', name: 'chambery.jpg', title: 'Chambéry', colors: ['#06b6d4', '#0891b2'] },
  { type: 'image', name: 'la-plagne.jpg', title: 'La Plagne', colors: ['#e5e7eb', '#9ca3af'] },
  { type: 'image', name: 'cannes-cyclo.jpg', title: 'Cannes Cyclo', colors: ['#8b5cf6', '#7c3aed'] },
  { type: 'image', name: 'vercors.jpg', title: 'Vercors', colors: ['#10b981', '#059669'] },
  { type: 'image', name: 'vaujany.jpg', title: 'Vaujany', colors: ['#3b82f6', '#2563eb'] },
  { type: 'image', name: 'grand-ballon.jpg', title: 'Grand Ballon', colors: ['#f59e0b', '#d97706'] },
  
  // Logos manquants
  { type: 'logo', name: 'madeleine-logo.png', text: 'COL MADELEINE', bgColor: '#3b82f6', textColor: '#ffffff' },
  { type: 'logo', name: 'tour-mont-blanc-logo.png', text: 'TOUR MONT BLANC', bgColor: '#e5e7eb', textColor: '#374151' },
  { type: 'logo', name: 'megeve-logo.png', text: 'MEGÈVE', bgColor: '#1f2937', textColor: '#ffffff' },
  { type: 'logo', name: 'col-loze-logo.png', text: 'COL DE LA LOZE', bgColor: '#10b981', textColor: '#ffffff' },
  { type: 'logo', name: 'galibier-logo.png', text: 'GALIBIER', bgColor: '#3b82f6', textColor: '#ffffff' },
  { type: 'logo', name: 'mercantour-logo.png', text: 'MERCANTOUR', bgColor: '#f59e0b', textColor: '#ffffff' },
  { type: 'logo', name: 'verdon-logo.png', text: 'VERDON', bgColor: '#06b6d4', textColor: '#ffffff' },
  { type: 'logo', name: 'paul-ricard-logo.png', text: 'PAUL RICARD', bgColor: '#ef4444', textColor: '#ffffff' },
  { type: 'logo', name: 'rene-vietto-logo.png', text: 'RENÉ VIETTO', bgColor: '#8b5cf6', textColor: '#ffffff' },
  { type: 'logo', name: 'tro-bro-leon-logo.png', text: 'TRO BRO LEON', bgColor: '#06b6d4', textColor: '#ffffff' },
  { type: 'logo', name: 'volcane-logo.png', text: 'LA VOLCANE', bgColor: '#f59e0b', textColor: '#ffffff' },
  { type: 'logo', name: 'paris-roubaix-logo.png', text: 'PARIS ROUBAIX', bgColor: '#1f2937', textColor: '#ffffff' }
]

function createMissingAssets() {
  const imagesDir = path.join(__dirname, '..', 'public', 'images')
  const logosDir = path.join(__dirname, '..', 'public', 'logos')

  console.log('🔧 Création des assets manquants...')

  let createdCount = 0

  missingAssets.forEach(asset => {
    const isLogo = asset.type === 'logo'
    const targetDir = isLogo ? logosDir : imagesDir
    const filePath = path.join(targetDir, asset.name)
    
    // Vérifier si le fichier existe déjà
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  Existe déjà: ${asset.name}`)
      return
    }

    let svgContent
    if (isLogo) {
      svgContent = createLogoSVG(asset.text, asset.bgColor, asset.textColor)
    } else {
      svgContent = createImageSVG(asset.title, asset.colors[0], asset.colors[1])
    }
    
    fs.writeFileSync(filePath, svgContent)
    console.log(`✅ ${isLogo ? 'Logo' : 'Image'} créé: ${asset.name}`)
    createdCount++
  })

  console.log(`\n🎉 ${createdCount} nouveaux assets créés !`)
  
  // Créer aussi des copies avec différentes extensions pour compatibilité
  console.log('\n🔄 Création des copies de compatibilité...')
  
  const extensionMappings = [
    { from: '.svg', to: '.jpg' },
    { from: '.svg', to: '.png' }
  ]
  
  let copiedCount = 0
  
  // Copier les fichiers SVG vers JPG/PNG pour compatibilité
  const allSvgFiles = [
    ...fs.readdirSync(imagesDir).filter(f => f.endsWith('.svg')).map(f => ({ dir: imagesDir, file: f })),
    ...fs.readdirSync(logosDir).filter(f => f.endsWith('.svg')).map(f => ({ dir: logosDir, file: f }))
  ]
  
  allSvgFiles.forEach(({ dir, file }) => {
    const baseName = file.replace('.svg', '')
    
    extensionMappings.forEach(({ from, to }) => {
      const targetFile = baseName + to
      const sourcePath = path.join(dir, file)
      const targetPath = path.join(dir, targetFile)
      
      if (!fs.existsSync(targetPath)) {
        fs.copyFileSync(sourcePath, targetPath)
        console.log(`📋 Copié: ${file} -> ${targetFile}`)
        copiedCount++
      }
    })
  })
  
  console.log(`\n✨ ${copiedCount} copies de compatibilité créées !`)
  console.log('\n🎯 Tous les assets manquants ont été créés. Les erreurs 404 devraient être résolues.')
}

// Exécuter le script
createMissingAssets()
