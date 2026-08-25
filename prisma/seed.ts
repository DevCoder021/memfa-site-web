import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const hashed = await bcrypt.hash("CHANGE_MOI", 10);

  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {
      email: "admin@memfa.org",
      password: hashed,
    },
    create: {
      username: "admin",
      email: "admin@memfa.org",
      password: hashed,
    },
  });

  console.log("Admin créé :", admin.username, "/ mot de passe: CHANGE_MOI");
}

main()
  .catch((e) => console.error("Erreur :", e))
  .finally(() => prisma.$disconnect());