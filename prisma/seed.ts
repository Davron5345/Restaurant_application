// run this using npx ts-node prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const phone = '998901234567';
  const plainPassword = phone.slice(-4);
  const password = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: {
      phone,
      password,
      role: 'ADMIN',
    },
  })

  console.log('Seeded super admin:', admin.phone, 'password:', plainPassword);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
