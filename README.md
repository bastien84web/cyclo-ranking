# Cyclo Ranking - Classement des Courses Cyclosportives

Une application web moderne pour voter et classer les courses cyclosportives selon différents critères.

## Fonctionnalités

- **Système d'authentification** : Inscription et connexion sécurisées
- **Gestion des courses** : Ajout et consultation des courses cyclosportives
- **Système de vote** : Vote sur 12 critères différents répartis en 5 catégories :
  - **Logistique** : Hébergement, parking, distance départ/arrivée
  - **Ravitaillement** : Qualité, quantité, convivialité
  - **Parcours** : Sécurité, fléchage, circulation, beauté
  - **Défis sportifs** : Variété des parcours
  - **Prix** : Rapport qualité-prix
- **Classement** : Affichage des courses triées par note, date ou nombre de votes
- **Validation** : Un seul vote par utilisateur par course

## Technologies utilisées

- **Frontend** : Next.js 14, React, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes
- **Base de données** : PostgreSQL (Supabase) avec Prisma ORM
- **Authentification** : NextAuth.js
- **Emails** : Resend (avec fallback Gmail SMTP)
- **Cartes** : Leaflet / React-Leaflet
- **Icônes** : Lucide React
- **Déploiement** : Netlify

## Installation

1. **Cloner le projet** :
```bash
git clone <repository-url>
cd cyclo-ranking
```

2. **Installer les dépendances** :
```bash
npm install
```

3. **Configurer les variables d'environnement** :
Créer un fichier `.env.local` (voir `.env.example`) :
```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="re_your_api_key"
EMAIL_FROM="noreply@meilleures-cyclosportive.com"
```

4. **Configurer la base de données** :
```bash
npm run db:push
npm run db:complete-cyclosportives-2025
```

5. **Lancer le serveur de développement** :
```bash
npm run dev
```

L'application sera accessible sur **http://localhost:3000** 🚀

## Structure du projet

```
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # API Routes
│   ├── auth/              # Pages d'authentification
│   └── races/             # Pages de gestion des courses
├── components/            # Composants React réutilisables
├── lib/                   # Utilitaires et configuration
├── prisma/               # Schéma et migrations de base de données
└── types/                # Définitions TypeScript
```

## Utilisation

1. **Créer un compte** ou se connecter
2. **Ajouter une course** via le bouton "Ajouter une course"
3. **Voter** pour les courses en cliquant sur "Voter" sur chaque carte
4. **Consulter les classements** sur la page d'accueil

## Critères de vote

### Logistique (3 critères)
- Disponibilité d'hébergement à proximité du départ
- Parkings à proximité du départ
- Distance entre le départ et l'arrivée

### Ravitaillement et repas (3 critères)
- Qualité
- Quantité
- Convivialité

### Parcours (4 critères)
- Sécurité
- Fléchage
- Circulation
- Beauté du parcours

### Défis sportifs (1 critère)
- Différents parcours adaptés à chaque niveau

### Prix (1 critère)
- Rapport qualité-prix

Chaque critère est noté de 1 à 5 étoiles. La note globale est calculée comme la moyenne de toutes les catégories.

## Développement

Pour contribuer au projet :

1. Fork le repository
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT.
