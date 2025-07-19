import type { RefObject } from "react";

import type { NodeSystem, Variable } from "@defs/Node";
import type { Suggestion } from "@defs/UI";

import { isDesktop, loadProjectId, runProject } from "@utils/desktopTools";
import { loadData, wipeData } from "@utils/persistentTools";
import { generateId } from "@utils/generatorTools";
import { downloadScript } from "@utils/compilerTools";
import {
  loadProject,
  saveProject,
} from "@utils/engineTools";

const setupProjectTools = () => {
  const loadExistingId = async (): Promise<string> => {
    const injectedKey: string | null = await loadProjectId();
    const existingKey: string | null = loadData("activeProjectId");
    const fallsafeKey: string = generateId();
    const projectKey = injectedKey || existingKey || fallsafeKey;
    
    return projectKey;
  }

  const getWindowTools = (
    projectId: string | null,
    closeNode: () => void,
    isEntry: (nodeId: string) => boolean,
    activeNode: string,
    overrideNodeSystem: (
      system: NodeSystem,
      entries: string[],
    ) => void,
    overrideVariables: (
      states: Variable[],
      customComponents: Variable[],
    ) => void,
    openNode: (nodeId: string) => void,
    removeNode: (nodeId: string) => void,
    nodeSystem: NodeSystem,
    entries: string[],
    statesList: Variable[],
    customComponents: Variable[],
  ) => {
    return [
      {
        name: "Refresh",
        icon: "RefreshCw",
        action: () => window.location.reload(),
      },
      {
        name: "Close Node",
        icon: "CircleChevronUp",
        action: closeNode,
        disabled: isEntry(activeNode)
      },
      {
        name: "Load Project",
        icon: "HardDriveUpload",
        action: () => loadProject(
          projectId,
          overrideNodeSystem,
          overrideVariables,
          openNode,
          removeNode,
          true,
        ),
      },
      {
        name: "Save Project",
        icon: "HardDriveDownload",
        action: () => saveProject(
          projectId!,
          nodeSystem,
          entries,
          {
            states: statesList,
            customComponents,
          },
          true,
        ),
      },
      {
        name: "Compile Project",
        icon: "Rocket",
        action: () => downloadScript(nodeSystem, entries),
      },
      ...(isDesktop() ? [
        {
          name: "Run Project",
          icon: "CirclePlay",
          action: () => runProject(),
        }
      ] : []),
    ];
  };

  const updatePalleteRegistry = (
    addSuggestion: (suggestion: Suggestion, group: string) => void,
    openNode: (nodeId: string, topLevel?: boolean) => void,
    entries: string[],
    createEntry: (entryName: string) => void,
    requestPrompt: (msg: string) => Promise<string | null>,
    promptComponent: () => Promise<void>,
    promptState: () => Promise<void>,
  ) => {
    entries.map(
      entry => ({
        name: entry,
        icon: "Component",
        action: () => openNode(entry, true),
      })
    ).forEach(suggestion => addSuggestion(
      suggestion, "Entries"
    ));

    addSuggestion({
      name: "New Entry",
      icon: "NotebookPen",
      action: () => {
        (async () => {
          const entryName = (
            await requestPrompt(
              "Enter the name of the new Entry Point"
            )
          )?.trim().toUpperCase();
          
          if (!entryName) return;
          createEntry(entryName);
          openNode(entryName, true);
        })();
      }
    }, "Create");

    addSuggestion({
      name: "New Component",
      icon: "Puzzle",
      action: promptComponent,
    }, "Register");

    addSuggestion({
      name: "New State",
      icon: "Puzzle",
      action: promptState,
    }, "Register");

    addSuggestion({
      name: "New Project",
      icon: "TentTree",
      action: () => {
        wipeData("activeProjectId");
        location.reload();
      },
    }, "Project");
  }

  const getBreadcrumb = (
    projectId: string | null,
    nodeHistory: RefObject<string[]>,
    activeNode: string,
  ) => {
    const breadcrumb = [
      ...nodeHistory.current.slice(-2),
      activeNode
    ].join(" > ");

    return `[ ${projectId} ] : ${breadcrumb}`;
  };

  return {
    getWindowTools,
    getBreadcrumb,
    loadExistingId,
    updatePalleteRegistry,
  };
}

export const {
  getWindowTools,
  getBreadcrumb,
  loadExistingId,
  updatePalleteRegistry,
} = setupProjectTools();

