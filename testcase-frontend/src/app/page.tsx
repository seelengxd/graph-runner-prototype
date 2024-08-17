"use client";
import Image from "next/image";
import React, { act, useMemo, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  MarkerType,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/editors/VisualEditor";
import { PlusIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as client from "../client";
import { Node, EdgeBase, NodeType } from "../client/types.gen";
import CustomNode from "@/components/nodes/CustomNode";
import CustomEdge from "@/components/nodes/CustomEdge";

export default function Home() {
  const queryClient = useQueryClient();

  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [activeEdgeId, setActiveEdgeId] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const { data: nodes, isLoading: nodesLoading } = useQuery({
    queryKey: ["nodes"],
    queryFn: client.getAllNodesApiNodesGet,
  });

  const { data: edges, isLoading: edgesLoading } = useQuery({
    queryKey: ["edges"],
    queryFn: client.getAllEdgesApiEdgesGet,
  });

  const nodesData =
    nodes &&
    (nodes as Node[]).map((node, index) => ({
      id: node.id.toString(),
      position: { x: 10, y: 10 + index * 100 },
      data: {
        label: node.label,
        node,
        onClick: () => {
          if (activeNode?.id !== node.id) {
            setActiveNode(node);
            setCode(node.code);
          }
        },
        active: activeNode?.id === node.id,
      },
      type: "custom",
    }));

  console.log("test");

  const edgesData =
    edges &&
    (edges as EdgeBase[]).map((edge) => ({
      id: edge.id.toString(),
      source: edge.start.toString(),
      target: edge.end.toString(),
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        // color: "#FFFFFF",
      },
      style: {
        strokeWidth: 2,
        // stroke: "#FFFFFF",
      },
      deletable: true,
      type: "custom",
    }));

  const addNodeMutation = useMutation({
    mutationFn: (type: NodeType) => {
      return client.createNodeApiNodesPost({
        requestBody: { type },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes"] });
    },
  });

  const updateNodeMutation = useMutation({
    mutationFn: (code: string) => {
      return client.updateNodeApiNodesIdPut({
        id: activeNode!.id,
        requestBody: {
          type: activeNode!.type,
          label: activeNode!.label,
          code: code,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes"] });
    },
  });

  const addEdgeMutation = useMutation({
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

  const deleteEdgeMutation = useMutation({
    mutationFn: (id: number) => {
      return client.deleteNodeApiNodesIdDelete({
        id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edges"] });
    },
  });

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  const edgeTypes = useMemo(() => ({ custom: CustomEdge }), []);

  return (
    <main className="min-h-screen flex-col p-12 py-8 bg-gray-800">
      <h1 className="font-bold text-md text-blue-300 mb-4">
        Test Case Creator
      </h1>

      {!nodesLoading && !edgesLoading && (
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="flex gap-2 mb-2">
              <Button
                className="bg-gray-500"
                onClick={() => updateNodeMutation.mutate(code)}
              >
                Save
              </Button>
              <Button className="bg-blue-800">Run</Button>
            </div>
            <CodeEditor value={code} onChange={setCode} />
          </div>

          <div className="h-[90vh]">
            <div className="mb-2 flex gap-2">
              <Button
                className="bg-green-600"
                onClick={() => addNodeMutation.mutate("input")}
              >
                <PlusIcon /> Input
              </Button>
              <Button
                className="bg-yellow-600"
                onClick={() => addNodeMutation.mutate("program")}
              >
                <PlusIcon /> Program
              </Button>
              <Button
                className="bg-orange-600"
                onClick={() => addNodeMutation.mutate("comparator")}
              >
                <PlusIcon /> Comparator
              </Button>
            </div>
            <ReactFlow
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              colorMode="dark"
              nodes={nodesData}
              edges={edgesData}
              onConnect={({ source, target }) =>
                addEdgeMutation.mutate({ source, dest: target })
              }
              onEdgesChange={(changes) => {
                console.log(changes);
                setActiveEdgeId(parseInt(changes[0].id));
              }}
              onEdgesDelete={(del) => console.log(del)}
              onDelete={(a) => console.log(a)}
              deleteKeyCode={["Backspace", "Delete"]}
            >
              <Controls />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </div>
        </div>
      )}
    </main>
  );
}
