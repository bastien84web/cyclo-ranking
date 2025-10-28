import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const user1 = await prisma.user.create({
    data: {
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      password: hashedPassword,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Marie Martin',
      email: 'marie.martin@example.com',
      password: hashedPassword,
    },
  })

  // Create sample races
  const race1 = await prisma.race.create({
    data: {
      name: 'La Marmotte',
      description: 'Une des cyclosportives les plus mythiques des Alpes, avec l\'ascension de l\'Alpe d\'Huez en point d\'orgue.',
      location: 'Bourg-d\'Oisans, Isère',
      date: new Date('2024-07-06'),
      website: 'https://www.sportcommunication.com/fr/epreuves/la-marmotte',
      createdBy: user1.id,
    },
  })

  const race2 = await prisma.race.create({
    data: {
      name: 'L\'Étape du Tour',
      description: 'Roulez sur une étape authentique du Tour de France avec les mêmes routes que les professionnels.',
      location: 'Nice, Alpes-Maritimes',
      date: new Date('2024-07-14'),
      website: 'https://www.letapedutour.com',
      createdBy: user2.id,
    },
  })

  const race3 = await prisma.race.create({
    data: {
      name: 'Paris-Roubaix Challenge',
      description: 'Découvrez les pavés mythiques de Paris-Roubaix sur cette cyclosportive légendaire.',
      location: 'Roubaix, Nord',
      date: new Date('2024-04-14'),
      website: 'https://www.paris-roubaix-challenge.com',
      createdBy: user1.id,
    },
  })

  // Create sample votes
  await prisma.vote.create({
    data: {
      userId: user2.id,
      raceId: race1.id,
      accommodationAvailability: 4,
      parkingAvailability: 3,
      startFinishDistance: 5,
      foodQuality: 5,
      foodQuantity: 4,
      foodConviviality: 5,
      safety: 4,
      signage: 5,
      traffic: 3,
      scenery: 5,
      routeVariety: 4,
      priceValue: 3,
    },
  })

  await prisma.vote.create({
    data: {
      userId: user1.id,
      raceId: race2.id,
      accommodationAvailability: 5,
      parkingAvailability: 4,
      startFinishDistance: 4,
      foodQuality: 4,
      foodQuantity: 4,
      foodConviviality: 4,
      safety: 5,
      signage: 5,
      traffic: 4,
      scenery: 5,
      routeVariety: 5,
      priceValue: 4,
    },
  })

  console.log('Données d\'exemple créées avec succès!')
  console.log('Utilisateurs de test:')
  console.log('- jean.dupont@example.com / password123')
  console.log('- marie.martin@example.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
