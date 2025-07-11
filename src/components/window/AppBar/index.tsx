import type { Suggestion, ToolButtonData } from "@defs/UI";

import { isDesktop } from "@utils/desktopTools";

import { WindowActions } from "@components/window/WindowActions";
import { ToolBar  } from "@components/window/ToolBar";
import { Pallete  } from "@components/window/Pallete";

import "./style.css";

export function AppBar({
  tools=[],
  breadcrumb = "",
  generateSuggestions = () => [],
}: {
  tools?: ToolButtonData[];
  breadcrumb?: string;
  generateSuggestions?: (query: string) => Suggestion[];
}) {
  const title: string = "GraphScript Engine";
  
  return (<>
    <div className="root-app-bar">
      {isDesktop() && <WindowActions />}
      <div
        className={[
          "root-app-bar-title",
          isDesktop() ? "is-desktop" : "",
        ].join(" ")}
      >
        {title}
      </div>
      
      <ToolBar tools={tools} />

      <Pallete generateSuggestions={generateSuggestions} />

      <div className="root-app-extra-title">
        <span>
          {breadcrumb}
        </span>
      </div>
    </div>
  </>);
}
