import { isDesktop } from "@utils/desktopTools";

import { WindowActions } from "@components/window/WindowActions";
import { ToolBar, type ToolButtonData } from "@components/window/ToolBar";
import { Pallete, type Suggestion } from "@components/window/Pallete";

import "./style.css";

export function AppBar({
  tools=[],
  extraTitle = "",
  generateSuggestions = () => [],
}: {
  tools?: ToolButtonData[];
  extraTitle?: string;
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
          {extraTitle}
        </span>
      </div>
    </div>
  </>);
}
