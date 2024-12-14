import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'

export default function Signup() {
  async function handleSignup(formData: FormData) {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      throw new Error("Passwords don't match")
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        throw new Error('User already exists')
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      })

      redirect('/login')
    } catch (error) {
      console.error('Signup error:', error)
      // Here you would typically set an error state and display it to the user
      // For now, we'll just throw the error
      throw error
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form action={handleSignup} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-4">
          Sign Up
        </button>
      </form>
    </div>
  )
}

