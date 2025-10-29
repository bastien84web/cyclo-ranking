import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function POST() {
  let prisma: PrismaClient | null = null
  
  try {
    // Créer une nouvelle instance Prisma
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })

    console.log('🔄 Connexion à la base de données...')
    
    // Test de connexion
    await prisma.$connect()
    console.log('✅ Connexion réussie')

    // Supprimer toutes les données existantes
    console.log('🗑️ Suppression des données existantes...')
    await prisma.vote.deleteMany()
    await prisma.race.deleteMany()
    await prisma.user.deleteMany()
    console.log('✅ Données supprimées')

    // Créer l'utilisateur admin
    console.log('👤 Création de l\'utilisateur admin...')
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@cycloranking.com',
        name: 'Administrateur',
        password: hashedPassword,
        emailVerified: new Date(),
      }
    })
    console.log('✅ Admin créé:', admin.email)

    // Créer quelques courses de test
    console.log('🚴 Création de courses de test...')
    const testRaces = [
      {
        name: "La Marmotte",
        description: "L'une des cyclosportives les plus prestigieuses des Alpes. 4 cols mythiques : Glandon, Télégraphe, Galibier et Alpe d'Huez.",
        location: "Bourg d'Oisans, France",
        date: new Date('2025-07-05'),
        distance: "174 km",
        website: "https://www.lamarmotte.fr",
        createdBy: admin.id
      },
      {
        name: "L'Étape du Tour",
        description: "Revivez l'expérience du Tour de France sur une étape mythique. Parcours exigeant avec montées légendaires.",
        location: "Alpe d'Huez, France",
        date: new Date('2025-07-13'),
        distance: "138 km",
        website: "https://www.letapedutour.com",
        createdBy: admin.id
      },
      {
        name: "L'Ardéchoise",
        description: "La plus grande cyclosportive de France ! Découvrez les routes sinueuses et les paysages sauvages de l'Ardèche.",
        location: "Saint-Félicien, Ardèche",
        date: new Date('2025-06-14'),
        distance: "145 km",
        website: "https://www.ardechoise.com",
        createdBy: admin.id
      }
    ]

    for (const raceData of testRaces) {
      await prisma.race.create({ data: raceData })
    }
    console.log('✅ Courses de test créées')

    // Vérification finale
    const userCount = await prisma.user.count()
    const raceCount = await prisma.race.count()
    
    console.log(`📊 Résultat final: ${userCount} utilisateurs, ${raceCount} courses`)

    return NextResponse.json({
      success: true,
      message: 'Base de données réinitialisée avec succès',
      data: {
        users: userCount,
        races: raceCount,
        adminEmail: 'admin@cycloranking.com'
      }
    })

  } catch (error) {
    console.error('❌ Erreur reset-db:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la réinitialisation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
    
  } finally {
    if (prisma) {
      await prisma.$disconnect()
      console.log('🔌 Connexion fermée')
    }
  }
}
