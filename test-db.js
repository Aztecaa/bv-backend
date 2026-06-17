import prisma from "./src/lib/prisma.js";

try {
  await prisma.$connect();

  console.log("✅ DB CONNECTED");

  const users = await prisma.user.findMany();

  console.log(users);

} catch (err) {
  console.error(err);

} finally {
  await prisma.$disconnect();
}