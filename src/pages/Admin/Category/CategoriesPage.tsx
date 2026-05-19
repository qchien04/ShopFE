import { Button, Space, Popconfirm, Image, Input, Spin, Pagination } from "antd";
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
  FolderOpenOutlined
} from "@ant-design/icons";
import "./CategoriesPage.scss";

const CategoriesPage = () => {
  const [searchText, setSearchText] = useState("");
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

  const filteredData = data?.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  const handleDelete = (id: number) => {
    deleteCategory(id);
  };

  // Pagination bounds
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: "space-between", width: "100%" }}>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          style={{ borderRadius: 8, fontWeight: 600 }}
        >
          ➕ Thêm danh mục
        </Button>
        <Input.Search
          placeholder="Tìm kiếm danh mục..."
          style={{ width: 320 }}
          size="large"
          enterButton
          onSearch={(value) => {
            setSearchText(value);
            setPage(1);
          }}
          onChange={(e) => {
            if (!e.target.value) {
              setSearchText("");
              setPage(1);
            }
          }}
          allowClear
        />
      </Space>

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
                      {category.icon && (
                        <span className="category-icon-badge" title="Icon">
                          {category.icon}
                        </span>
                      )}
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


