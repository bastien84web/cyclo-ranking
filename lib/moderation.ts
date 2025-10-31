// Service de modération automatique des commentaires

// Liste de mots interdits (extensible)
const FORBIDDEN_WORDS = [
  // Gros mots courants
  'merde', 'putain', 'connard', 'salaud', 'enculé', 'bâtard', 'salope', 'pute',
  'con', 'conne', 'crétin', 'débile', 'idiot', 'imbécile', 'abruti', 'taré',
  'fdp', 'ntm', 'ptn', 'mrd', 'slt', 'enc', 'btrd',
  // Insultes
  'nul', 'pourri', 'dégueulasse', 'minable', 'pathétique', 'lamentable',
  // Discrimination
  'pd', 'pédé', 'tapette', 'gouine', 'négro', 'bougnoule', 'youpin',
  // Spam patterns
  'viagra', 'casino', 'poker', 'bitcoin', 'crypto', 'investissement',
  'promo', 'réduction', 'gratuit', 'cadeau', 'gagnez', 'loterie'
]

// Mots de liaison et structure pour vérifier la qualité
const CONNECTING_WORDS = [
  'et', 'ou', 'mais', 'donc', 'car', 'ni', 'or',
  'cependant', 'néanmoins', 'toutefois', 'pourtant', 'ainsi', 'alors',
  'ensuite', 'puis', 'enfin', 'd\'abord', 'premièrement', 'deuxièmement',
  'par contre', 'en revanche', 'de plus', 'également', 'aussi', 'de même'
]

// Mots positifs liés au cyclisme
const CYCLING_POSITIVE_WORDS = [
  'parcours', 'route', 'vélo', 'cyclisme', 'cyclosportive', 'organisation',
  'ravitaillement', 'paysage', 'défi', 'performance', 'équipe', 'ambiance',
  'convivialité', 'beau', 'magnifique', 'excellent', 'super', 'génial',
  'recommande', 'parfait', 'bien', 'bon', 'sympa', 'agréable'
]

export interface ModerationResult {
  isApproved: boolean
  score: number
  reasons: string[]
  suggestions?: string[]
}

export function moderateComment(comment: string): ModerationResult {
  const result: ModerationResult = {
    isApproved: true,
    score: 100,
    reasons: [],
    suggestions: []
  }

  if (!comment || comment.trim().length === 0) {
    result.isApproved = false
    result.score = 0
    result.reasons.push('Commentaire vide')
    return result
  }

  const cleanComment = comment.toLowerCase().trim()
  const words = cleanComment.split(/\s+/)
  const sentences = comment.split(/[.!?]+/).filter(s => s.trim().length > 0)

  // 1. Vérification des mots interdits
  const forbiddenWordsFound = checkForbiddenWords(cleanComment, words)
  if (forbiddenWordsFound.length > 0) {
    result.score -= 50
    result.reasons.push(`Contient des mots inappropriés: ${forbiddenWordsFound.join(', ')}`)
    result.suggestions?.push('Reformulez votre commentaire sans utiliser de langage inapproprié')
  }

  // 2. Vérification de la longueur minimale
  if (words.length < 5) {
    result.score -= 30
    result.reasons.push('Commentaire trop court (minimum 5 mots)')
    result.suggestions?.push('Développez votre commentaire pour partager votre expérience')
  }

  // 3. Vérification de la longueur maximale
  if (words.length > 500) {
    result.score -= 20
    result.reasons.push('Commentaire trop long (maximum 500 mots)')
    result.suggestions?.push('Raccourcissez votre commentaire en gardant l\'essentiel')
  }

  // 4. Vérification de la structure des phrases
  const structureScore = checkSentenceStructure(sentences)
  if (structureScore < 50) {
    result.score -= 25
    result.reasons.push('Structure de phrases peu claire')
    result.suggestions?.push('Utilisez des phrases complètes avec sujet et verbe')
  }

  // 5. Vérification du spam (répétitions excessives)
  const spamScore = checkSpam(words)
  if (spamScore < 70) {
    result.score -= 30
    result.reasons.push('Contenu répétitif ou spam détecté')
    result.suggestions?.push('Évitez les répétitions excessives')
  }

  // 6. Vérification de la pertinence cyclisme
  const relevanceScore = checkCyclingRelevance(cleanComment, words)
  if (relevanceScore < 30) {
    result.score -= 15
    result.reasons.push('Commentaire peu pertinent par rapport au cyclisme')
    result.suggestions?.push('Concentrez-vous sur votre expérience de la cyclosportive')
  }

  // 7. Vérification des caractères spéciaux excessifs
  const specialCharsScore = checkSpecialCharacters(comment)
  if (specialCharsScore < 70) {
    result.score -= 20
    result.reasons.push('Utilisation excessive de caractères spéciaux')
    result.suggestions?.push('Limitez l\'utilisation des caractères spéciaux et majuscules')
  }

  // Décision finale
  result.isApproved = result.score >= 60
  result.score = Math.max(0, Math.min(100, result.score))

  return result
}

function checkForbiddenWords(comment: string, words: string[]): string[] {
  const found: string[] = []
  
  FORBIDDEN_WORDS.forEach(forbiddenWord => {
    // Vérification exacte
    if (words.includes(forbiddenWord)) {
      found.push(forbiddenWord)
    }
    // Vérification avec variations (caractères spéciaux, répétitions)
    const pattern = new RegExp(forbiddenWord.split('').join('[\\*\\-\\_]*'), 'i')
    if (pattern.test(comment)) {
      found.push(forbiddenWord)
    }
  })
  
  return Array.from(new Set(found)) // Supprimer les doublons
}

function checkSentenceStructure(sentences: string[]): number {
  if (sentences.length === 0) return 0
  
  let score = 100
  let validSentences = 0
  
  sentences.forEach(sentence => {
    const words = sentence.trim().split(/\s+/)
    
    // Une phrase valide doit avoir au moins 3 mots
    if (words.length >= 3) {
      validSentences++
    }
    
    // Vérifier la présence de mots de liaison
    const hasConnectingWords = CONNECTING_WORDS.some(word => 
      sentence.toLowerCase().includes(word)
    )
    
    if (hasConnectingWords) {
      validSentences += 0.5
    }
  })
  
  const validRatio = validSentences / sentences.length
  return Math.round(validRatio * 100)
}

function checkSpam(words: string[]): number {
  if (words.length === 0) return 100
  
  // Compter les répétitions de mots
  const wordCount: { [key: string]: number } = {}
  words.forEach(word => {
    if (word.length > 2) { // Ignorer les mots très courts
      wordCount[word] = (wordCount[word] || 0) + 1
    }
  })
  
  // Calculer le score basé sur les répétitions
  let totalRepetitions = 0
  Object.values(wordCount).forEach(count => {
    if (count > 2) {
      totalRepetitions += count - 2
    }
  })
  
  const repetitionRatio = totalRepetitions / words.length
  return Math.max(0, 100 - (repetitionRatio * 200))
}

function checkCyclingRelevance(comment: string, words: string[]): number {
  let relevanceScore = 0
  
  // Vérifier la présence de mots liés au cyclisme
  CYCLING_POSITIVE_WORDS.forEach(cyclingWord => {
    if (comment.includes(cyclingWord)) {
      relevanceScore += 10
    }
  })
  
  // Bonus pour les mots techniques du cyclisme
  const technicalWords = ['km', 'kilomètre', 'dénivelé', 'montée', 'descente', 'peloton', 'groupe']
  technicalWords.forEach(word => {
    if (comment.includes(word)) {
      relevanceScore += 15
    }
  })
  
  return Math.min(100, relevanceScore)
}

function checkSpecialCharacters(comment: string): number {
  const totalChars = comment.length
  if (totalChars === 0) return 100
  
  // Compter les caractères spéciaux excessifs
  const excessiveChars = (comment.match(/[!]{2,}|[?]{2,}|[.]{3,}|[A-Z]{5,}/g) || []).length
  const capsRatio = (comment.match(/[A-Z]/g) || []).length / totalChars
  
  let score = 100
  
  // Pénaliser les caractères spéciaux excessifs
  score -= excessiveChars * 10
  
  // Pénaliser l'excès de majuscules (plus de 30%)
  if (capsRatio > 0.3) {
    score -= (capsRatio - 0.3) * 100
  }
  
  return Math.max(0, score)
}

// Fonction utilitaire pour obtenir des suggestions d'amélioration
export function getModerationSuggestions(comment: string): string[] {
  const result = moderateComment(comment)
  return result.suggestions || []
}

// Fonction pour vérifier si un commentaire nécessite une révision manuelle
export function requiresManualReview(comment: string): boolean {
  const result = moderateComment(comment)
  return result.score >= 40 && result.score < 60
}
