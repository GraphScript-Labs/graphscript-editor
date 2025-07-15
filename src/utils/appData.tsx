import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import type { Suggestion, ToolButtonData } from "@defs/UI";
import type { NodeModel } from "@defs/Node";

import { useNodeFactoryContext } from "@utils/nodeFactory";
import { useNodeSystemContext } from "@utils/nodeSystem";
import { useNodeHistoryContext } from "@utils/nodeHistory";
import { usePromptContext } from "@utils/prompt";
import { usePalleteContext } from "@utils/pallete";
import { useVariablesContext } from "@utils/variables";
import { loadProject, saveProject } from "@utils/engineTools";
import { packProject } from "@utils/packerTools";
import { backupProject, getRestoredProject } from "@utils/desktopTools";
import { saveData } from "@utils/persistentTools";
import {
  getBreadcrumb,
  getWindowTools,
  loadExistingId,
  updatePalleteRegistry,
} from "@utils/projectTools";

const createAppDataContext = () => {
  const AppDataContext = createContext<{
    projectId: string | null;
    setProjectId: (id: string | null) => void;
    generateSuggestions: (query: string) => Suggestion[];
    windowTools: ToolButtonData[];
    breadcrumb: string;
    nodes: NodeModel[];
  } | undefined>(undefined);
  
  const AppDataProvider = ({
    children,
  }: {
    children: ReactNode;
  }) => {
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
      newNode,
    } = useNodeFactoryContext()!;

    const {
      requestPrompt,
    } = usePromptContext()!;

    const [
      windowTools,
      setWindowTools,
    ] = useState<ToolButtonData[]>([]);

    const [
      breadcrumb,
      setBreadcrumb,
    ] = useState<string>("");

    const [
      nodes,
      setNodes,
    ] = useState<NodeModel[]>([newNode]);
    
    const [
      projectId,
      setProjectId,
    ] = useState<string | null>(null);
    
    useEffect(() => {
      setWindowTools(
        getWindowTools(
          projectId,
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
        )
      );
    }, [
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
      projectId,
    ]);

    useEffect(() => {
      setBreadcrumb(
        getBreadcrumb(
          projectId,
          nodeHistory,
          activeNode,
        )
      );
    }, [
      projectId,
      nodeHistory,
      activeNode,
    ]);

    useEffect(() => {
      setNodes([
        ...nodeSystem[activeNode]?.nodes || [],
        newNode
      ]);
    }, [
      activeNode,
      newNode,
      nodeSystem,
    ]);

    useEffect(() => {
      (async () => {
        const existingId = await loadExistingId();
        const restoredProject = await getRestoredProject();
        saveData(`p:${existingId}`, restoredProject);
        setProjectId(existingId);

        loadProject(
          existingId,
          overrideNodeSystem,
          overrideVariables,
          openNode,
          removeNode,
        );
      })();
    }, [
      openNode,
      overrideNodeSystem,
      overrideVariables,
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
        projectId!,
        nodeSystem,
        entries,
        {
          states: statesList,
          customComponents,
        },
      );
    }, [
      projectId,
      entries,
      nodeSystem,
      statesList,
      customComponents,
    ]);

    useEffect(() => {
      const backupInterval = setInterval(() => {
        const project = packProject(
          projectId!,
          nodeSystem,
          entries,
          {
            states: statesList,
            customComponents,
          }
        );

        backupProject(JSON.stringify(project, null, 2));
      }, 5000);

      return () => {
        clearInterval(backupInterval);
      }
    }, [
      customComponents,
      entries,
      nodeSystem,
      projectId,
      statesList,
    ]);
    
    const exposed = {
      projectId,
      setProjectId,
      generateSuggestions,
      windowTools,
      breadcrumb,
      nodes,
    };

    return (<>
      <AppDataContext.Provider value={exposed}>
        {children}
      </AppDataContext.Provider>
    </>);
  };

  const useAppDataContext = () => {
    return useContext(AppDataContext);
  };

  return {
    AppDataProvider,
    useAppDataContext,
  }
};

export const {
  AppDataProvider,
  useAppDataContext,
} = createAppDataContext();

