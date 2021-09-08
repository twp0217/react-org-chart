import { NodeDataType, OrgChartComponentProps, RenderNode } from '../interface';
import classNames from 'classnames';
import React from 'react';

const DefaultOrgChart = (props: OrgChartComponentProps) => {
  const { data, renderNode: customRenderNode, onClick } = props;

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
   * 渲染垂直线
   * @returns
   */
  const renderVerticalLine = (): React.ReactNode => {
    return (
      <td colSpan={colSpan}>
        <div className="vertical"></div>
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
          <tr className="lines">{renderVerticalLine()}</tr>
          <tr className="lines">{renderConnectLines()}</tr>
          <tr className="nodes">
            {datas.map((data) => {
              return (
                <td key={data.key} colSpan={2}>
                  <DefaultOrgChart
                    data={data}
                    renderNode={customRenderNode}
                    onClick={onClick}
                  />
                </td>
              );
            })}
          </tr>
        </>
      );
    }
    return;
  };

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
