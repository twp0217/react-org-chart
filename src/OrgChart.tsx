import classNames from 'classnames';
import React from 'react';
import { OrgChartProps } from './interface';
import OrgChartNode from './components/OrgChartNode';
import './OrgChart.less';

const OrgChart = (props: OrgChartProps) => {
  const { data, className, style, ...otherProps } = props;

  return !!data ? (
    <div className={classNames('org-chart-container', className)} style={style}>
      <OrgChartNode {...otherProps} data={data} />
    </div>
  ) : null;
};

OrgChart.defaultProps = {
  direction: 'vertical',
  expandAll: true,
  expandable: false,
};

export default OrgChart;
