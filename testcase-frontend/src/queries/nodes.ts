"use client";
import * as client from "../client";

import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const getAllNodes = () =>
  queryOptions({
    queryKey: ["nodes"],
    queryFn: client.getAllNodesApiNodesGet,
  });

export const useAddNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (type: client.NodeType) => {
      return client.createNodeApiNodesPost({
        requestBody: { type },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes"] });
    },
  });
};

export const useUpdateNodeCode = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => {
      return client.updateNodeApiNodesIdPut({
        id,
        requestBody: {
          code: code,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes"] });
    },
  });
};

export const useUpdateNodeLabel = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (label: string) => {
      return client.updateNodeApiNodesIdPut({
        id,
        requestBody: {
          label,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes"] });
    },
  });
};

export const useDeleteNode = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return client.deleteNodeApiNodesIdDelete({
        id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes"] });
    },
  });
};
