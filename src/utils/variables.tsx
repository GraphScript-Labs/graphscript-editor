import { createContext, useCallback, useContext, useState, type ReactNode } from "react"

import type { Variable } from "@defs/Node";

import { randomHexColor } from "@utils/generatorTools";
import { usePromptContext } from "@utils/prompt";

const createVariablesContext = () => {
  const VariablesContext = createContext<{
    statesList: Variable[];
    customComponents: Variable[];
    addState: (stateName: string) => void;
    addCustomComponent: (componentName: string) => void;
    promptState: () => Promise<void>;
    promptComponent: () => Promise<void>;
    overrideVariables: (
      states: Variable[],
      customComponents: Variable[],
    ) => void;
  } | undefined>(undefined);

  const VariablesProvider = ({ children }: {
    children: ReactNode;
  }) => {
    const {
      requestPrompt,
    } = usePromptContext()!;

    const [stSet, setStSet] = useState<Set<string>>(new Set());
    const [ccSet, setCcSet] = useState<Set<string>>(new Set());

    const [statesList, setStatesList] = useState<Variable[]>([]);
    const [cComponents, setCComponents] = useState<Variable[]>([]);

    const addState = (stateName: string) => {
      if (stSet.has(stateName)) return;
      setStSet(prev => new Set(prev).add(stateName));
      setStatesList(prev => [
        ...prev,
        {
          name: stateName,
          color: randomHexColor(),
        },
      ]);
    };

    const addCustomComponent = (componentName: string) => {
      if (ccSet.has(componentName)) return;
      setCcSet(prev => new Set(prev).add(componentName));
      setCComponents(prev => [
        ...prev,
        {
          name: componentName,
          color: randomHexColor(),
        },
      ]);
    };

    const promptComponent = async () => {
      const entryName = await requestPrompt(
        "Enter the name of the new Component to register"
      );
      
      if (!entryName) return;
      addCustomComponent(entryName);
    };

    const promptState = async () => {
      const entryName = await requestPrompt(
        "Enter the name of the new State to register"
      );
      
      if (!entryName) return;
      addState(entryName);
    };

    const overrideVariables = useCallback((
      states: Variable[],
      customComponents: Variable[],
    ) => {
      setStSet(new Set(states.map(s => s.name)));
      setCcSet(new Set(customComponents.map(c => c.name)));
      setStatesList(states);
      setCComponents(customComponents);
    }, []);

    const exposed = {
      statesList,
      customComponents: cComponents,
      addState,
      addCustomComponent,
      promptState,
      promptComponent,
      overrideVariables,
    };

    return (
      <VariablesContext.Provider value={exposed}>
        {children}
      </VariablesContext.Provider>
    );
  };

  const useVariablesContext = () => {
    return useContext(VariablesContext);
  };

  return {
    VariablesProvider,
    useVariablesContext,
  };
}

export const {
  VariablesProvider,
  useVariablesContext,
} = createVariablesContext();

