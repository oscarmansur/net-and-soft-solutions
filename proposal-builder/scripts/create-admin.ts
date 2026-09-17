import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../src/lib/security";

const prisma = new PrismaClient();

async function run() {
  const email = process.argv[2] || process.env.INITIAL_ADMIN_EMAIL;
  const password = process.argv[3] || process.env.INITIAL_ADMIN_PASSWORD;
  const name = process.argv[4] || "Administrador Net & Soft";

  if (!email || !password) {
    console.error("❌ Error: Debes especificar email y contraseña: npx tsx scripts/create-admin.ts <email> <password> [name]");
    process.exit(1);
  }

  console.log(`👤 Creating/updating admin user: ${email}...`);

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      role: Role.ADMIN,
      passwordHash,
      failedLoginAttempts: 0,
      lockedUntil: null,
      isActive: true,
    },
    create: {
      email,
      name,
      role: Role.ADMIN,
      passwordHash,
      isActive: true,
    },
  });

  console.log(`✅ Admin user successfully configured:`);
  console.log(`   ID:    ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Role:  ${user.role}`);
}

run()
  .catch((e) => {
    console.error("❌ Failed to create admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
