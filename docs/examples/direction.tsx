import React from 'react';
import OrgChart, {
  OrgChartNodeDataType,
  OrgChartProps,
} from '@twp0217/react-org-chart';

export default () => {
  const data: OrgChartNodeDataType = require('./data.json');

  const [direction, setDirection] =
    React.useState<OrgChartProps['direction']>('horizontal');

  return (
    <div>
      <div>
        <button
          style={{ color: direction === 'horizontal' ? 'blue' : null }}
          onClick={() => setDirection('horizontal')}
        >
          horizontal
        </button>
        <button
          style={{ color: direction === 'vertical' ? 'blue' : null }}
          onClick={() => setDirection('vertical')}
        >
          vertical
        </button>
      </div>
      <OrgChart data={data} direction={direction} />
    </div>
  );
};
