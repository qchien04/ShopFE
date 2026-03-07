// pages/Admin/ReviewManagePage.tsx
import { Table, Rate, Button, Tag, Space, Tabs, Popconfirm } from "antd";
import { CheckOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAdminReviews, useApproveReview, useDeleteReview, useRejectReview } from "../../../hooks/Admin";

export default function ReviewManagePage() {
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [page, setPage] = useState(0);

  const { data, isLoading } = useAdminReviews(status, page);
  const { mutate: approve, isPending: approving } = useApproveReview();
  const { mutate: reject, isPending: rejecting } = useRejectReview();
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
      title: "Trạng thái",
      dataIndex: "status",
      width: 130,
      render: (s: string) => (
        <Tag color={s === "APPROVED" ? "green" : s === "REJECTED" ? "red" : "orange"}>
          {s === "APPROVED" ? "Đã duyệt" : s === "REJECTED" ? "Từ chối" : "Chờ duyệt"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      render: (_: any, record: any) =>
        (
          <Space orientation="vertical" >
            { record.reviewStatus === "PENDING" &&(<>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                size="small"
                loading={approving}
                onClick={() => approve(record.id)}
              >
                Duyệt
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                size="small"
                loading={rejecting}
                onClick={() => reject(record.id)}
              >
                Từ chối
              </Button>
            </>  
            )}
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
          { key: "PENDING", label: "Chờ duyệt" },
          { key: "APPROVED", label: "Đã duyệt" },
          { key: "REJECTED", label: "Từ chối" },
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
