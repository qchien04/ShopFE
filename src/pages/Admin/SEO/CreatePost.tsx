import React, { useState, useEffect } from "react";
import {
  Table, Button, Space, Input, Select, Popconfirm, Tag, Switch,
  Card, Typography, message, Empty, Tooltip
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined,
  SearchOutlined, CalendarOutlined, FolderOpenOutlined
} from "@ant-design/icons";
import { postApi } from "../../../api/post.api";
import type { Post, PostPayload, PostStatus } from "../../../types/entity.type";
import SalePostEditor from "./SalePostEditor";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const CreatePostPage: React.FC = () => {
  // State management
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Table state
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Filter state
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<PostStatus | undefined>(undefined);

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await postApi.getAll({
        page: currentPage - 1,
        size: pageSize,
        keyword: searchText || undefined,
        category: selectedCategory || undefined,
        status: selectedStatus || undefined
      });
      setPosts(res.content || []);
      setTotal(res.totalElements || 0);
    } catch {
      message.error("Không thể tải danh sách bài viết!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "list") {
      fetchPosts();
    }
  }, [currentPage, selectedCategory, selectedStatus, mode]);

  // Handle Search submit
  const handleSearch = () => {
    setCurrentPage(1);
    fetchPosts();
  };

  // Toggle status
  const handleToggleStatus = async (id: number, currentStatus: PostStatus) => {
    const newStatus: PostStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      await postApi.updateStatus(id, newStatus);
      message.success(`Đã chuyển trạng thái sang ${newStatus === "PUBLISHED" ? "Đã đăng" : "Bản nháp"}`);
      fetchPosts();
    } catch {
      message.error("Thay đổi trạng thái thất bại!");
    }
  };

  // Delete post
  const handleDelete = async (id: number) => {
    try {
      await postApi.delete(id);
      message.success("Xóa bài viết thành công!");
      fetchPosts();
    } catch {
      message.error("Xóa bài viết thất bại!");
    }
  };

  // Save post from editor
  const handleSave = async (data: PostPayload) => {
    try {
      if (mode === "create") {
        await postApi.create(data);
      } else if (mode === "edit" && editingPost) {
        await postApi.update(editingPost.id, data);
      }
      setMode("list");
      setEditingPost(null);
    } catch {
      throw new Error("Lưu thất bại");
    }
  };

  // Table Columns
  const columns = [
    {
      title: "Ảnh đại diện",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 120,
      render: (url: string) => (
        <div style={{ position: "relative", width: 80, height: 50, borderRadius: 8, overflow: "hidden", background: "#f5f5f5" }}>
          {url ? (
            <img src={url} alt="thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#bfbfbf" }}>
              <FileTextOutlined style={{ fontSize: 20 }} />
            </div>
          )}
        </div>
      )
    },
    {
      title: "Tiêu đề bài viết",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Post) => (
        <div>
          <Text style={{ fontSize: 15, fontWeight: 700, color: "#262626" }}>{text}</Text>
          {record.description && (
            <div style={{ marginTop: 4 }}>
              <Text type="secondary" ellipsis style={{ maxWidth: 400, fontSize: 13 }}>
                {record.description}
              </Text>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 180,
      render: (cat: string) => {
        let label = cat;
        let color = "blue";
        if (cat === "meo-vat") { label = "Mẹo vặt"; color = "cyan"; }
        else if (cat === "huong-dan") { label = "Hướng dẫn"; color = "purple"; }
        else if (cat === "tin-tuc") { label = "Tin tức"; color = "geekblue"; }
        else if (cat === "khuyen-mai") { label = "Khuyến mãi"; color = "volcano"; }

        return (
          <Tag color={color} style={{ borderRadius: 6, fontWeight: 600, padding: "2px 8px" }}>
            <FolderOpenOutlined style={{ marginRight: 4 }} />
            {label}
          </Tag>
        );
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: PostStatus, record: Post) => (
        <Space size={8}>
          <Switch
            checked={status === "PUBLISHED"}
            onChange={() => handleToggleStatus(record.id, status)}
            checkedChildren="Đăng"
            unCheckedChildren="Nháp"
            style={{
              backgroundColor: status === "PUBLISHED" ? "#00c853" : undefined
            }}
          />
        </Space>
      )
    },
    {
      title: "Cập nhật lúc",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      render: (date: string) => (
        <span style={{ color: "#595959", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <CalendarOutlined style={{ color: "#bfbfbf" }} />
          {dayjs(date).format("DD/MM/YYYY HH:mm")}
        </span>
      )
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      align: "center" as const,
      render: (record: Post) => (
        <Space size={8}>
          <Tooltip title="Chỉnh sửa bài viết">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#00c853" }} />}
              onClick={() => {
                setEditingPost(record);
                setMode("edit");
              }}
              style={{ background: "#e8fced", borderRadius: 8 }}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa bài viết này?"
            description="Hành động này sẽ xóa vĩnh viễn bài viết khỏi hệ thống."
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa bài viết">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                style={{ background: "#fff1f0", borderRadius: 8 }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  if (mode === "create") {
    return (
      <SalePostEditor
        onSave={handleSave}
        onCancel={() => setMode("list")}
      />
    );
  }

  if (mode === "edit" && editingPost) {
    return (
      <SalePostEditor
        onSave={handleSave}
        initialData={{
          title: editingPost.title,
          category: editingPost.category,
          content: editingPost.content,
          thumbnail: editingPost.thumbnail,
          tags: editingPost.tags,
          description: editingPost.description
        }}
        onCancel={() => {
          setEditingPost(null);
          setMode("list");
        }}
      />
    );
  }

  return (
    <div style={{ background: "#f8f9fa", minHeight: "calc(100vh - 64px)" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 800, color: "#262626" }}>
            📰 Quản lý bài viết & tin tức
          </Title>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setMode("create")}
          style={{
            height: 42,
            borderRadius: 10,
            fontWeight: 600,
            background: "#00c853",
            borderColor: "#00c853"
          }}
          className="btn-create-post"
        >
          Viết bài mới
        </Button>
      </div>

      {/* Filter and Action Bar */}
      <Card
        styles={{ body: { padding: 18 } }}
        style={{
          marginBottom: 20,
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.015)",
          border: "1px solid rgba(0,0,0,0.03)"
        }}
      >
        <Space size={16} wrap style={{ width: "100%" }}>
          <Input
            placeholder="Tìm kiếm theo tiêu đề bài viết..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 280, borderRadius: 8, height: 38 }}
            allowClear
          />

          <Select
            placeholder="Bộ lọc danh mục"
            value={selectedCategory}
            onChange={(val) => {
              setSelectedCategory(val);
              setCurrentPage(1);
            }}
            style={{ width: 200, height: 38 }}
            allowClear
            dropdownStyle={{ borderRadius: 8 }}
          >
            <Option value="meo-vat">Mẹo vặt</Option>
            <Option value="huong-dan">Hướng dẫn</Option>
            <Option value="tin-tuc">Tin tức</Option>
            <Option value="khuyen-mai">Khuyến mãi</Option>
          </Select>

          <Select
            placeholder="Trạng thái"
            value={selectedStatus}
            onChange={(val) => {
              setSelectedStatus(val);
              setCurrentPage(1);
            }}
            style={{ width: 150, height: 38 }}
            allowClear
            dropdownStyle={{ borderRadius: 8 }}
          >
            <Option value="PUBLISHED">Đã đăng</Option>
            <Option value="DRAFT">Bản nháp</Option>
          </Select>

          <Button
            type="primary"
            onClick={handleSearch}
            style={{
              height: 38,
              borderRadius: 8,
              background: "#00c853",
              borderColor: "#00c853",
              fontWeight: 600
            }}
          >
            Tìm kiếm
          </Button>
        </Space>
      </Card>

      {/* Main Table Grid */}
      <Card
        styles={{ body: { padding: 0 } }}
        style={{
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.02)",
          border: "1px solid rgba(0,0,0,0.03)"
        }}
      >
        <Table
          dataSource={posts}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page) => setCurrentPage(page),
            showTotal: (t) => `Tổng số ${t} bài viết`,
            style: { padding: "16px 24px", margin: 0 }
          }}
          locale={{
            emptyText: <Empty description="Không tìm thấy bài viết nào" />
          }}
          className="premium-admin-table"
        />
      </Card>
    </div>
  );
};

export default CreatePostPage;