import classNames from 'classnames';
import React from 'react';
import DefaultOrgChart from './components/DefaultOrgChart';
import { OrgChartProps } from './interface';
import styles from './OrgChart.module.less';

const OrgChart = (props: OrgChartProps) => {
  const { data, className, style, renderNode, onClick } = props;

  return !!data ? (
    <div
      className={classNames(styles.orgChartContainer, className)}
      style={style}
    >
      <DefaultOrgChart data={data} renderNode={renderNode} onClick={onClick} />
    </div>
  ) : null;
};

export default OrgChart;
