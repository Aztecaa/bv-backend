import dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first')

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma