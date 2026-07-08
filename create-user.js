import bcrypt from 'bcrypt'
import prisma from './src/lib/prisma.js'

async function main() {
  const [,, username, password, role] = process.argv

  if (!username || !password) {
    console.error('Usage: node create-user.js <username> <password> [role]')
    process.exit(1)
  }

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      username,
      password: hashed,
      role: role || 'isAdmin'
    }
  })

  console.log('Created user:', user)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
