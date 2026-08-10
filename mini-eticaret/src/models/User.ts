import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema>;

// Next.js geliştirme modunda dosya her değiştiğinde yeniden çalıştığı için,
// mongoose.models içinde model zaten varsa tekrar tanımlamıyoruz.
// Aksi halde "Cannot overwrite model" hatası alınır.
export const User: Model<UserDoc> =
  mongoose.models.User || mongoose.model<UserDoc>("User", userSchema);
