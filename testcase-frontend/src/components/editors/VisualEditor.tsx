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

type NodePosition = {
  depth: number;
  index: number;
};

const processNodePositions = (nodes: Node[], edges: Edge[]) => {
  const result = [];

  // Flip edges to do topological sort
  // So nodes like x are on the same depth as c, not a
  //            x ----v
  // a -> b --> c --> d
  const flippedEdges = edges.map((edge) => ({
    start: edge.end,
    end: edge.start,
  }));

  // Attempt inefficient (my typescript cmi) topological sort
  const inDegrees: { [id: number]: number } = {};
  const idToNode: { [id: number]: Node } = {};
  for (const node of nodes) {
    inDegrees[node.id] = 0;
    idToNode[node.id] = node;
  }
  for (const flippedEdge of flippedEdges) {
    inDegrees[flippedEdge.end]++;
  }

  let curr: Node[] = nodes.filter((node) => inDegrees[node.id] === 0);
  let next: Node[] = [];

  let count = 0;

  while (curr.length > 0) {
    count += curr.length;
    let currNodeIds = curr.map((node) => node.id);

    let endsToRemove = flippedEdges
      .filter((edge) => currNodeIds.includes(edge.start))
      .map((edge) => edge.end);

    for (const end of endsToRemove) {
      inDegrees[end]--;
      if (!inDegrees[end]) {
        next.push(idToNode[end]);
      }
    }
    result.push(curr);
    curr = next;
    next = [];
  }

  if (count !== nodes.length) {
    // TODO: handle cycle properly
    console.log("cycle!" + count + " " + nodes.length);
    return [nodes];
  }

  result.reverse();
  return result;
};

const VisualEditor = ({
  nodes,
  edges,
  activeNode,
  onChangeActiveNode,
}: OwnProps) => {
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  const edgeTypes = useMemo(() => ({ custom: CustomEdge }), []);

  let processedNodes = processNodePositions(nodes, edges);
  const nodesData =
    processedNodes &&
    processedNodes.flatMap((nodes, depth) =>
      (nodes as Node[]).map((node, index) => ({
        id: node.id.toString(),
        position: { x: 10 + index * 250, y: 10 + depth * 100 },
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
      }))
    );

  console.log(nodesData);

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
