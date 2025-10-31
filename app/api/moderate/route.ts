import { NextRequest, NextResponse } from 'next/server'
import { moderateComment } from '@/lib/moderation'
import { z } from 'zod'

const moderationSchema = z.object({
  comment: z.string().min(1, 'Le commentaire ne peut pas être vide'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { comment } = moderationSchema.parse(body)

    const moderationResult = moderateComment(comment)

    return NextResponse.json({
      isApproved: moderationResult.isApproved,
      score: moderationResult.score,
      reasons: moderationResult.reasons,
      suggestions: moderationResult.suggestions,
      requiresManualReview: moderationResult.score >= 40 && moderationResult.score < 60
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la modération' },
      { status: 500 }
    )
  }
}
