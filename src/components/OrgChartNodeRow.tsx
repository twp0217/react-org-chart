import { OrgChartNodeProps, RowProps } from '../interface';
import React from 'react';

export interface OrgChartNodeRowProps
  extends Pick<OrgChartNodeProps, 'direction'> {
  className?: string;
  index: number;
  row: RowProps;
}

const OrgChartNodeRow = (props: OrgChartNodeRowProps) => {
  const { className, index, row, direction } = props;

  return (
    <tr key={index} className={className}>
      {row.map((cell, cellIndex) => {
        return React.cloneElement(cell.content, {
          key: cellIndex,
          ...(direction === 'horizontal' ? { rowSpan: cell.span } : {}),
          ...(direction === 'vertical' ? { colSpan: cell.span } : {}),
        });
      })}
    </tr>
  );
};

export default OrgChartNodeRow;
