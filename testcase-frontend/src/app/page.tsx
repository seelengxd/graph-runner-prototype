"use client";

import React, { useMemo, useState } from "react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/editors/CodeEditor";
import { useQuery } from "@tanstack/react-query";
import { Node } from "../client/types.gen";
import CustomNode from "@/components/nodes/CustomNode";
import CustomEdge from "@/components/nodes/CustomEdge";
import { getAllEdges, getAllNodes, useUpdateNodeCode } from "@/queries";
import VisualEditor from "@/components/editors/VisualEditor";

export default function Home() {
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [code, setCode] = useState("");
  const { data: nodes, isLoading: nodesLoading } = useQuery(getAllNodes());
  const { data: edges, isLoading: edgesLoading } = useQuery(getAllEdges());

  const updateNodeCodeMutation = useUpdateNodeCode(activeNode?.id);

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
                onClick={() => updateNodeCodeMutation.mutate(code)}
              >
                Save
              </Button>
              <Button className="bg-blue-800">Run</Button>
            </div>
            <CodeEditor value={code} onChange={setCode} />
          </div>
          <div className="grid grid-rows-2 gap-14">
            <VisualEditor
              onChangeActiveNode={(node) => {
                if (activeNode?.id !== node.id) {
                  setActiveNode(node);
                  setCode(node.code);
                }
              }}
              activeNode={activeNode}
              nodes={nodes!}
              edges={edges!}
            />
            <div className="bg-gray-900 p-4 text-gray-200">output</div>
          </div>
        </div>
      )}
    </main>
  );
}
