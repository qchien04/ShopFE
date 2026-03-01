export const categoryQueryKeys = {
  all: ["category"] as const,

  lists: () => [...categoryQueryKeys.all, "list"] as const,

  listParent: () => [...categoryQueryKeys.all, "list","parent"] as const,

  listFilter: (id:number) => [...categoryQueryKeys.all, "list","filter",id] as const,

  detail: (id: number) =>
    [...categoryQueryKeys.all, "detail", id] as const,
}