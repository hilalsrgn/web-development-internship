// Bir kullanıcıyı admin yapmak için küçük yardımcı script.
// Kullanım: node scripts/set-admin-role.mjs kullanici@ornek.com
//
// Neden ayrı bir script? Admin paneli henüz yokken (Gün 3'e kadar) ilk admin
// hesabını oluşturabilmek için manuel bir yola ihtiyaç var.

import mongoose from "mongoose";
import dns from "dns";
import { config } from "dotenv";

config({ path: ".env.local" });

// src/lib/db.ts içindeki DNS notuyla aynı sebep: bu makinede Node'un iç DNS
// çözücüsü mongodb+srv:// adreslerindeki SRV sorgusunu çözemiyor.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const email = process.argv[2];

if (!email) {
  console.error("Kullanım: node scripts/set-admin-role.mjs kullanici@ornek.com");
  process.exit(1);
}

const userSchema = new mongoose.Schema(
  { email: String, role: String },
  { strict: false }
);
const User = mongoose.models.User || mongoose.model("User", userSchema);

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI .env.local içinde tanımlı değil.");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { role: "admin" },
    { returnDocument: "after" }
  );

  if (!user) {
    console.error(`"${email}" adresine sahip kullanıcı bulunamadı.`);
  } else {
    console.log(`${user.email} artık admin.`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
