import { useEffect } from "react";

import { useNodeFactoryContext } from "@utils/nodeFactory";
import { useNodeSystemContext } from "@utils/nodeSystem";
import { useNodeHistoryContext } from "@utils/nodeHistory";
import { downloadScript } from "@utils/compilerTools";
import { usePromptContext } from "@utils/prompt";
import { usePalleteContext } from "@utils/pallete";
import { useVariablesContext } from "@utils/variables";

import { AppWindow } from "@components/window/AppWindow";
import { Canvas } from "@components/engine/Canvas";
import { Prompt } from "@components/commons/Prompt";
import { loadProject, saveProject } from "@utils/engineTools";

export default function App() {
  const { newNode } = useNodeFactoryContext()!;
  
  const {
    nodeSystem,
    isEntry,
    createEntry,
    entries,
    overrideNodeSystem,
    removeNode,
  } = useNodeSystemContext()!;

  const {
    promptComponent,
    promptState,
    statesList,
    customComponents,
    overrideVariables,
  } = useVariablesContext()!;
  
  const {
    activeNode,
    openNode,
    closeNode,
    nodeHistory,
  } = useNodeHistoryContext()!;

  const {
    addSuggestion,
    generateSuggestions,
  } = usePalleteContext()!;

  const {
    requestPrompt,
  } = usePromptContext()!;

  const windowTools = [
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
        overrideNodeSystem,
        overrideVariables,
        openNode,
        removeNode,
      ),
    },
    {
      name: "Save Project",
      icon: "HardDriveDownload",
      action: () => saveProject(
        nodeSystem,
        entries,
        {
          states: statesList,
          customComponents,
        }
      ),
    },
    {
      name: "Compile Project",
      icon: "Rocket",
      action: () => downloadScript(nodeSystem, entries),
    },
  ];

  const windowExtraTitle = [
    ...nodeHistory.current,
    activeNode
  ].join(" > ");

  useEffect(() => {
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
  }, [
    addSuggestion,
    openNode,
    entries,
    createEntry,
    requestPrompt,
    promptComponent,
    promptState,
  ]);

  return (<>
    <AppWindow
      tools={windowTools}
      extraTitle={windowExtraTitle}
      generateSuggestions={generateSuggestions}
    >
      <Canvas
        nodes={[
          ...nodeSystem[activeNode]?.nodes || [],
          newNode
        ]}
      />
      <Prompt />
    </AppWindow>
  </>);
}
