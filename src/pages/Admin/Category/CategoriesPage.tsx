import { Button, Space, Popconfirm, Image, Input, Spin, Pagination, Select, Row, Col } from "antd";
import { useState } from "react";
import { useCategoryList } from "../../../hooks/Category/useCategotyList";
import { useDeleteCategory } from "../../../hooks/Category/useDeleteCategory";
import type { Category } from "../../../types/categories.type";
import { useCreateCategory } from "../../../hooks/Category/useCreateCategory";
import { useUpdateCategory } from "../../../hooks/Category/useUpdateCategory";
import CategoryModal from "./CategoryModal";
import {
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  FolderOpenOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";
import "./CategoriesPage.scss";

const CategoriesPage = () => {
  const [searchText, setSearchText] = useState("");
  const [filterParent, setFilterParent] = useState<number | 'root' | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useCategoryList();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const { mutate: deleteCategory, isPending: deleting } = useDeleteCategory();
  const { mutate: createCategory, isPending: creating } = useCreateCategory();
  const { mutate: updateCategory, isPending: updating } = useUpdateCategory();

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      image: values.image[0]?.response?.imageUrl || values.image[0]?.url,
    };

    if (editing) {
      updateCategory({ id: editing.id, ...payload });
    } else {
      createCategory(payload);
    }

    setOpen(false);
    setEditing(null);
  };

  const filteredData = data?.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.slug && item.slug.toLowerCase().includes(searchText.toLowerCase()));

    const matchParent = filterParent === 'root'
      ? !item.parentId
      : filterParent
        ? item.parentId === filterParent
        : true;

    return matchSearch && matchParent;
  }) || [];

  const handleDelete = (id: number) => {
    deleteCategory(id);
  };

  const parentCategories = data?.filter(c => !c.parentId) || [];

  // Pagination bounds
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="categories-page-wrapper">
      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col>
          <Space size={16}>
            <Input
              placeholder="Tìm tên hoặc slug..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              style={{ width: 280, borderRadius: 8 }}
              size="large"
              allowClear
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(1);
              }}
            />
            <Select
              placeholder="Lọc theo cấp độ"
              size="large"
              style={{ width: 220 }}
              allowClear
              onChange={(val) => {
                setFilterParent(val);
                setPage(1);
              }}
              suffixIcon={<FilterOutlined />}
              options={[
                { label: "Danh mục gốc (Root)", value: "root" },
                ...parentCategories.map(p => ({
                  label: `Con của: ${p.name}`,
                  value: p.id
                }))
              ]}
            />
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            size="large"
            icon={<PlusCircleOutlined />}
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            style={{ borderRadius: 8, fontWeight: 600, background: '#00c853', borderColor: '#00c853' }}
          >
            Thêm danh mục mới
          </Button>
        </Col>
      </Row>

      <CategoryModal
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        loading={creating || updating}
        category={editing}
        categories={data || []}
      />

      {isLoading ? (
        <div className="category-loading-container">
          <Spin size="large" tip="Đang tải danh sách danh mục..." />
        </div>
      ) : (
        <div className="category-list-container">
          {paginatedData.length > 0 ? (
            paginatedData.map((category) => {
              const parent = data?.find(c => c.id === category.parentId);

              return (
                <div key={category.id} className="category-row-card">
                  {/* Left: Category Image */}
                  <div className="category-card-img-wrapper">
                    <Image
                      width={72}
                      height={72}
                      style={{ objectFit: "cover", borderRadius: 8 }}
                      src={category.image}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                    />
                  </div>

                  {/* Middle: Info details */}
                  <div className="category-card-info">
                    <div className="category-title-row">
                      <h3 className="category-title">{category.name}</h3>
                      <span className="category-id-badge">ID: {category.id}</span>
                    </div>

                    <div className="category-slug-row">
                      {category.slug && (
                        <span className="slug-badge">
                          <LinkOutlined /> {category.slug}
                        </span>
                      )}
                      {parent && (
                        <span className="parent-badge">
                          <FolderOpenOutlined /> Cha: {parent.name}
                        </span>
                      )}
                    </div>

                    {category.description ? (
                      <p className="category-description" title={category.description}>
                        {category.description}
                      </p>
                    ) : (
                      <p className="category-description" style={{ color: "#bfbfbf", fontStyle: "italic" }}>
                        Chưa có mô tả cho danh mục này.
                      </p>
                    )}
                  </div>



                  {/* Right: Action buttons */}
                  <div className="category-card-actions">
                    <Button
                      type="primary"
                      className="btn-edit"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditing(category);
                        setOpen(true);
                      }}
                    >
                      Sửa
                    </Button>
                    <Popconfirm
                      title="Xóa danh mục này?"
                      description="Hành động này không thể hoàn tác!"
                      onConfirm={() => handleDelete(category.id)}
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <Button danger className="btn-delete" icon={<DeleteOutlined />} loading={deleting}>
                        Xóa
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="category-empty-state">
              Không tìm thấy danh mục nào phù hợp.
            </div>
          )}

          {/* Pagination */}
          <div className="category-pagination-container">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={filteredData.length}
              showSizeChanger
              showTotal={(total) => `Tổng ${total} danh mục`}
              onChange={(p, ps) => {
                setPage(p);
                setPageSize(ps);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;


