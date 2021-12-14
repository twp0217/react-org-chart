import classNames from 'classnames';
import React from 'react';
import DefaultOrgChart from './components/DefaultOrgChart';
import { OrgChartProps } from './interface';
import styles from './OrgChart.module.less';

const OrgChart = (props: OrgChartProps) => {
  const { data, className, style, ...otherProps } = props;

  return !!data ? (
    <div
      className={classNames(styles.orgChartContainer, className)}
      style={{ textAlign: 'center', ...style }}
    >
      <DefaultOrgChart {...otherProps} data={data} />
    </div>
  ) : null;
};

export default OrgChart;
