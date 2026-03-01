import { Table, Button, Space, Popconfirm, Image, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useCategoryList } from "../../../hooks/Category/useCategotyList";
import { useDeleteCategory } from "../../../hooks/Category/useDeleteCategory";
import type { Category } from "../../../types/categories.type";
import { useCreateCategory } from "../../../hooks/Category/useCreateCategory";
import { useUpdateCategory } from "../../../hooks/Category/useUpdateCategory";
import CategoryModal from "./CategoryModal";


const CategoriesPage = () => {
  const [searchText, setSearchText] = useState("");
  
  const { data, isLoading } = useCategoryList();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const { mutate: deleteCategory, isPending: deleting } = useDeleteCategory();
  const { mutate: createCategory, isPending: creating } = useCreateCategory();
  const { mutate: updateCategory, isPending: updating } = useUpdateCategory();

  const fr=data?.map((p)=>{
    return {
      id:p.id,
      slug: p.slug,
      name:p.name
    }
  })
  console.log({fr})
  
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
  );

  const handleDelete = (id: number) => {
    deleteCategory(id);
  };

  const columns: ColumnsType<Category> = [
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (url) => (
        <Image
          width={80}
          height={80}
          style={{ objectFit: "cover", borderRadius: 6 }}
          src={url}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />
      ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
    },
    {
      title: "Icon",
      dataIndex: "icon",
    },
    {
      title: "Slug",
      dataIndex: "slug",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
    },
    {
      title: "Hành động",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setEditing(record);
              setOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa danh mục này?"
            description="Hành động này không thể hoàn tác!"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger size="small" loading={deleting}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: "space-between", width: "100%" }}>
        <Button type="primary" onClick={() => {
          setEditing(null);
          setOpen(true);
        }}>
          ➕ Thêm danh mục
        </Button>
        <Input.Search
          placeholder="Tìm kiếm danh mục..."
          style={{ width: 300 }}
          onSearch={(value) => setSearchText(value)}
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
      />

      <Table
        bordered
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        loading={isLoading}
        scroll={{ x: 1269 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} danh mục`,
        }}
      />
    </div>
  );
};

export default CategoriesPage;


