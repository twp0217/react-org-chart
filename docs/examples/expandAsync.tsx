import React from 'react';
import OrgChart, { NodeDataType } from '@twp0217/react-org-chart';

export default () => {
  const data: NodeDataType = {
    key: 0,
    label: '科技有限公司',
    expand: true,
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
      { key: 4, label: '人事部', loadChildren: true },
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
      <div
        style={{
          textAlign: 'center',
          width: '500px',
          height: 'auto',
          overflowX: 'scroll',
          overflowY: 'hidden',
          background: 'white',
          padding: 20,
        }}
      >
        <OrgChart
          expandable
          data={data}
          expandAll={expandAll}
          loadChildren={(_data: NodeDataType) => {
            return new Promise((resolve, _reject) => {
              setTimeout(() => {
                resolve([
                  {
                    key: 41,
                    label: '人事一部',
                  },
                  {
                    key: 42,
                    label: '人事二部',
                  },
                  {
                    key: 43,
                    label: '人事三部',
                  },
                  {
                    key: 44,
                    label: '人事四部',
                  },
                  {
                    key: 45,
                    label: '人事五部',
                  },
                  {
                    key: 46,
                    label: '人事六部',
                  },
                  {
                    key: 47,
                    label: '人事七部',
                  },
                  {
                    key: 48,
                    label: '人事八部',
                  },
                  {
                    key: 49,
                    label: '人事九部',
                  },
                ]);
              }, 2000);
            });
          }}
        />
      </div>
    </div>
  );
};
