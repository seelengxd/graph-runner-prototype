"use client";
import * as client from "../client";

import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const getAllEdges = () =>
  queryOptions({
    queryKey: ["edges"],
    queryFn: client.getAllEdgesApiEdgesGet,
  });

export const useAddEdge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ source, dest }: { source: string; dest: string }) => {
      return client.createEdgeApiEdgesPost({
        requestBody: {
          start: parseInt(source),
          end: parseInt(dest),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edges"] });
    },
  });
};

export const useDeleteEdge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => {
      return client.deleteEdgeApiEdgesIdDelete({
        id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edges"] });
    },
  });
};
