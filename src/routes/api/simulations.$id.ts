import { createFileRoute } from '@tanstack/react-router'
import { db } from '../../../db/index.js'
import { simulations } from '../../../db/schema.js'
import { getUser } from '@netlify/identity'
import { eq } from 'drizzle-orm'

export const Route = createFileRoute('/api/simulations/$id')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const [sim] = await db.select().from(simulations).where(eq(simulations.id, Number(params.id)))
        if (!sim) return Response.json({ error: 'Not found' }, { status: 404 })
        return Response.json(sim)
      },

      PUT: async ({ request, params }) => {
        const user = await getUser()
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
        if (!user.roles?.includes('admin')) return Response.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const [sim] = await db.update(simulations)
          .set({
            title: body.title,
            category: body.category,
            level: body.level,
            duration: body.duration,
            description: body.description,
          })
          .where(eq(simulations.id, Number(params.id)))
          .returning()

        if (!sim) return Response.json({ error: 'Not found' }, { status: 404 })
        return Response.json(sim)
      },

      DELETE: async ({ params }) => {
        const user = await getUser()
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
        if (!user.roles?.includes('admin')) return Response.json({ error: 'Forbidden' }, { status: 403 })

        await db.delete(simulations).where(eq(simulations.id, Number(params.id)))
        return new Response(null, { status: 204 })
      },
    },
  },
})
