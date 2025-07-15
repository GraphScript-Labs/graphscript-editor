export interface NodeModel {
  id?: string;
  code?: string;
  name: string;
  color: string;
  icon: string;
  hasNext?: boolean;
  action?: () => void;
  context?: NodeModel[];
  value?: string;
  isBase?: boolean;
  isTopLevel?: boolean;
}

export type NodeGroup = {
  baseId: string;
  nodes: NodeModel[];
  isEntry?: boolean;
};

export interface NodeSystem {
  [baseId: string]: NodeGroup;
}

export interface Variable {
  name: string;
  color: string;
}

