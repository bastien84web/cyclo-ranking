import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

const prisma = new PrismaClient()

const updateRaceSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
  description: z.string().optional(),
  location: z.string().min(2, 'La localisation est requise').optional(),
  date: z.string().transform((str) => new Date(str)).optional(),
  distance: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    // Vérifier que l'utilisateur est connecté
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour modifier une course' },
        { status: 401 }
      )
    }

    // Vérifier que l'utilisateur existe dans la base de données
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = updateRaceSchema.parse(body)

    // Vérifier que la course existe
    const existingRace = await prisma.race.findUnique({
      where: { id: params.id }
    })

    if (!existingRace) {
      return NextResponse.json(
        { error: 'Course non trouvée' },
        { status: 404 }
      )
    }

    // Préparer les données à mettre à jour (seulement les champs fournis)
    const updateData: any = {}
    
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.location !== undefined) updateData.location = validatedData.location
    if (validatedData.date !== undefined) updateData.date = validatedData.date
    if (validatedData.distance !== undefined) updateData.distance = validatedData.distance
    if (validatedData.website !== undefined) updateData.website = validatedData.website || null
    if (validatedData.logoUrl !== undefined) updateData.logoUrl = validatedData.logoUrl || null
    if (validatedData.imageUrl !== undefined) updateData.imageUrl = validatedData.imageUrl || null

    // Mettre à jour la course
    const updatedRace = await prisma.race.update({
      where: { id: params.id },
      data: updateData,
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(updatedRace)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Erreur lors de la mise à jour de la course:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    // Vérifier que l'utilisateur est connecté et est admin
    if (!session?.user?.email || session.user.email !== 'admin@cycloranking.com') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Vérifier que la course existe
    const existingRace = await prisma.race.findUnique({
      where: { id: params.id }
    })

    if (!existingRace) {
      return NextResponse.json(
        { error: 'Course non trouvée' },
        { status: 404 }
      )
    }

    // Supprimer d'abord tous les votes associés
    await prisma.vote.deleteMany({
      where: { raceId: params.id }
    })

    // Puis supprimer la course
    await prisma.race.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Course supprimée avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de la course:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
