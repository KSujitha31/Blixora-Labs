import { createFileRoute } from '@tanstack/react-router'
import { db } from '../../../db/index.js'
import { simulations } from '../../../db/schema.js'
import { getUser } from '@netlify/identity'
import { eq, ilike, or } from 'drizzle-orm'

export const Route = createFileRoute('/api/simulations')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const search = url.searchParams.get('search') || ''
        const level = url.searchParams.get('level') || ''

        let query = db.select().from(simulations).$dynamic()

        if (level) {
          query = query.where(eq(simulations.level, level))
        } else if (search) {
          query = query.where(
            or(
              ilike(simulations.title, `%${search}%`),
              ilike(simulations.category, `%${search}%`),
            )
          )
        }

        const results = await query
        return Response.json(results)
      },

      POST: async ({ request }) => {
        const user = await getUser()
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
        if (!user.roles?.includes('admin')) return Response.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        if (!body.title || !body.category || !body.level || !body.duration) {
          return Response.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const [sim] = await db.insert(simulations).values({
          title: body.title,
          category: body.category,
          level: body.level,
          duration: body.duration,
          description: body.description || '',
        }).returning()

        return Response.json(sim, { status: 201 })
      },
    },
  },
})
