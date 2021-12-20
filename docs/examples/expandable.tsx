import React from 'react';
import OrgChart, { OrgChartNodeDataType } from '@twp0217/react-org-chart';

export default () => {
  const data: OrgChartNodeDataType = require('./data.json');

  return <OrgChart data={data} expandable />;
};
