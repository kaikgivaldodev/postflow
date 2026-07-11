import {
  createImageContainer,
  createVideoContainer,
  createStoryImageContainer,
  createCarouselContainer,
  getContainerStatus,
} from "@/lib/meta-api/media";
import { inferMediaType } from "@/lib/media";

export type PostType = "feed" | "story" | "reel" | "carousel";

export type BuildContainerInput = {
  igUserId: string;
  pageAccessToken: string;
  postType: PostType;
  caption: string;
  mediaUrls: string[];
};

export type ContainerCreationResult =
  | { kind: "ready"; containerId: string }
  | { kind: "pending"; childContainerIds: string[] };

export async function startContainerCreation(
  input: BuildContainerInput
): Promise<ContainerCreationResult> {
  const { igUserId, pageAccessToken, postType, caption, mediaUrls } = input;

  if (postType === "carousel") {
    if (mediaUrls.length < 2) {
      throw new Error("Carrossel precisa de pelo menos 2 mídias.");
    }
    const childContainerIds: string[] = [];
    for (const url of mediaUrls) {
      const type = inferMediaType(url);
      const child =
        type === "video"
          ? await createVideoContainer(igUserId, pageAccessToken, {
              videoUrl: url,
              mediaType: "VIDEO",
              isCarouselItem: true,
            })
          : await createImageContainer(igUserId, pageAccessToken, {
              imageUrl: url,
              isCarouselItem: true,
            });
      childContainerIds.push(child.id);
    }
    return advancePendingCarousel(igUserId, pageAccessToken, childContainerIds, caption);
  }

  const mediaUrl = mediaUrls[0];
  if (!mediaUrl) throw new Error("Nenhuma mídia informada para o post.");
  const type = inferMediaType(mediaUrl);

  if (postType === "reel") {
    if (type !== "video") {
      throw new Error("Reels exige um vídeo — a mídia enviada não é um vídeo.");
    }
    const container = await createVideoContainer(igUserId, pageAccessToken, {
      videoUrl: mediaUrl,
      caption,
      mediaType: "REELS",
    });
    return { kind: "ready", containerId: container.id };
  }

  if (postType === "story") {
    const container =
      type === "video"
        ? await createVideoContainer(igUserId, pageAccessToken, {
            videoUrl: mediaUrl,
            mediaType: "STORIES",
          })
        : await createStoryImageContainer(igUserId, pageAccessToken, { imageUrl: mediaUrl });
    return { kind: "ready", containerId: container.id };
  }

  // feed
  const container =
    type === "video"
      ? await createVideoContainer(igUserId, pageAccessToken, {
          videoUrl: mediaUrl,
          caption,
          mediaType: "VIDEO",
        })
      : await createImageContainer(igUserId, pageAccessToken, {
          imageUrl: mediaUrl,
          caption,
        });
  return { kind: "ready", containerId: container.id };
}

// Carrossel com vídeo: os containers filhos precisam chegar a FINISHED antes
// de criar o container pai do carrossel.
export async function advancePendingCarousel(
  igUserId: string,
  pageAccessToken: string,
  childContainerIds: string[],
  caption: string
): Promise<ContainerCreationResult> {
  const statuses = await Promise.all(
    childContainerIds.map((id) => getContainerStatus(id, pageAccessToken))
  );

  if (statuses.some((s) => s.statusCode === "ERROR" || s.statusCode === "EXPIRED")) {
    throw new Error("Falha ao processar uma das mídias do carrossel.");
  }

  if (statuses.every((s) => s.statusCode === "FINISHED" || s.statusCode === "PUBLISHED")) {
    const parent = await createCarouselContainer(igUserId, pageAccessToken, {
      childrenContainerIds: childContainerIds,
      caption,
    });
    return { kind: "ready", containerId: parent.id };
  }

  return { kind: "pending", childContainerIds };
}
