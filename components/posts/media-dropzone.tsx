"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type MediaItem = {
  url: string;
  path: string;
  type: "image" | "video";
};

export function MediaDropzone({
  value,
  onChange,
}: {
  value: MediaItem[];
  onChange: (items: MediaItem[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      setUploading(true);
      const supabase = createClient();

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Sessão expirada");

        const uploaded: MediaItem[] = [];
        for (const file of acceptedFiles) {
          const ext = file.name.split(".").pop();
          const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from("post-media")
            .upload(path, file);

          if (uploadError) throw uploadError;

          const { data: publicUrl } = supabase.storage
            .from("post-media")
            .getPublicUrl(path);

          uploaded.push({
            url: publicUrl.publicUrl,
            path,
            type: file.type.startsWith("video") ? "video" : "image",
          });
        }

        onChange([...value, ...uploaded]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao enviar a mídia."
        );
      } finally {
        setUploading(false);
      }
    },
    [value, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
    multiple: true,
  });

  function removeItem(path: string) {
    onChange(value.filter((item) => item.path !== path));
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong bg-secondary/30 px-6 py-10 text-center transition-colors",
          isDragActive && "border-primary bg-primary/5"
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          <UploadCloud className="h-6 w-6 text-muted-foreground" />
        )}
        <p className="text-sm text-muted-foreground">
          Arraste imagens/vídeos aqui ou clique para selecionar
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((item) => (
            <div
              key={item.path}
              className="group relative aspect-square overflow-hidden rounded-md border border-border bg-secondary"
            >
              {item.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <video src={item.url} className="h-full w-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => removeItem(item.path)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remover mídia"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export type { MediaItem };
