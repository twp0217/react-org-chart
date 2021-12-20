import classNames from 'classnames';
import React from 'react';
import {
  OrgChartNodeDataType,
  OrgChartNodeProps,
  RowProps,
} from '../interface';
import OrgChartNodeRow from './OrgChartNodeRow';

const OrgChartNode = (props: OrgChartNodeProps) => {
  const {
    data,
    expandAll,
    expandable,
    direction,
    renderNode,
    onExpand,
    onClick,
  } = props;

  const [expanded, setExpanded] = React.useState<boolean>(false);

  const handleExpandChange = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onExpand?.(newExpanded, data);
  };

  const getOrgNodeRow = (
    span: number,
    data: OrgChartNodeDataType,
  ): RowProps => {
    const contentNode: React.ReactNode = (
      <div className="org-chart-table-node-content" title={data.label}>
        {data.label}
      </div>
    );

    return [
      {
        span,
        content: (
          <td>
            <div
              className={classNames('org-chart-table-node', data.className)}
              style={data.style}
              onClick={() => onClick?.(data)}
            >
              {!!renderNode ? renderNode(data, contentNode) : contentNode}
            </div>
          </td>
        ),
      },
    ];
  };

  const getLineRow = (span: number): RowProps => {
    return [
      {
        span,
        content: (
          <td className="org-chart-table-line">
            {expandable ? (
              <div
                className={classNames({
                  'expand-icon': expandable,
                  'expand-icon-expanded': expandable && expanded,
                  'expand-icon-collapsed': expandable && !expanded,
                })}
                onClick={() => handleExpandChange()}
              ></div>
            ) : null}
          </td>
        ),
      },
    ];
  };

  const getChildrenLineRow = (span: number, itemSpan: number): RowProps => {
    const cells: RowProps = [];
    for (let index = 0; index < span; index = index + itemSpan) {
      cells.push({
        span: 1,
        content: (
          <td
            key={index}
            className={classNames(
              'org-chart-table-line',
              'org-chart-table-line-children',
              {
                hidden: !expanded,
              },
            )}
          >
            &nbsp;
          </td>
        ),
      });
    }
    return cells;
  };

  const getChildrenNode = (
    datas: OrgChartNodeDataType[] = [],
    itemSpan: number,
  ): RowProps => {
    const cells: RowProps = [];
    datas.forEach((data, index) => {
      cells[itemSpan * index] = {
        span: itemSpan,
        content: (
          <td
            key={data.key}
            className={classNames('org-chart-table-node-children', {
              hidden: !expanded,
            })}
          >
            <OrgChartNode {...props} data={data} />
          </td>
        ),
      };
    });
    return cells;
  };

  const getRows = (): RowProps[] => {
    if (data) {
      const rows: RowProps[] = [];
      const childrenLength = data?.children?.length || 0;
      const span = childrenLength * 2;

      rows.push(getOrgNodeRow(span, data));
      // 判断是否有子节点
      if (data.children?.length ?? 0 > 0) {
        rows.push(getLineRow(span));
        rows.push(getChildrenLineRow(span, 1));
        rows.push(getChildrenNode(data.children, 2));
      }

      if (direction === 'horizontal') {
        const newRow: RowProps[] = [];
        rows.forEach((row, rowIndex) => {
          row.forEach((cell, cellIndex) => {
            newRow[cellIndex] = newRow[cellIndex] || [];
            newRow[cellIndex][rowIndex] = cell;
          });
        });
        return newRow;
      }
      return rows;
    }
    return [];
  };

  const rows = React.useMemo(() => {
    return getRows();
  }, [data, expanded, direction]);

  React.useEffect(() => {
    if (expandable === true) {
      setExpanded(!!expandAll);
    } else {
      setExpanded(true);
    }
  }, [expandAll, expandable]);

  return (
    <table
      className={classNames('org-chart-table', {
        'org-chart-table-horizontal': direction === 'horizontal',
        'org-chart-table-vertical': direction === 'vertical',
      })}
    >
      <tbody>
        {rows.map((row, index) => (
          <OrgChartNodeRow
            key={index}
            index={index}
            row={row}
            direction={direction}
          />
        ))}
      </tbody>
    </table>
  );
};

export default OrgChartNode;
