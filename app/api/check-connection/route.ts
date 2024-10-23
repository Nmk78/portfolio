import { NextResponse } from 'next/server'
import { checkDatabaseConnection } from '@/lib/db'

export async function GET() {
  try {
    const isConnected = await checkDatabaseConnection()
    if (isConnected) {
      return NextResponse.json({ status: 'success', message: 'Database connection successful' })
    } else {
      return NextResponse.json({ status: 'error', message: 'Failed to connect to the database' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error checking database connection:', error)
    return NextResponse.json({ status: 'error', message: 'An error occurred while checking the database connection' }, { status: 500 })
  }
}