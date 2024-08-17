import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { useUpdateNodeLabel } from "@/queries";

export default function CustomNode({ data }) {
  const updateNodeMutation = useUpdateNodeLabel(data.id);
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
          onBlur={() => updateNodeMutation.mutate(label)}
          className="nodrag"
        />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
}
