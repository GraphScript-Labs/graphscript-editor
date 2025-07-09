import type { CanvasModel } from "@defs/Canvas";

import { Node } from "@components/engine/Node";

import "./style.css";

export function Canvas({
  nodes = [],
}: CanvasModel) {
  return (<>
    <div className="canvas">
      <div className="nodes">
        {
          nodes.map(node => <Node
            key={node.id}
            node={node}
          />)
        }
      </div>
    </div>
  </>);
}

