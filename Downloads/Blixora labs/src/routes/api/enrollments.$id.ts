import { createFileRoute } from '@tanstack/react-router'
import { db } from '../../../db/index.js'
import { enrollments } from '../../../db/schema.js'
import { getUser } from '@netlify/identity'
import { eq, and } from 'drizzle-orm'

export const Route = createFileRoute('/api/enrollments/$id')({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const user = await getUser()
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const validStatuses = ['enrolled', 'in_progress', 'completed']
        if (!validStatuses.includes(body.status)) {
          return Response.json({ error: 'Invalid status' }, { status: 400 })
        }

        const where = user.roles?.includes('admin')
          ? eq(enrollments.id, Number(params.id))
          : and(eq(enrollments.id, Number(params.id)), eq(enrollments.userId, user.id))

        const [updated] = await db.update(enrollments)
          .set({ status: body.status })
          .where(where)
          .returning()

        if (!updated) return Response.json({ error: 'Not found' }, { status: 404 })
        return Response.json(updated)
      },

      DELETE: async ({ params }) => {
        const user = await getUser()
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

        const where = user.roles?.includes('admin')
          ? eq(enrollments.id, Number(params.id))
          : and(eq(enrollments.id, Number(params.id)), eq(enrollments.userId, user.id))

        await db.delete(enrollments).where(where)
        return new Response(null, { status: 204 })
      },
    },
  },
})
