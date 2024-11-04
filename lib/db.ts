import { prisma } from './prisma'


export async function checkDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log('Successfully connected to the database')
    return true
  } catch (error) {
    console.error('Failed to connect to the database:', error)
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// export { prisma }