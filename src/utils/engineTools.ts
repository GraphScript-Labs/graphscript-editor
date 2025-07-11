import type {
  NodeGroup,
  NodeModel,
  NodeSystem,
  Variable,
} from "@defs/Node";

import { loadFile, saveFile } from "@utils/desktopTools";
import { loadData, saveData } from "@utils/persistentTools";

type PackedNode = {
  id: string;
  code?: string;
  name: string;
  color: string;
  icon: string;
  hasNext?: boolean;
  value?: string;
  isBase?: boolean;
  isTopLevel?: boolean;
};

type PackedNodeMap = {
  [id: string]: PackedNode;
};

type PackedNodeGroup = {
  baseId: string;
  nodes: string[];
  isEntry?: boolean;
};

type PackedNodeSystem = {
  [baseId: string]: PackedNodeGroup;
};

const setupEngineTools = () => {
  const saveProject = (
    projectId: string,
    nodeSystem: NodeSystem,
    entries: string[],
    variables: {
      states: Variable[];
      customComponents: Variable[];
    },
    download: boolean = false,
  ) => {
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
    const dataJSON = JSON.stringify({
      projectId,
      entries,
      nodes: savedNodes,
      system: packedSystem,
      variables,
    });

    if (!download) {
      if (projectId) {
        saveData(`p:${projectId}`, dataJSON);
        saveData("activeProjectId", projectId);
        
        const projectMap = JSON.parse(
          loadData(`projectMap`) || "{}"
        );

        projectMap[projectId] = {
          id: projectId,
          status: "accessible",
        };

        saveData(`projectMap`, JSON.stringify(projectMap));
      }

      return;
    }

    saveFile(dataJSON, `project_${projectId}.json`, [
      "Project Files (*.json)",
      "All Files (*.*)"
    ]);
  };

  const loadProject = async (
    projectId: string | null,
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
    upload: boolean = false,
  ) => {
    let fileContents: string | null = loadData(`p:${projectId}`) || `{
      "projectId": "${projectId}",
      "entries": ["ENTRY"],
      "nodes": {},
      "system": {
        "ENTRY": {
          "baseId": "ENTRY",
          "nodes": [],
          "isEntry": true
        }
      },
      "variables": {
        "states": [],
        "customComponents": []
      }
    }`;
    
    if (upload) fileContents = await loadFile();
    if (!fileContents) return;

    const data: {
      projectId: string;
      entries: string[];
      nodes: PackedNodeMap;
      system: PackedNodeSystem;
      variables: {
        states: Variable[];
        customComponents: Variable[];
      };
    } = JSON.parse(fileContents);

    const loadedNodes: {
      [id: string]: NodeModel;
    } = {};

    const loadedSystem: NodeSystem = {};

    for (const id in data.nodes) {
      const packedNode = data.nodes[id];
      const node: NodeModel = {
        id: packedNode.id,
        code: packedNode.code,
        name: packedNode.name,
        color: packedNode.color,
        icon: packedNode.icon,
        hasNext: packedNode.hasNext,
        value: packedNode.value,
        isBase: packedNode.isBase,
        isTopLevel: packedNode.isTopLevel,
        context: [
          {
            id: `${packedNode.id}`,
            name: "Arguments",
            icon: "Import",
            color: "black",
            action: () => openNode(packedNode.id),
          },
          {
            id: `${packedNode.id}:REMOVE`,
            name: "Remove",
            icon: "Trash",
            color: "red",
            action: () => removeNode(packedNode.id),
          }
        ],
      };
      
      loadedNodes[id] = node;
    }

    for (const baseId in data.system) {
      const packedGroup = data.system[baseId];
      const group: NodeGroup = {
        baseId: packedGroup.baseId,
        nodes: packedGroup.nodes.map(nodeId => loadedNodes[nodeId]),
        isEntry: packedGroup.isEntry
      };
      
      loadedSystem[baseId] = group;
    }

    overrideNodeSystem(
      loadedSystem,
      data.entries
    );

    overrideVariables(
      data.variables.states || [],
      data.variables.customComponents || []
    );
  };

  return {
    saveProject,
    loadProject,
  }
};

export const {
  saveProject,
  loadProject,
} = setupEngineTools();

