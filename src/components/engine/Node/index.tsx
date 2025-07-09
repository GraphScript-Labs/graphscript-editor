import {
  useCallback,
  useState,
} from "react";

import type { NodeModel } from "@defs/Node";

import { DynamicIcon } from "@components/commons/DynamicIcon";
import { Glass } from "@components/commons/Glass";
import { Input } from "@components/commons/Input";

import "./style.css";

export function Node({
  node,
}: {
  node: NodeModel;
}) {
  const [active, setActive] = useState(false);

  const handleClick: () => void = useCallback(() => {
    if (node.action) node.action();
    else setActive(prev => !prev);
  }, [node]);

  return (<>
    <div className="node-wrapper">
      <Glass
        className={[
          "node",
          active ? "active" : "",
        ].join(" ")}
        style={{ color: node.color }}
        onClick={handleClick}
      >
        <span className="node-background" />
        
        <div className="node-icon-container">
          <DynamicIcon className="node-icon" icon={node.icon} />
        </div>
        
        <div className="node-name">
          {node.name}
        </div>

        {node.hasNext && (
          <div className="node-pointer">
            <DynamicIcon className="node-pointer-icon" icon="ChevronRight" />
          </div>
        )}
      </Glass>
      
      {node.context && (
        <Glass
          className={[
            "node-context",
            node.context.length > 20 ? "left" : "",
          ].join(" ")}
        >
          {
            node.context?.map((contextNode => <Node
              key={contextNode.name}
              node={contextNode}
            />))
          }

          {node.isBase && (
            <div className="node-base-input">
              <Input
                placeholder="Base Node Value"
                defaultValue={node.value || ""}
                onChange={(event) => {
                  node.value = event.target.value;
                }}
              />
            </div>
          )}
        </Glass>
      )}
    </div>
  </>);
}

