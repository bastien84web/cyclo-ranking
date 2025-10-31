# Améliorations de Sécurité - Cyclo Ranking

## 🔐 Authentification Google OAuth

### Fonctionnalités ajoutées
- **Authentification Google OAuth** : Les utilisateurs peuvent maintenant se connecter avec leur compte Google
- **Création automatique de comptes** : Les utilisateurs Google sont automatiquement créés dans la base de données
- **Coexistence avec l'authentification classique** : Les deux systèmes fonctionnent en parallèle

### Configuration requise

1. **Variables d'environnement** (à ajouter dans `.env.local`) :
```env
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"
```

2. **Configuration Google Cloud Console** :
   - Créer un projet dans Google Cloud Console
   - Activer l'API Google+ 
   - Créer des identifiants OAuth 2.0
   - Ajouter les URLs autorisées :
     - `http://localhost:3000` (développement)
     - `https://votre-domaine.com` (production)
   - Ajouter les URLs de redirection :
     - `http://localhost:3000/api/auth/callback/google` (développement)
     - `https://votre-domaine.com/api/auth/callback/google` (production)

### Avantages
- ✅ **Sécurité renforcée** : Pas de gestion de mots de passe côté application
- ✅ **Expérience utilisateur améliorée** : Connexion en un clic
- ✅ **Emails vérifiés** : Les comptes Google sont pré-vérifiés
- ✅ **Réduction du spam** : Moins de comptes factices

---

## 🛡️ Modération Automatique des Commentaires

### Fonctionnalités ajoutées
- **Modération en temps réel** : Vérification automatique pendant la saisie
- **Système de scoring** : Score de 0 à 100 pour chaque commentaire
- **Feedback utilisateur** : Suggestions d'amélioration en temps réel
- **Blocage automatique** : Commentaires inappropriés refusés automatiquement

### Critères de modération

#### 1. **Mots interdits** (Score -50)
- Gros mots et insultes
- Contenu discriminatoire
- Patterns de spam (casino, crypto, etc.)
- Détection avec variations (caractères spéciaux, abréviations)

#### 2. **Longueur du contenu**
- **Trop court** (< 5 mots) : Score -30
- **Trop long** (> 500 mots) : Score -20

#### 3. **Structure des phrases** (Score jusqu'à -25)
- Vérification de phrases complètes
- Présence de mots de liaison
- Cohérence grammaticale

#### 4. **Détection de spam** (Score jusqu'à -30)
- Répétitions excessives de mots
- Contenu répétitif

#### 5. **Pertinence cyclisme** (Score jusqu'à -15)
- Vérification de mots-clés liés au cyclisme
- Bonus pour le vocabulaire technique

#### 6. **Caractères spéciaux** (Score jusqu'à -20)
- Limitation des caractères spéciaux excessifs
- Contrôle de l'usage des majuscules

### Seuils de décision
- **Score ≥ 60** : ✅ Commentaire approuvé
- **Score 40-59** : ⚠️ Révision manuelle requise
- **Score < 40** : ❌ Commentaire refusé

### Interface utilisateur
- **Indicateurs visuels** : Bordures colorées (vert/rouge/gris)
- **Feedback en temps réel** : Score et suggestions affichés
- **Blocage de soumission** : Bouton désactivé si commentaire refusé
- **Messages d'erreur détaillés** : Raisons et suggestions d'amélioration

### API de modération
- **Endpoint** : `POST /api/moderate`
- **Usage** : Test de commentaires en temps réel
- **Réponse** : Score, statut, raisons, suggestions

---

## 🚀 Installation et Déploiement

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration des variables d'environnement
Copier `.env.example` vers `.env.local` et remplir les valeurs Google OAuth.

### 3. Migration de base de données
Les utilisateurs existants continuent de fonctionner normalement. Les nouveaux utilisateurs Google auront un champ `password` vide.

### 4. Test en local
```bash
npm run dev
```

---

## 📊 Monitoring et Maintenance

### Logs de modération
- Tous les commentaires refusés sont loggés
- Scores et raisons disponibles pour analyse
- Possibilité d'ajuster les seuils selon les besoins

### Maintenance de la liste de mots interdits
- Liste extensible dans `lib/moderation.ts`
- Ajout facile de nouveaux patterns
- Support des variations et abréviations

### Métriques recommandées
- Taux d'approbation des commentaires
- Score moyen des commentaires approuvés
- Fréquence des mots interdits détectés
- Utilisation de l'authentification Google vs classique

---

## 🔧 Personnalisation

### Ajuster les seuils de modération
Modifier les constantes dans `lib/moderation.ts` :
```typescript
// Seuil d'approbation (actuellement 60)
result.isApproved = result.score >= 60

// Seuil de révision manuelle (actuellement 40-59)
export function requiresManualReview(comment: string): boolean {
  const result = moderateComment(comment)
  return result.score >= 40 && result.score < 60
}
```

### Ajouter des mots interdits
```typescript
const FORBIDDEN_WORDS = [
  // Ajouter vos mots ici
  'nouveau_mot_interdit',
  // ...
]
```

### Personnaliser les messages
Les messages d'erreur et suggestions peuvent être modifiés dans `lib/moderation.ts`.

---

## 🛠️ Support Technique

### Dépannage courant

1. **Erreur Google OAuth** : Vérifier les URLs de redirection dans Google Cloud Console
2. **Modération trop stricte** : Ajuster les seuils dans `lib/moderation.ts`
3. **Commentaires bloqués à tort** : Réviser la liste des mots interdits

### Contact
Pour toute question technique, consulter la documentation NextAuth et les logs de l'application.
