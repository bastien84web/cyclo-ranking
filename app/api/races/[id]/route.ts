import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

export async function PATCH(
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

    const body = await request.json()
    const { 
      name, 
      description, 
      location, 
      date, 
      distance, 
      website, 
      logoUrl, 
      imageUrl 
    } = body

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
    
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (location !== undefined) updateData.location = location
    if (date !== undefined) updateData.date = new Date(date)
    if (distance !== undefined) updateData.distance = distance
    if (website !== undefined) updateData.website = website || null
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl || null
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null

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
