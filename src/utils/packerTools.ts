import type {
  NodeGroup,
  NodeModel,
  NodeSystem,
  Variable,
} from "@defs/Node";

import type {
  PackedNode,
  PackedNodeGroup,
  PackedNodeMap,
  PackedNodeSystem,
  PackedProject
} from "@defs/Packed";

const setupPackerTools = () => {
  const packProject = (
    projectId: string,
    nodeSystem: NodeSystem,
    entries: string[],
    variables: {
      states: Variable[];
      customComponents: Variable[];
    },
  ): PackedProject => {
    const savedNodes: PackedNodeMap = {};

    const packNode = (node: NodeModel): PackedNode => {
      const packedNode: PackedNode = {
        id: node.id!,
        code: node.code,
        name: node.name,
        color: node.color,
        icon: node.icon,
        hasNext: node.hasNext,
        value: node.value,
        isBase: node.isBase,
        isTopLevel: node.isTopLevel
      };

      savedNodes[node.id!] = packedNode;
      return packedNode;
    };
    
    const packNodeGroup = (group: NodeGroup): PackedNodeGroup => {
      return {
        baseId: group.baseId,
        nodes: group.nodes.map(node => packNode(node).id),
        isEntry: group.isEntry
      };
    };
    
    const packNodeSystem = (nodeSystem: NodeSystem): PackedNodeSystem => {
      const packedSystem: PackedNodeSystem = {};

      for (const baseId in nodeSystem) {
        const group = nodeSystem[baseId];
        packedSystem[baseId] = packNodeGroup(group);
      }

      return packedSystem;
    };

    const packedSystem = packNodeSystem(nodeSystem);
    return {
      projectId,
      entries,
      nodes: savedNodes,
      system: packedSystem,
      variables,
    };
  };

  return {
    packProject,
  };
};

export const {
  packProject,
} = setupPackerTools();

