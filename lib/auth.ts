import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from './prisma'

const secretKey = process.env.JWT_SECRET_KEY!
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
}

export async function decrypt(token: string): Promise<any> {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ['HS256'],
  })
  return payload
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('User not found')

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) throw new Error('Invalid password')

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ user: { id: user.id, email: user.email }, expires })

  const cookieStore = await cookies()
  cookieStore.set('session', session, { expires, httpOnly: true })
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set('session', '', { expires: new Date(0) })
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) return null
  return await decrypt(session)
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  if (!session) return

  const parsed = await decrypt(session)
  parsed.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  })
  return res
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword)
}

export async function verifyAuth(token: string) {
  try {
    const verified = await decrypt(token);
    return verified;
  } catch (err) {
    console.error('Error verifying token:', err);
    return null;
  }
}

