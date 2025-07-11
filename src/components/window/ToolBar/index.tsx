import type { ToolButtonData } from "@defs/UI";

import { DynamicIcon } from "@components/commons/DynamicIcon";

import "./style.css";

export function ToolBar({ tools }: {
  tools: ToolButtonData[];
}) {
  return (<>
    <div className="root-tool-bar">
      {
        tools.map(tool => <div
          key={tool.name}
          className={[
            "root-tool",
            tool.disabled ? "disabled" : "",
          ].join(" ")}
          onClick={() => tool.disabled ? null : tool.action()}
        >
          <div className="root-tool-icon">
            <DynamicIcon icon={tool.icon} />
          </div>
          <div className="root-tool-name">
            {tool.name}
          </div>
        </div>)
      }
    </div>
  </>);
}
