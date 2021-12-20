export interface CellProps {
  span: number;
  content: React.ReactElement;
}

export type RowProps = CellProps[];

export interface OrgChartNodeDataType {
  key: string | number;
  label: string;
  children?: OrgChartNodeDataType[];
  className?: string;
  style?: React.CSSProperties;
}

export interface OrgChartNodeProps {
  data: OrgChartNodeDataType;
  expandAll?: boolean;
  expandable?: boolean;
  direction?: 'horizontal' | 'vertical';
  renderNode?: (
    node: OrgChartNodeDataType,
    originNode: React.ReactNode,
  ) => React.ReactNode;
  onExpand?: (expanded: boolean, node: OrgChartNodeDataType) => void;
  onClick?: (node: OrgChartNodeDataType) => void;
}

export interface OrgChartProps extends Partial<OrgChartNodeProps> {
  className?: string;
  style?: React.CSSProperties;
}
