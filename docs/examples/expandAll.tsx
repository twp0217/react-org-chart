import React from 'react';
import OrgChart, { NodeDataType } from '@twp0217/react-org-chart';

export default () => {
  const data: NodeDataType = {
    key: 0,
    label: '科技有限公司',
    children: [
      {
        key: 1,
        label: '研发部',
        children: [
          { key: 11, label: '开发-前端' },
          { key: 12, label: '开发-后端' },
          { key: 13, label: 'UI设计' },
          { key: 14, label: '产品经理' },
        ],
      },
      {
        key: 2,
        label: '销售部',
        children: [
          { key: 21, label: '销售一部' },
          { key: 22, label: '销售二部' },
        ],
      },
      { key: 3, label: '财务部' },
      { key: 4, label: '人事部' },
    ],
  };

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
