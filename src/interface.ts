export interface NodeDataType {
  key: string | number;
  label: string;
  children?: NodeDataType[];
  className?: string;
  style?: React.CSSProperties;
}

export type RenderNode = (
  node: NodeDataType,
  originNode: React.ReactNode,
) => React.ReactNode;

export interface OrgChartComponentProps {
  data: NodeDataType;
  expandAll?: boolean;
  expandable?: boolean;
  renderNode?: RenderNode;
  onExpand?: (expanded: boolean, node: NodeDataType) => void;
  onClick?: (node: NodeDataType) => void;
}

export interface OrgChartProps extends Partial<OrgChartComponentProps> {
  className?: string;
  style?: React.CSSProperties;
}
