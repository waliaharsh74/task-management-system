import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Welcome to Task Manager</h1>
        <p className="mb-4">Manage your tasks efficiently with our powerful task management system.</p>
        <div className="flex space-x-4">
          <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Login
          </Link>
          <Link href="/signup" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

