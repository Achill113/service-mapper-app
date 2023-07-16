import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const internalTenant = await prisma.tenant.upsert({
    where: {
      name: 'internal'
    },
    update: {},
    create: {
      name: 'internal'
    },
  });
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
