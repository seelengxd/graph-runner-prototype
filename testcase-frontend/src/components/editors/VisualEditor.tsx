import Editor from "@monaco-editor/react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  ReactFlow,
} from "@xyflow/react";
import { Node, Edge } from "@/client";
import { useMemo } from "react";
import CustomEdge from "../nodes/CustomEdge";
import CustomNode from "../nodes/CustomNode";
import { useAddEdge, useAddNode } from "@/queries";

type OwnProps = {
  onChangeActiveNode: (node: Node) => void;
  nodes: Node[];
  edges: Edge[];
  activeNode: Node | null;
};

const VisualEditor = ({
  nodes,
  edges,
  activeNode,
  onChangeActiveNode,
}: OwnProps) => {
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  const edgeTypes = useMemo(() => ({ custom: CustomEdge }), []);

  console.log(activeNode);
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
            onChangeActiveNode(node);
          }
        },
        active: activeNode?.id === node.id,
      },
      type: "custom",
    }));

  const edgesData =
    edges &&
    (edges as Edge[]).map((edge) => ({
      id: edge.id.toString(),
      source: edge.start.toString(),
      target: edge.end.toString(),
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
      style: {
        strokeWidth: 2,
      },
      deletable: true,
      type: "custom",
      data: {
        edge,
      },
    }));

  const addNodeMutation = useAddNode();
  const addEdgeMutation = useAddEdge();

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <Button
          className="bg-yellow-600"
          onClick={() => addNodeMutation.mutate("program")}
        >
          <PlusIcon /> Program
        </Button>
        {/* TODO: Add support for more kinds of nodes */}
        {/* <Button
          className="bg-green-600"
          onClick={() => {
            return addNodeMutation.mutate("input");
          }}
        >
          <PlusIcon /> Input
        </Button> */}
        {/* <Button
          className="bg-orange-600"
          onClick={() => addNodeMutation.mutate("comparator")}
        >
          <PlusIcon /> Comparator
        </Button> */}
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
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default VisualEditor;
