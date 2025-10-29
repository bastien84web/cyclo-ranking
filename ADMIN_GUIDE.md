# Guide d'Administration - Gestion des Images

## 🎯 Nouveau Système Simplifié

La base de données a été **nettoyée** de toutes les images automatiques. Les administrateurs peuvent maintenant ajouter les logos et images **manuellement** selon leurs besoins.

## 🔐 Accès Administration

### Connexion Admin
- **Email** : `admin@cycloranking.com`
- **Mot de passe** : `admin123`
- **URL** : `http://localhost:3000/admin`

### Accès depuis l'interface
1. Connectez-vous avec le compte admin
2. Cliquez sur le bouton **"Admin"** dans la navigation
3. Gérez les images des cyclosportives

## 🖼️ Gestion des Images

### Types d'images supportées
- **Logos** : Format recommandé 200x100px (ratio 2:1)
- **Images de fond** : Format minimum 400x200px
- **Formats** : JPG, PNG, SVG, WebP

### Méthodes d'ajout

#### 1. Images locales (recommandé)
```
/public/logos/nom-logo.png
/public/images/nom-image.jpg
```
Dans l'admin, utilisez les chemins relatifs :
- Logo : `/logos/nom-logo.png`
- Image : `/images/nom-image.jpg`

#### 2. Images externes
Utilisez des URLs complètes :
- `https://example.com/logo.png`
- `https://cdn.example.com/image.jpg`

## 📁 Structure des Dossiers

```
public/
├── logos/          # Logos des cyclosportives
│   ├── gfny.png
│   ├── marmotte.png
│   └── ...
└── images/         # Images de fond
    ├── alpe-dhuez.jpg
    ├── mont-ventoux.jpg
    └── ...
```

## 🚀 Workflow Recommandé

### Pour ajouter des images :

1. **Préparer les fichiers**
   - Redimensionner aux bonnes tailles
   - Optimiser le poids (< 100KB par image)
   - Nommer clairement (`marmotte-logo.png`)

2. **Uploader les fichiers**
   - Placer dans `/public/logos/` ou `/public/images/`
   - Ou utiliser un service externe (Cloudinary, etc.)

3. **Configurer dans l'admin**
   - Aller sur `/admin`
   - Cliquer "Modifier" sur la cyclosportive
   - Ajouter les URLs des images
   - Sauvegarder

## 🎨 Recommandations Visuelles

### Logos
- **Fond transparent** de préférence
- **Texte lisible** sur fond clair et foncé
- **Style cohérent** avec l'identité de l'événement

### Images de fond
- **Paysages** représentatifs de la région
- **Qualité élevée** mais optimisée
- **Couleurs harmonieuses** avec le design du site

## 🔧 Maintenance

### Nettoyage périodique
```bash
# Supprimer toutes les images des courses
node scripts/clean-race-images.js
```

### Sauvegarde
- Sauvegarder régulièrement le dossier `/public/`
- Exporter la base de données avec les URLs

## ✅ Avantages de cette Approche

- **Contrôle total** sur les images affichées
- **Qualité garantie** par validation manuelle  
- **Performance optimisée** (pas d'images inutiles)
- **Flexibilité** pour les mises à jour
- **Sécurité** (pas d'images automatiques potentiellement problématiques)

## 🆘 Support

En cas de problème :
1. Vérifier les permissions des dossiers
2. Contrôler les URLs dans l'admin
3. Vérifier la console du navigateur pour les erreurs
4. Redémarrer l'application si nécessaire
