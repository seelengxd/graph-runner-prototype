import { useCallback, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as client from "../../client";
import { cn } from "@/lib/utils";

export default function CustomNode({ data }) {
  const queryClient = useQueryClient();

  const updateNodeMutation = useMutation({
    mutationFn: (newLabel: string) => {
      return client.updateNodeApiNodesIdPut({
        id: data.node.id,
        requestBody: {
          type: data.node.type,
          label: newLabel,
          code: data.node.code,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes"] });
    },
  });

  const [label, setLabel] = useState(data.label);

  return (
    <div
      className={cn("p-2 bg-white border-black rounded-md border-2", {
        "border-blue-500": data.active,
      })}
      onClick={data.onClick}
    >
      <Handle type="target" position={Position.Top} />
      <div>
        <input
          id="text"
          name="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={(e) => updateNodeMutation.mutate(label)}
          className="nodrag"
        />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      {/* <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      /> */}
    </div>
  );
}
