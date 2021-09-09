import React from 'react';
import OrgChart from '@twp0217/react-org-chart';

export default () => {
  const data = require('./data.json');

  return <OrgChart data={data} expandable />;
};
