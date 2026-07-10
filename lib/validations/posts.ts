import { z } from "zod";

export const POST_TYPES = ["feed", "carousel", "reel", "story"] as const;

export const postSchema = z.object({
  postType: z.enum(POST_TYPES),
  caption: z.string().max(2200, "A legenda pode ter no máximo 2.200 caracteres").default(""),
  hashtags: z.string().default(""),
  mediaUrls: z.array(z.string().url()).min(1, "Adicione ao menos uma mídia"),
  scheduledAt: z.string().min(1, "Escolha data e hora"),
  accountId: z.string().uuid().optional().or(z.literal("")),
  status: z.enum(["draft", "scheduled"]).default("scheduled"),
});

export type PostInput = z.infer<typeof postSchema>;

export function parseHashtags(raw: string): string[] {
  return raw
    .split(/[\s,]+/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
}
