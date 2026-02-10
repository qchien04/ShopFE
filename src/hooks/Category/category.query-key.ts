export const categoryQueryKeys = {
  all: ["category"] as const,

  lists: () => [...categoryQueryKeys.all, "list"] as const,

  detail: (id: number) =>
    [...categoryQueryKeys.all, "detail", id] as const,
}