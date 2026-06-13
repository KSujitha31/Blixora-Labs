import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const simulations = pgTable('simulations', {
  id: serial().primaryKey(),
  title: text().notNull(),
  category: text().notNull(),
  level: text().notNull(), // beginner, intermediate, advanced
  duration: text().notNull(), // e.g. "2h 30m"
  description: text().notNull().default(''),
  createdAt: timestamp('created_at').defaultNow(),
})

export const enrollments = pgTable('enrollments', {
  id: serial().primaryKey(),
  userId: text('user_id').notNull(),
  simulationId: integer('simulation_id')
    .notNull()
    .references(() => simulations.id, { onDelete: 'cascade' }),
  status: text().notNull().default('enrolled'), // enrolled, in_progress, completed
  enrolledAt: timestamp('enrolled_at').defaultNow(),
})
