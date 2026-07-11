"use client";

import { useState, useTransition } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { disconnectInstagramAccountAction } from "@/lib/actions/instagram";

type Account = {
  id: string;
  ig_username: string;
  profile_picture_url: string | null;
  created_at: string;
};

export function AccountCard({ account }: { account: Account }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDisconnect() {
    setError(null);
    startTransition(async () => {
      const result = await disconnectInstagramAccountAction(account.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
    });
  }

  return (
    <li className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={account.profile_picture_url ?? undefined} alt={account.ig_username} />
          <AvatarFallback>{account.ig_username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <p className="text-sm font-medium">@{account.ig_username}</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Desconectar
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desconectar @{account.ig_username}?</DialogTitle>
            <DialogDescription>
              Posts já agendados para esta conta ficarão sem conta vinculada e não serão
              publicados até você reconectar ou trocar a conta do post.
            </DialogDescription>
          </DialogHeader>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDisconnect} disabled={isPending}>
              {isPending ? "Desconectando..." : "Desconectar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
}
