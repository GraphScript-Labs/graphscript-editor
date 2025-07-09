import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type {
  NodeModel,
  NodeSystem,
} from "@defs/Node";

const createNodeSystemContext = () => {
  const NodeSystemContext = createContext<{
    nodeSystem: NodeSystem;
    entries: string[];
    addNode: (baseId: string, node: NodeModel) => void;
    removeNode: (nodeId: string) => void;
    isEntry: (nodeId: string) => boolean;
    createEntry: (entryName: string) => void;
    overrideNodeSystem: (
      system: NodeSystem, 
      entries: string[],
    ) => void;
  } | undefined>(undefined);
  
  const NodeSystemProvider = ({ children }: {
    children: ReactNode;
  }) => {
    const [entries, setEntries] = useState<string[]>([
      "ENTRY",
    ]);
    
    const [nodeSystem, setNodeSystem] = useState<NodeSystem>({
      ENTRY: {
        baseId: "ENTRY",
        nodes: [],
        isEntry: true,
      },
    });

    const isEntry = useCallback((nodeId: string): boolean => {
      return nodeSystem[nodeId]?.isEntry || false;
    }, [nodeSystem]);

    const createEntry = useCallback((entryName: string) => {
      setNodeSystem(prev => {
        if (prev[entryName]) return prev;

        prev[entryName] = {
          baseId: entryName,
          nodes: [],
          isEntry: true,
        }

        return { ...prev };
      });

      setEntries(prev => {
        if (prev.includes(entryName)) return prev;
        return [...prev, entryName];
      });
    }, []);

    const addNode = useCallback((
      baseId: string,
      node: NodeModel,
    ) => {
      setNodeSystem(prev => {
        prev[node.id!] = {
          baseId,
          nodes: [],
        }

        if (!prev[baseId]) {
          prev[baseId] = {
            baseId,
            nodes: [],
          };
        }

        prev[baseId].nodes.push(node);
        return { ...prev };
      });
    }, []);

    const removeNode = useCallback((nodeId: string) => {
      setNodeSystem(prev => {
        const baseId: string = prev[nodeId].baseId!;
        delete prev[nodeId];
        
        prev[baseId].nodes = prev[baseId].nodes.filter(
          n => n.id !== nodeId
        );

        return { ...prev };
      });
    }, []);

    const overrideNodeSystem = useCallback((
      system: NodeSystem,
      entries: string[],
    ) => {
      setNodeSystem(system);
      setEntries(entries);
    }, []);

    const exposed = {
      nodeSystem,
      entries,
      addNode,
      removeNode,
      isEntry,
      createEntry,
      overrideNodeSystem,
    };

    return (<>
      <NodeSystemContext.Provider value={exposed}>
        {children}
      </NodeSystemContext.Provider>
    </>);
  };

  const useNodeSystemContext = () => {
    return useContext(NodeSystemContext);
  };

  return {
    NodeSystemProvider,
    useNodeSystemContext,
  };
};

export const {
  NodeSystemProvider,
  useNodeSystemContext,
} = createNodeSystemContext();

