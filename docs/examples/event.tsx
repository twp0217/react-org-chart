import React from 'react';
import OrgChart, { NodeDataType } from '@twp0217/react-org-chart';

export default () => {
  const data = require('./data.json');

  const onClick = (node: NodeDataType) => {
    console.log('onClick', node);
  };

  const onExpand = (expanded: boolean, node: NodeDataType) => {
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
