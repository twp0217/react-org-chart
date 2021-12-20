import React from 'react';
import OrgChart, { OrgChartNodeDataType } from '@twp0217/react-org-chart';

export default () => {
  const data: OrgChartNodeDataType = require('./data.json');

  const onClick = (node: OrgChartNodeDataType) => {
    console.log('onClick', node);
  };

  const onExpand = (expanded: boolean, node: OrgChartNodeDataType) => {
    console.log('onExpand', expanded, node);
  };

  return (
    <div
      style={{
        overflow: 'auto',
        textAlign: 'center',
      }}
    >
      <OrgChart data={data} expandable onClick={onClick} onExpand={onExpand} />
    </div>
  );
};
