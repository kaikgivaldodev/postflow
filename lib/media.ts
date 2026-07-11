export function inferMediaType(url: string): "image" | "video" {
  return /\.(mp4|mov|webm)$/i.test(url) ? "video" : "image";
}
