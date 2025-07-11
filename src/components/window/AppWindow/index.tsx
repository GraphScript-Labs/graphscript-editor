import type { ReactNode } from "react";

import type { Suggestion, ToolButtonData } from "@defs/UI";

import { isDesktop } from "@utils/desktopTools";

import { AppBar } from "@components/window/AppBar";

import "./style.css";

export function AppWindow({
  children,
  tools = [],
  breadcrumb = "",
  generateSuggestions = () => [],
}: {
  children?: ReactNode;
  tools?: ToolButtonData[];
  breadcrumb?: string;
  generateSuggestions?: (query: string) => Suggestion[];
}) {
  return (<>
    <div className={`root-app-window ${
      (isDesktop() ? "is-desktop" : "")
    }`}>
      <AppBar
        tools={tools}
        breadcrumb={breadcrumb}
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
