"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { useState } from "react";
import { createPostAction, updatePostAction } from "@/lib/actions/posts";
import type { ActionState } from "@/lib/actions/auth";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/auth/submit-button";
import { MediaDropzone, type MediaItem } from "@/components/posts/media-dropzone";
import { inferMediaType } from "@/lib/media";

const initialState: ActionState = {};

const POST_TYPE_OPTIONS = [
  { value: "feed", label: "Feed" },
  { value: "carousel", label: "Carrossel" },
  { value: "reel", label: "Reels" },
  { value: "story", label: "Story" },
];

type InstagramAccountOption = { id: string; ig_username: string };

type PostFormProps = {
  accounts: InstagramAccountOption[];
  post?: {
    id: string;
    post_type: string;
    caption: string | null;
    hashtags: string[];
    media_urls: string[];
    scheduled_at: string;
    account_id: string | null;
  };
};

function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function PostForm({ accounts, post }: PostFormProps) {
  const action = post
    ? updatePostAction.bind(null, post.id)
    : createPostAction;
  const [state, formAction] = useFormState(action, initialState);

  const [caption, setCaption] = useState(post?.caption ?? "");
  const [media, setMedia] = useState<MediaItem[]>(
    (post?.media_urls ?? []).map((url) => ({
      url,
      path: url,
      type: inferMediaType(url),
    }))
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <input type="hidden" name="mediaUrls" value={JSON.stringify(media.map((m) => m.url))} />

      {state.error && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="postType">Tipo de post</Label>
        <Select name="postType" defaultValue={post?.post_type ?? "feed"}>
          <SelectTrigger id="postType">
            <SelectValue placeholder="Escolha o tipo" />
          </SelectTrigger>
          <SelectContent>
            {POST_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Mídia</Label>
        <MediaDropzone value={media} onChange={setMedia} />
        {state.fieldErrors?.mediaUrls && (
          <p className="text-sm text-destructive">{state.fieldErrors.mediaUrls[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="caption">Legenda</Label>
          <span className="text-xs text-muted-foreground">
            {caption.length}/2200
          </span>
        </div>
        <Textarea
          id="caption"
          name="caption"
          rows={5}
          maxLength={2200}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Escreva a legenda do seu post..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hashtags">Hashtags</Label>
        <Input
          id="hashtags"
          name="hashtags"
          placeholder="marketing instagram social"
          defaultValue={post?.hashtags?.join(" ") ?? ""}
        />
        <p className="text-xs text-muted-foreground">
          Separe por espaço ou vírgula — o # é adicionado automaticamente.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="scheduledAt">Data e hora</Label>
          <Input
            id="scheduledAt"
            name="scheduledAt"
            type="datetime-local"
            defaultValue={post ? toDatetimeLocal(post.scheduled_at) : ""}
            required
          />
          {state.fieldErrors?.scheduledAt && (
            <p className="text-sm text-destructive">{state.fieldErrors.scheduledAt[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountId">Conta do Instagram</Label>
          {accounts.length > 0 ? (
            <Select name="accountId" defaultValue={post?.account_id ?? undefined}>
              <SelectTrigger id="accountId">
                <SelectValue placeholder="Selecione uma conta" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    @{acc.ig_username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="rounded-md border border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
              Nenhuma conta conectada ainda. Você pode salvar como rascunho e{" "}
              <Link href="/settings/accounts" className="underline underline-offset-2 hover:text-foreground">
                conectar uma conta do Instagram
              </Link>{" "}
              depois.
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <SubmitButton name="status" value="scheduled" className="flex-1">
          Agendar post
        </SubmitButton>
        <SubmitButton
          name="status"
          value="draft"
          variant="outline"
          className="flex-1"
          pendingText="Salvando..."
        >
          Salvar rascunho
        </SubmitButton>
      </div>
    </form>
  );
}
