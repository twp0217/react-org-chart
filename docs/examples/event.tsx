import React from 'react';
import OrgChart, { NodeDataType } from '@twp0217/react-org-chart';

export default () => {
  const data = require('./data.json');

  const onClick = (node: NodeDataType) => {
    console.log('onClick', node);
  };

  return (
    <div
      style={{
        overflow: 'auto',
        textAlign: 'center',
      }}
    >
      <OrgChart data={data} onClick={onClick} />
    </div>
  );
};
