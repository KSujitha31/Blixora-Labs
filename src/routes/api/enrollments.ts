import { createFileRoute } from '@tanstack/react-router'
import { db } from '../../../db/index.js'
import { enrollments, simulations } from '../../../db/schema.js'
import { getUser } from '@netlify/identity'
import { eq, and } from 'drizzle-orm'

export const Route = createFileRoute('/api/enrollments')({
  server: {
    handlers: {
      GET: async () => {
        const user = await getUser()
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

        const results = await db
          .select({
            id: enrollments.id,
            userId: enrollments.userId,
            simulationId: enrollments.simulationId,
            status: enrollments.status,
            enrolledAt: enrollments.enrolledAt,
            simulation: {
              id: simulations.id,
              title: simulations.title,
              category: simulations.category,
              level: simulations.level,
              duration: simulations.duration,
              description: simulations.description,
            },
          })
          .from(enrollments)
          .innerJoin(simulations, eq(enrollments.simulationId, simulations.id))
          .where(eq(enrollments.userId, user.id))

        return Response.json(results)
      },

      POST: async ({ request }) => {
        const user = await getUser()
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        if (!body.simulationId) return Response.json({ error: 'simulationId required' }, { status: 400 })

        const existing = await db.select().from(enrollments).where(
          and(
            eq(enrollments.userId, user.id),
            eq(enrollments.simulationId, Number(body.simulationId)),
          )
        )

        if (existing.length > 0) {
          return Response.json({ error: 'Already enrolled' }, { status: 409 })
        }

        const [enrollment] = await db.insert(enrollments).values({
          userId: user.id,
          simulationId: Number(body.simulationId),
          status: 'enrolled',
        }).returning()

        return Response.json(enrollment, { status: 201 })
      },
    },
  },
})
