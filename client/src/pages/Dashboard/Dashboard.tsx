import React from "react";
import { Card } from "antd";
import { Table } from "antd";
import { AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import DashboardContainer from "../../components/DashboardContainer";
import ChartWrapper from "../../components/ChartWrapper";

const data = [
  { month: "Jan", amount: 400 },
  { month: "Feb", amount: 300 },
  { month: "Mar", amount: 500 },
  { month: "Apr", amount: 200 },
];

const columns = [
  { title: "Date", dataIndex: "date", key: "date" },
  { title: "Category", dataIndex: "category", key: "category" },
  { title: "Amount", dataIndex: "amount", key: "amount" },
];

const tableData = [
  { key: "1", date: "2025-06-15", category: "Food", amount: 50 },
  { key: "2", date: "2025-06-16", category: "Transport", amount: 20 },
];

const Dashboard: React.FC = () => {
  return (
    <DashboardContainer>
      <Card title="Total Expenses">$1,200</Card>
      <Card title="Total Categories">5</Card>
      <ChartWrapper>
        <AreaChart width={400} height={200} data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="amount" />
        </AreaChart>
      </ChartWrapper>
      <Table columns={columns} dataSource={tableData} />
    </DashboardContainer>
  );
};

export default Dashboard;
