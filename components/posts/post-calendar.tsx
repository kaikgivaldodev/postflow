"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import { deletePostAction, reschedulePostAction } from "@/lib/actions/posts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

type PostEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  postType: string;
  caption: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  draft: "Rascunho",
  scheduled: "Agendado",
  published: "Publicado",
  failed: "Falhou",
};

const POST_TYPE_LABEL: Record<string, string> = {
  feed: "Feed",
  story: "Story",
  reel: "Reels",
  carousel: "Carrossel",
};

export function PostCalendar({
  posts,
}: {
  posts: {
    id: string;
    post_type: string;
    caption: string | null;
    scheduled_at: string;
    status: string;
  }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [view, setView] = useState<View>("month");
  const [selected, setSelected] = useState<PostEvent | null>(null);

  const events: PostEvent[] = useMemo(
    () =>
      posts.map((post) => {
        const start = new Date(post.scheduled_at);
        return {
          id: post.id,
          title: `${POST_TYPE_LABEL[post.post_type] ?? post.post_type}${
            post.caption ? ` — ${post.caption.slice(0, 30)}` : ""
          }`,
          start,
          end: new Date(start.getTime() + 30 * 60 * 1000),
          status: post.status,
          postType: post.post_type,
          caption: post.caption,
        };
      }),
    [posts]
  );

  function handleEventDrop({
    event,
    start,
  }: {
    event: object;
    start: string | Date;
  }) {
    startTransition(async () => {
      await reschedulePostAction(
        (event as PostEvent).id,
        new Date(start).toISOString()
      );
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deletePostAction(id);
      setSelected(null);
      router.refresh();
    });
  }

  return (
    <div className="h-[70vh] rounded-lg border border-border bg-card p-4">
      <DnDCalendar
        localizer={localizer}
        culture="pt-BR"
        events={events}
        startAccessor={(event: object) => (event as PostEvent).start}
        endAccessor={(event: object) => (event as PostEvent).end}
        view={view}
        onView={setView}
        views={["month", "week", "day"]}
        style={{ height: "100%" }}
        messages={{
          month: "Mês",
          week: "Semana",
          day: "Dia",
          today: "Hoje",
          previous: "Anterior",
          next: "Próximo",
          noEventsInRange: "Nenhum post neste período.",
        }}
        eventPropGetter={(event: object) => ({
          style: {
            backgroundColor:
              (event as PostEvent).status === "draft"
                ? "hsl(240 5% 64%)"
                : "hsl(239 84% 67%)",
            borderRadius: "4px",
            opacity: isPending ? 0.6 : 1,
          },
        })}
        onSelectEvent={(event: object) => setSelected(event as PostEvent)}
        onEventDrop={handleEventDrop}
        draggableAccessor={() => true}
        resizable={false}
      />

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent>
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{POST_TYPE_LABEL[selected.postType] ?? selected.postType}</SheetTitle>
                <SheetDescription asChild>
                  <div className="space-y-3 pt-2 text-left">
                    <Badge variant="secondary">
                      {STATUS_LABEL[selected.status] ?? selected.status}
                    </Badge>
                    <p className="text-sm text-foreground">
                      {selected.caption || "Sem legenda"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selected.start.toLocaleString("pt-BR", {
                        dateStyle: "long",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 flex gap-3">
                <Button asChild className="flex-1">
                  <Link href={`/posts/${selected.id}`}>Editar</Link>
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDelete(selected.id)}
                  disabled={isPending}
                >
                  Excluir
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
