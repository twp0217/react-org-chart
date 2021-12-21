import { NodeDataType, OrgChartComponentProps } from '../interface';
import classNames from 'classnames';
import React, { useReducer } from 'react';

const DefaultOrgChart = (props: OrgChartComponentProps) => {
  const {
    expandAll = true,
    expandable = false,
    renderNode: customRenderNode,
    loadChildren: customLoadChildren,
    onExpand,
    onClick,
  } = props;

  // eslint-disable-next-line
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [data, setData] = React.useState(props.data);
  const [expanded, setExpanded] = React.useState<boolean>(
    data?.expand ?? expandAll ?? false,
  );
  const [loadingChildren, setLoadingChildren] = React.useState<boolean>(false);
  const childrenLength = data.children?.length || 0;
  const colSpan: number = childrenLength * 2;
  const expandableOnlyOneOnSameTime =
    props.expandableOnlyOneOnSameTime ?? false;

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
          console.log(
            'handleExpandChange expandableOnlyOneOnSameTime=',
            expandableOnlyOneOnSameTime,
            ', children=',
            children,
          );
          setLoadingChildren(false);

          if (!expandableOnlyOneOnSameTime) {
            const newData = data;
            newData.children = children;
            setData(newData);
          } else {
            data.children = children;
          }
          processExpanded(newExpanded);
        })
        .catch((error) => {
          setLoadingChildren(false);
          console.log(
            'DefaultOrgChart handleExpandChange load children error',
            error,
          );
        });
    } else {
      processExpanded(newExpanded);
    }
  };

  const getExpandedPath = (newExpanded = expanded) =>
    (props.expandedPath ?? []).concat(newExpanded ? [data.label] : []);

  const processExpanded = (newExpanded: boolean) => {
    if (
      !newExpanded ||
      !expandableOnlyOneOnSameTime ||
      (data?.children?.length ?? 0) <= 1
    ) {
      setExpanded(newExpanded);
      onExpand && onExpand(newExpanded, data, getExpandedPath(newExpanded));
    } else {
      props?.setBrothersExpand?.(
        (item) => (item.label === data.label ? newExpanded : false),
        (processBySelf) => {
          if (processBySelf) {
            setExpanded(newExpanded);
          }
        },
      );
      onExpand && onExpand(newExpanded, data, getExpandedPath(newExpanded));
    }
  };

  const setChildrenExpand = (
    handleChildExpanded: (item: NodeDataType) => boolean,
    handleExpandedBySelf: (processBySelf: boolean) => void,
  ) => {
    let changeCount = 0;
    data?.children?.map((item) => {
      let newExpand = handleChildExpanded(item);
      if ((item.children?.length ?? 0 > 0) && item.expand !== newExpand) {
        console.log(
          'setChildrenExpand item.label',
          changeCount,
          item.label,
          item.expand,
          newExpand,
        );
        if (item.expand !== undefined || !newExpand) {
          changeCount++;
        }
        item.expand = newExpand;
      }
    });
    if (changeCount > 1) {
      console.log('setChildrenExpand forceUpdate changeCount', changeCount);
      forceUpdate();
    } else {
      console.log(
        'setChildrenExpand handleExpandedBySelf changeCount',
        changeCount,
      );
      handleExpandedBySelf(true);
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
   * @param children
   * @returns
   */
  const renderChildren = (children: NodeDataType[] = []): React.ReactNode => {
    console.log('renderChildren', data);
    if ((children?.length ?? 0) > 0) {
      return (
        <>
          <tr className={'lines'}>{renderVerticalLine()}</tr>
          <tr className={classNames('lines', { hidden: !expanded })}>
            {renderConnectLines()}
          </tr>
          <tr className={classNames('nodes', { hidden: !expanded })}>
            {children.map((child) => {
              return (
                <td key={child.key} colSpan={2}>
                  <DefaultOrgChart
                    {...props}
                    data={child}
                    expandedPath={getExpandedPath()}
                    setBrothersExpand={(
                      handleChildExpanded: (item: NodeDataType) => boolean,
                      handleExpandedBySelf: (processBySelf: boolean) => void,
                    ) => {
                      setChildrenExpand(
                        handleChildExpanded,
                        handleExpandedBySelf,
                      );
                    }}
                  />
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
