import { NodeDataType, OrgChartComponentProps } from '../interface';
import classNames from 'classnames';
import React from 'react';

const DefaultOrgChart = (props: OrgChartComponentProps) => {
  const {
    expandAll = true,
    expandable = false,
    renderNode: customRenderNode,
    loadChildren: customLoadChildren,
    onExpand,
    onClick,
  } = props;

  const [data, setData] = React.useState(props.data);
  const [expanded, setExpanded] = React.useState<boolean>(
    data?.expand ?? expandAll ?? false,
  );
  const [loadingChildren, setLoadingChildren] = React.useState<boolean>(false);
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
    if (
      !data.children &&
      data.loadChildren === true &&
      !!customLoadChildren &&
      newExpanded
    ) {
      setLoadingChildren(true);
      Promise.resolve(customLoadChildren(data))
        .then((children) => {
          setLoadingChildren(false);
          const newData = data;
          newData.children = children;
          setData(newData);
          setExpanded(newExpanded);
          onExpand && onExpand(newExpanded, data);
        })
        .catch((error) => {
          setLoadingChildren(false);
          console.log(
            'DefaultOrgChart handleExpandChange load children error',
            error,
          );
        });
    } else {
      setExpanded(newExpanded);
      onExpand && onExpand(newExpanded, data);
    }
  };

  /**
   * 渲染垂直线
   * @returns
   */
  const renderVerticalLine = (): React.ReactNode => {
    return (
      <td colSpan={colSpan}>
        <div className="vertical-line" />
        {expandable ? (
          <div
            className={classNames({
              'expand-icon': expandable,
              'expand-icon-expanded':
                expandable && expanded && !loadingChildren,
              'expand-icon-collapsed':
                expandable && !expanded && !loadingChildren,
              'expand-icon-loading-children':
                expandable && !expanded && loadingChildren,
            })}
            onClick={() => handleExpandChange()}
          />
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
    if ((datas?.length ?? 0) > 0) {
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
    } else if (data.loadChildren === true && !!customLoadChildren) {
      return (
        <>
          <tr className={'lines'}>{renderVerticalLine()}</tr>
        </>
      );
    }
    return;
  };

  React.useEffect(() => {
    setExpanded(data?.expand ?? expandAll ?? false);
  }, [data?.expand, expandAll]);

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
