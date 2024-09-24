import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
      }
}>();

userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL, }).$extends(withAccelerate()) 
  try {
    const { email, name, phoneNumber, password } = await c.req.json()
    // needs to be done in zod
    // if (!email || !password || phoneNumber.length !== 10) {
    //   return c.json({ error: 'Invalid input data' }, 400)
    // }
    const existingUser = await prisma.user.findUnique({
        where: { email },
      })
      if (existingUser) {
        return c.json({ error: 'Email linked to another account' }, 400)
      }
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        phoneNumber,
        password,
      },
    })

    return c.json(newUser, 201)
  } catch (error) {
    console.error('Error adding user:', error)
    return c.json({ error: 'Error adding user' }, 500)
  }
})

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL, }).$extends(withAccelerate())
    try {
      const { email, password } = await c.req.json()
      // needs to be done in zod
    //   if (!email || !password) {
    //     return c.json({ error: 'Invalid input data' }, 400)
    //   }
      // Verify the user with email and password
      const user = await prisma.user.findUnique({
        where: {
          email,
          password,
        },
      })
      if (!user) {
        c.status(403)
        return c.json({
          message: 'unauthorized access',
        })
      }

      return c.json(user, 200)
    } catch (error) {
      console.error('Error adding user:', error)
      return c.json({ error: 'Error adding user' }, 500)
    }
  })
  