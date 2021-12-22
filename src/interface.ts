/* eslint-disable */
// noinspection TypeScriptUMDGlobal

// noinspection TypeScriptUMDGlobal

export interface NodeDataType {
  [key: string]: any;

  key: string | number;
  label: string;
  children?: NodeDataType[];
  className?: string;
  expand?: boolean;
  loadChildren?: boolean;
  style?: React.CSSProperties;
}

export type RenderNode = (
  node: NodeDataType,
  originNode: React.ReactNode,
) => React.ReactNode;

export interface OrgChartComponentProps {
  data: NodeDataType;
  expandAll?: boolean;
  debug?: boolean;
  expandable?: boolean;
  expandableOnlyOneOnSameTime?: boolean;
  expandedPath?: string[];
  renderNode?: RenderNode;
  keyMap?: { [key: string]: string };
  setBrothersExpand?: (
    handleChildExpanded: (item: NodeDataType) => boolean,
    handleExpandedBySelf: (processBySelf: boolean) => void,
  ) => void;
  loadChildren?: (data: NodeDataType) => Promise<NodeDataType[]>;
  onExpand?: (
    expanded: boolean,
    node: NodeDataType,
    expandedPath: string[],
  ) => void;
  onClick?: (node: NodeDataType) => void;
  filter?: (node: NodeDataType) => boolean;
}

export interface OrgChartProps extends Partial<OrgChartComponentProps> {
  className?: string;
  style?: React.CSSProperties;
}
