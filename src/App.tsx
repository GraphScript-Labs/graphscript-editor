import { useEffect } from "react";

import { useNodeFactoryContext } from "@utils/nodeFactory";
import { useNodeSystemContext } from "@utils/nodeSystem";
import { useNodeHistoryContext } from "@utils/nodeHistory";
import { usePromptContext } from "@utils/prompt";
import { usePalleteContext } from "@utils/pallete";
import { useVariablesContext } from "@utils/variables";
import { loadProject, saveProject } from "@utils/engineTools";
import {
  getBreadcrumb,
  getWindowTools,
  loadActiveProjectId,
  updatePalleteRegistry,
} from "@utils/projectTools";

import { AppWindow } from "@components/window/AppWindow";
import { Canvas } from "@components/engine/Canvas";
import { Prompt } from "@components/commons/Prompt";

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

  const windowTools = getWindowTools(
    closeNode,
    isEntry,
    activeNode,
    overrideNodeSystem,
    overrideVariables,
    openNode,
    removeNode,
    nodeSystem,
    entries,
    statesList,
    customComponents,
  );

  const windowExtraTitle = getBreadcrumb(
    nodeHistory,
    activeNode,
  );

  useEffect(() => {
    (async () => {
      const requireLoading = await loadActiveProjectId();
      if (!requireLoading) return;
      
      loadProject(
        overrideNodeSystem,
        overrideVariables,
        openNode,
        removeNode,
      )
    })();
  }, [
    overrideNodeSystem,
    overrideVariables,
    openNode,
    removeNode,
  ]);

  useEffect(() => {
    updatePalleteRegistry(
      addSuggestion,
      openNode,
      entries,
      createEntry,
      requestPrompt,
      promptComponent,
      promptState,
    )
  }, [
    addSuggestion,
    openNode,
    entries,
    createEntry,
    requestPrompt,
    promptComponent,
    promptState,
  ]);

  useEffect(() => {
    saveProject(
      nodeSystem,
      entries,
      {
        states: statesList,
        customComponents,
      },
    );
  }, [
    entries,
    nodeSystem,
    statesList,
    customComponents,
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
