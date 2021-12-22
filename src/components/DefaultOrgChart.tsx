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

  //region data with key map
  const [data, setData] = React.useState(props.data);
  const getValue = (key: string, fromData: NodeDataType = data) =>
    fromData[props.keyMap?.[key] ?? key];
  const setValue = (key: string, value: any, toData: NodeDataType = data) => {
    toData[props.keyMap?.[key] ?? key] = value;
    return toData;
  };
  const label = getValue('label');
  const style = getValue('style');
  const className = getValue('className');
  const loadChildren = getValue('loadChildren');
  const expand = getValue('expand');
  const children = () =>
    getValue('children')?.filter((item: NodeDataType) => {
      return props.filter?.(item) ?? true;
    });
  const childrenLength = () => children()?.length || 0;
  const [colSpan, setColSpan] = React.useState(childrenLength() * 2);
  //endregion

  if (props.debug === true) {
    console.log('DefaultOrgChart props=', props);
    console.log('DefaultOrgChart label=', label);
    console.log('DefaultOrgChart style=', style);
    console.log('DefaultOrgChart className=', className);
    console.log('DefaultOrgChart loadChildren=', loadChildren);
    console.log('DefaultOrgChart expand=', expand);
    console.log('DefaultOrgChart children=', children());
    console.log('DefaultOrgChart childrenLength=', childrenLength());
  }

  // eslint-disable-next-line
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [expanded, setExpanded] = React.useState<boolean>(
    expand ?? expandAll ?? false,
  );
  const [loadingChildren, setLoadingChildren] = React.useState<boolean>(false);
  const expandableOnlyOneOnSameTime =
    props.expandableOnlyOneOnSameTime ?? false;

  /**
   * 渲染节点
   * @param data
   */
  const renderNode = (data: NodeDataType): React.ReactNode => {
    const contentNode: React.ReactNode = (
      <div className="node-content" title={label}>
        {label}
      </div>
    );
    return (
      <tr>
        <td colSpan={colSpan}>
          <div
            className={classNames('node', className)}
            style={style}
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
      (children()?.length ?? 0 <= 0) &&
      loadChildren === true &&
      !!customLoadChildren &&
      newExpanded
    ) {
      setLoadingChildren(true);
      Promise.resolve(customLoadChildren(data))
        .then((newChildren) => {
          setLoadingChildren(false);
          if (!expandableOnlyOneOnSameTime) {
            const newData = data;
            setValue('children', newChildren, newData);
            setData(newData);
          } else {
            setValue('children', newChildren);
          }
          setColSpan(childrenLength() * 2);
          processExpanded(newExpanded);
        })
        .catch((ignore) => {
          setLoadingChildren(false);
        });
    } else {
      processExpanded(newExpanded);
    }
  };

  const getExpandedPath = (newExpanded = expanded) =>
    (props.expandedPath ?? []).concat(newExpanded ? [label] : []);

  const processExpanded = (newExpanded: boolean) => {
    if (
      !props.setBrothersExpand ||
      !newExpanded ||
      !expandableOnlyOneOnSameTime ||
      childrenLength() <= 1
    ) {
      setExpanded(newExpanded);
      onExpand && onExpand(newExpanded, data, getExpandedPath(newExpanded));
    } else {
      props.setBrothersExpand?.(
        (item) => (getValue('label', item) === label ? newExpanded : false),
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
    children()?.map((item: NodeDataType) => {
      let newExpand = handleChildExpanded(item);
      let oldExpand = getValue('expand', item);
      if (
        (getValue('children', item)?.length ?? 0 > 0) &&
        oldExpand !== newExpand
      ) {
        if (
          (!oldExpand && newExpand === true) ||
          (oldExpand === true && !newExpand)
        ) {
          changeCount++;
        }
        setValue('expand', newExpand, item);
      }
    });
    if (changeCount > 1) {
      forceUpdate();
    } else {
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
  const renderChildren = (children: NodeDataType[]): React.ReactNode => {
    if ((children?.length ?? 0) > 0) {
      let uniqueTime = new Date().getTime();
      return (
        <>
          <tr className={'lines'}>{renderVerticalLine()}</tr>
          <tr className={classNames('lines', { hidden: !expanded })}>
            {renderConnectLines()}
          </tr>
          <tr className={classNames('nodes', { hidden: !expanded })}>
            {children.map((child, index) => {
              return (
                <td
                  key={getValue('key', child) ?? `${uniqueTime}_${index}`}
                  colSpan={2}
                >
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
    } else if (loadChildren === true && !!customLoadChildren) {
      return (
        <>
          <tr className={'lines'}>{renderVerticalLine()}</tr>
        </>
      );
    }
    return;
  };

  React.useEffect(() => {
    setExpanded(expand ?? expandAll ?? false);
  }, [data, expand, expandAll]);

  return (
    <table>
      <tbody>
        {renderNode(data)}
        {renderChildren(children())}
      </tbody>
    </table>
  );
};

export default DefaultOrgChart;
