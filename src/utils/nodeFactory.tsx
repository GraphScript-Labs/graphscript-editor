import { createContext, useContext, type ReactNode } from "react";

import type { NodeModel } from "@defs/Node";

import { generateId } from "@utils/generatorTools";
import { useNodeSystemContext } from "@utils/nodeSystem";
import { useNodeHistoryContext } from "@utils/nodeHistory";
import { componentLib } from "@utils/componentLib";
import { useVariablesContext } from "@utils/variables";

const createNodeFactoryContext = () => {
  const NodeFactoryContext = createContext<{
    nodeTemplate: (baseId: string, node: NodeModel) => NodeModel;
    newNode: NodeModel;
  } | undefined>(undefined);

  const NodeFactoryProvider = ({ children }: {
    children: ReactNode;
  }) => {
    const {
      addNode,
      removeNode,
    } = useNodeSystemContext()!;
    
    const {
      activeNode,
      openNode,
    } = useNodeHistoryContext()!;

    const {
      customComponents,
      statesList,
      promptComponent,
      promptState,
    } = useVariablesContext()!;

    function nodeTemplate (
      baseId: string,
      node: NodeModel,
    ): NodeModel {
      const nodeId = `${
        node.name.split(" ").join("_")
      }:${generateId()}`.toUpperCase();
      
      return {
        id: `TMP:${nodeId}`,
        name: `${node.name}`,
        icon: `${node.icon}`,
        color: `${node.color}`,
        action: () => {
          addNode(baseId, {
            ...node,
            id: nodeId,
            hasNext: true,
            context: [
              {
                id: `${nodeId}`,
                name: "Arguments",
                icon: "Import",
                color: "black",
                action: () => openNode(nodeId),
              },
              {
                id: `${nodeId}:REMOVE`,
                name: "Remove",
                icon: "Trash",
                color: "red",
                action: () => removeNode(nodeId),
              }
            ],
          });
        },
      };
    }

    const newNode: NodeModel = {
      id: "ENTRY",
      name: "New Node",
      icon: "Plus",
      color: "black",
      context: [
        nodeTemplate(activeNode, {
          name: "Base Node",
          code: "base",
          icon: "Atom",
          color: "black",
          isBase: true,
        }),
        {
          id: "ANN:CMP",
          name: "Components",
          icon: "Shapes",
          color: "black",
          context: componentLib.map(component => nodeTemplate(
            activeNode,
            component,
          )),
        },
        {
          id: "ANN:CCMP",
          name: "Custom Components",
          icon: "Component",
          color: "black",
          context: [
            {
              name: "Add Custom Component",
              icon: "Plus",
              color: "black",
              action: promptComponent,
            },
            ...customComponents.map(component => nodeTemplate(
              activeNode,
              {
                name: component.name,
                code: component.name,
                icon: "Component",
                color: component.color,
              },
            ))
          ],
        },
        {
          id: "ANN:STATES",
          name: "States",
          icon: "Puzzle",
          color: "black",
          context: [
            {
              name: "Add State",
              icon: "Plus",
              color: "black",
              action: promptState,
            },
            ...statesList.map(state => nodeTemplate(
              activeNode,
              {
                name: state.name,
                code: state.name,
                icon: "Puzzle",
                color: state.color,
              },
            ))
          ],
        },
      ]
    };

    const exposed = {
      nodeTemplate,
      newNode,
    };

    return (
      <NodeFactoryContext.Provider value={exposed}>
        {children}
      </NodeFactoryContext.Provider>
    );
  }

  const useNodeFactoryContext = () => {
    return useContext(NodeFactoryContext);
  }

  return {
    NodeFactoryProvider,
    useNodeFactoryContext,
  };
}

export const {
  NodeFactoryProvider,
  useNodeFactoryContext,
} = createNodeFactoryContext();

