import { Modal, Table, Tag, Avatar, Space } from "antd";
import type { UserAccountDTO } from "../../../types/entity.type";

interface Props {
  open: boolean;
  onClose: () => void;
  users: UserAccountDTO[];
  loading?: boolean;
}

const NewUsersModal = ({ open, onClose, users, loading }: Props) => {
  const columns = [
    {
      title: "Khách hàng",
      key: "user",
      render: (_: any, record: UserAccountDTO) => (
        <Space>
          <Avatar style={{ backgroundColor: "#87d068" }}>
            {record.fullName?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 600 }}>{record.fullName}</span>
            <span style={{ fontSize: 12, color: "#999" }}>@{record.username}</span>
          </div>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "roles",
      key: "roles",
      render: (roles: string[]) => (
        <>
          {roles?.map((role) => (
            <Tag color="blue" key={role}>
              {role}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val: string) => (val ? new Date(val).toLocaleDateString("vi-VN") : "-"),
    },
  ];

  return (
    <Modal
      title="Khách hàng mới trong tuần"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        size="middle"
      />
    </Modal>
  );
};

export default NewUsersModal;
