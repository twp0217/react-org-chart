import { NodeDataType, OrgChartComponentProps } from '../interface';
import classNames from 'classnames';
import React from 'react';

const DefaultOrgChart = (props: OrgChartComponentProps) => {
  const {
    data,
    expandAll = true,
    expandable = false,
    renderNode: customRenderNode,
    onExpand,
    onClick,
  } = props;

  const [expanded, setExpanded] = React.useState<boolean>(false);

  const childrenLength = data.children?.length || 0;
  const colSpan: number = childrenLength * 2;

  /**
   * 渲染节点
   * @param data
   * @returns
   */
  const renderNode = (data: NodeDataType): React.ReactNode => {
    const contentNode: React.ReactNode = (
      <div className="node-content" title={data.label}>
        {data.label}
      </div>
    );
    return (
      <tr>
        <td colSpan={colSpan}>
          <div
            className={classNames('node', data.className)}
            style={data.style}
            onClick={() => onClick && onClick(data)}
          >
            {!!customRenderNode
              ? customRenderNode(data, contentNode)
              : contentNode}
          </div>
        </td>
      </tr>
    );
  };

  /**
   * 处理展开
   */
  const handleExpandChange = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onExpand && onExpand(newExpanded, data);
  };

  /**
   * 渲染垂直线
   * @returns
   */
  const renderVerticalLine = (): React.ReactNode => {
    return (
      <td colSpan={colSpan}>
        <div className="vertical-line"></div>
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
    );
  };

  /**
   * 渲染连接线
   * @returns
   */
  const renderConnectLines = (): React.ReactNode[] => {
    const lines: React.ReactNode[] = [];
    for (let index = 0; index < colSpan; index++) {
      lines.push(
        <td
          key={index}
          className={classNames('line', {
            left: index % 2 === 0,
            right: index % 2 !== 0,
            top: index !== colSpan - 1 && index !== 0,
          })}
        >
          &nbsp;
        </td>,
      );
    }
    return lines;
  };

  /**
   * 渲染子节点
   * @param datas
   * @returns
   */
  const renderChildren = (datas: NodeDataType[] = []): React.ReactNode => {
    if (datas.length > 0) {
      return (
        <>
          <tr className={'lines'}>{renderVerticalLine()}</tr>
          <tr className={classNames('lines', { hidden: !expanded })}>
            {renderConnectLines()}
          </tr>
          <tr className={classNames('nodes', { hidden: !expanded })}>
            {datas.map((data) => {
              return (
                <td key={data.key} colSpan={2}>
                  <DefaultOrgChart {...props} data={data} />
                </td>
              );
            })}
          </tr>
        </>
      );
    }
    return;
  };

  React.useEffect(() => {
    setExpanded(expandAll);
  }, [expandAll]);

  return (
    <table>
      <tbody>
        {renderNode(data)}
        {renderChildren(data.children)}
      </tbody>
    </table>
  );
};

export default DefaultOrgChart;
