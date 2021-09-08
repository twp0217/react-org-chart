# react-org-chart - 组织结构图

## 使用

```typescript
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

  return <OrgChart data={data} />;
};
```

## API

### NodeDataType

| 名称      | 类型                | 默认值 | 说明       |
| --------- | ------------------- | ------ | ---------- |
| key       | string \| number    | -      | key        |
| label     | number              | -      | label      |
| children  | NodeDataType[]      | -      | 子节点集合 |
| className | string              | -      | 类名       |
| style     | React.CSSProperties | -      | 样式       |

### OrgChartProps

| 名称       | 类型                                                                  | 默认值 | 说明           |
| ---------- | --------------------------------------------------------------------- | ------ | -------------- |
| data       | NodeDataType                                                          | -      | 数据           |
| className  | string                                                                | -      | 类名           |
| style      | React.CSSProperties                                                   | -      | 样式           |
| renderNode | (node: NodeDataType, originNode: React.ReactNode) => React.ReactNode; | -      | 自定义渲染节点 |
| onClick    | (node: NodeDataType) => void                                          | -      | 点击事件       |
