import type { ReactNode } from "react";
import { isDesktop } from "@utils/desktopTools";

import { AppBar } from "@components/window/AppBar";
import type { ToolButtonData } from "@components/window/ToolBar";
import type { Suggestion } from "@components/window/Pallete";

import "./style.css";

export function AppWindow({
  children,
  tools = [],
  extraTitle = "",
  generateSuggestions = () => [],
}: {
  children?: ReactNode;
  tools?: ToolButtonData[];
  extraTitle?: string;
  generateSuggestions?: (query: string) => Suggestion[];
}) {
  return (<>
    <div className={`root-app-window ${
      (isDesktop() ? "is-desktop" : "")
    }`}>
      <AppBar
        tools={tools}
        extraTitle={extraTitle}
        generateSuggestions={generateSuggestions}
      />
      
      <div
        className={`root-app-window-content ${
          (isDesktop() ? "is-desktop" : "")
        }`}
      >
        {children}
      </div>
    </div>
  </>);
}
