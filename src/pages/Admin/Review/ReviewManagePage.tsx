// pages/Admin/ReviewManagePage.tsx
import { Table, Rate, Button, Space, Tabs, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAdminReviews, useDeleteReview } from "../../../hooks/Admin";

export default function ReviewManagePage() {
  const [status, setStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [page, setPage] = useState(0);

  const { data, isLoading } = useAdminReviews(status as any, page);
  const { mutate: remove, isPending: deleting } = useDeleteReview();

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      width: 200,
    },
    {
      title: "Người dùng",
      dataIndex: "userName",
      width: 150,
    },
    {
      title: "Sao",
      dataIndex: "rating",
      width: 120,
      render: (rating: number) => (
        <Rate disabled value={rating} style={{ fontSize: 13 }} />
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "comment",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Ngày",
      dataIndex: "createdAt",
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      render: (_: any, record: any) =>
        (
          <Space orientation="vertical" >
            <Popconfirm
              title="Xóa đánh giá này?"
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() => remove(record.id)}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                loading={deleting}
              >
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý đánh giá</h2>

      <Tabs
        activeKey={status}
        onChange={(key) => { setStatus(key as any); setPage(0); }}
        items={[
          { key: "APPROVED", label: "Đánh giá công khai" },
          { key: "REJECTED", label: "Đã ẩn" },
        ]}
      />

      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data?.content}
        rowKey="id"
        pagination={{
          current: page + 1,
          pageSize: 10,
          total: data?.totalElements,
          onChange: (p) => setPage(p - 1),
        }}
      />
    </div>
  );
}
