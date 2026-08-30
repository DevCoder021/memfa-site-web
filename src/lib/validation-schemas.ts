import { z } from "zod";

const CUID_REGEX = /^c[a-z0-9]{24}$/;

const SAFE_SHORT_TEXT = (max: number) =>
  z.string().trim().min(1, "Champ requis").max(max);

export const EmailSchema = z
  .string()
  .trim()
  .min(1, "Email requis")
  .max(255)
  .email("Format email invalide");

export const PhoneSchema = z
  .string()
  .trim()
  .max(30)
  .regex(/^[+\d\s().-]*$/, "Format telephone invalide")
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : null));

export const IdParamSchema = z.object({
  id: z.string().trim().min(1, "ID requis").max(64),
});

export const MessageCreateSchema = z.object({
  nom: SAFE_SHORT_TEXT(100),
  email: EmailSchema,
  telephone: PhoneSchema,
  message: z.string().trim().min(1, "Message requis").max(5000),
});

export const ActualiteCreateSchema = z.object({
  titre: SAFE_SHORT_TEXT(255),
  contenu: z.string().trim().min(1, "Contenu requis").max(100000),
  imageUrl: z
    .string()
    .trim()
    .max(1000)
    .url("URL image invalide")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  dateEvenement: z
    .string()
    .trim()
    .refine((v) => !v || !isNaN(Date.parse(v)), "Date invalide")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? new Date(v) : null)),
  isPublished: z.boolean().optional().default(true),
});

export const ActualiteUpdateSchema = ActualiteCreateSchema.partial();

export const AudioCreateSchema = z.object({
  titre: SAFE_SHORT_TEXT(255),
  speaker: z
    .string()
    .trim()
    .max(255)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  description: z
    .string()
    .trim()
    .max(5000)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  filePath: z.string().trim().min(1, "Fichier audio requis").max(2000),
  coverImage: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  duration: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
});

export const AudioUpdateSchema = AudioCreateSchema.partial();

export const LivreCreateSchema = z.object({
  titre: SAFE_SHORT_TEXT(255),
  auteur: z
    .string()
    .trim()
    .max(255)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  description: z
    .string()
    .trim()
    .max(5000)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  filePath: z.string().trim().min(1, "Fichier PDF requis").max(2000),
  coverImage: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
});

export const LivreUpdateSchema = LivreCreateSchema.partial();

export const LiveCreateSchema = z.object({
  titre: SAFE_SHORT_TEXT(255),
  videoUrl: z.string().trim().min(1, "URL video requise").max(1000).url("URL video invalide"),
  scheduledFor: z
    .string()
    .trim()
    .refine((v) => !v || !isNaN(Date.parse(v)), "Date invalide")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? new Date(v) : null)),
  isActive: z.boolean().optional().default(false),
});

export const LiveUpdateSchema = LiveCreateSchema.partial();

export const PasswordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis").max(256),
  newPassword: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caracteres")
    .max(256)
    .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Doit contenir au moins un chiffre"),
});

export const ProfileUpdateSchema = z.object({
  username: SAFE_SHORT_TEXT(50).regex(
    /^[a-zA-Z0-9_-]+$/,
    "Nom d'utilisateur invalide (lettres, chiffres, - et _ uniquement"
  ),
  email: EmailSchema,
});

export const MessageUpdateSchema = z.object({
  isRead: z.boolean().optional(),
  reponse: z
    .string()
    .trim()
    .max(10000)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
});
