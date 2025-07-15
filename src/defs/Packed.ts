import type { Variable } from "@defs/Node";

export interface PackedNode {
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

export interface PackedNodeMap {
  [id: string]: PackedNode;
};

export interface PackedNodeGroup {
  baseId: string;
  nodes: string[];
  isEntry?: boolean;
};

export interface PackedNodeSystem {
  [baseId: string]: PackedNodeGroup;
};

export interface PackedProject {
  projectId: string;
  entries: string[];
  nodes: PackedNodeMap;
  system: PackedNodeSystem;
  variables: {
    states: Variable[];
    customComponents: Variable[];
  }
}

