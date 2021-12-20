import React from 'react';
import OrgChart, { OrgChartNodeDataType } from '@twp0217/react-org-chart';

export default () => {
  const data: OrgChartNodeDataType = require('./data.json');

  const [expandAll, setExpandAll] = React.useState<boolean>(false);

  return (
    <div>
      <div>
        <button onClick={() => setExpandAll(!expandAll)}>
          {expandAll ? '收起' : '展开'}
        </button>
      </div>
      <br />
      <OrgChart expandable data={data} expandAll={expandAll} />
    </div>
  );
};
