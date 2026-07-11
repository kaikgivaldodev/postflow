import { graphFetch } from "@/lib/meta-api/client";

export async function createImageContainer(
  igUserId: string,
  pageAccessToken: string,
  opts: { imageUrl: string; caption?: string; isCarouselItem?: boolean }
): Promise<{ id: string }> {
  return graphFetch<{ id: string }>(`/${igUserId}/media`, {
    method: "POST",
    params: {
      image_url: opts.imageUrl,
      ...(opts.caption ? { caption: opts.caption } : {}),
      ...(opts.isCarouselItem ? { is_carousel_item: "true" } : {}),
      access_token: pageAccessToken,
    },
  });
}

export async function createVideoContainer(
  igUserId: string,
  pageAccessToken: string,
  opts: {
    videoUrl: string;
    caption?: string;
    mediaType: "REELS" | "STORIES" | "VIDEO";
    isCarouselItem?: boolean;
  }
): Promise<{ id: string }> {
  return graphFetch<{ id: string }>(`/${igUserId}/media`, {
    method: "POST",
    params: {
      video_url: opts.videoUrl,
      media_type: opts.mediaType,
      ...(opts.caption ? { caption: opts.caption } : {}),
      ...(opts.isCarouselItem ? { is_carousel_item: "true" } : {}),
      access_token: pageAccessToken,
    },
  });
}

export async function createStoryImageContainer(
  igUserId: string,
  pageAccessToken: string,
  opts: { imageUrl: string }
): Promise<{ id: string }> {
  return graphFetch<{ id: string }>(`/${igUserId}/media`, {
    method: "POST",
    params: {
      image_url: opts.imageUrl,
      media_type: "STORIES",
      access_token: pageAccessToken,
    },
  });
}

export async function createCarouselContainer(
  igUserId: string,
  pageAccessToken: string,
  opts: { childrenContainerIds: string[]; caption?: string }
): Promise<{ id: string }> {
  return graphFetch<{ id: string }>(`/${igUserId}/media`, {
    method: "POST",
    params: {
      media_type: "CAROUSEL",
      children: opts.childrenContainerIds.join(","),
      ...(opts.caption ? { caption: opts.caption } : {}),
      access_token: pageAccessToken,
    },
  });
}

export type ContainerStatus = "IN_PROGRESS" | "FINISHED" | "ERROR" | "EXPIRED" | "PUBLISHED";

export async function getContainerStatus(
  containerId: string,
  pageAccessToken: string
): Promise<{ statusCode: ContainerStatus; statusDetail?: string }> {
  const data = await graphFetch<{ status_code: ContainerStatus; status?: string }>(
    `/${containerId}`,
    {
      params: {
        fields: "status_code,status",
        access_token: pageAccessToken,
      },
    }
  );
  return { statusCode: data.status_code, statusDetail: data.status };
}

export async function publishContainer(
  igUserId: string,
  containerId: string,
  pageAccessToken: string
): Promise<{ igMediaId: string }> {
  const data = await graphFetch<{ id: string }>(`/${igUserId}/media_publish`, {
    method: "POST",
    params: {
      creation_id: containerId,
      access_token: pageAccessToken,
    },
  });
  return { igMediaId: data.id };
}
