import { Table, Button, Space, Popconfirm, Image, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useBrandList, useCreateBrand, useDeleteBrand, useUpdateBrand } from "../../../hooks/Brand/useBrand";
import type { Brand } from "../../../types/entity.type";
import BrandModal from "./BrandModal";


const BrandsPage = () => {
  const [searchText, setSearchText] = useState("");
  
  const { data, isLoading } = useBrandList();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const { mutate: deleteBrand, isPending: deleting } = useDeleteBrand();
  const { mutate: createBrand, isPending: creating } = useCreateBrand();
  const { mutate: updateBrand, isPending: updating } = useUpdateBrand();

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      logo: values.logo[0]?.response?.imageUrl || values.logo[0]?.url,
    };

    if (editing) {
      updateBrand({ id: editing.id, ...payload });
    } else {
      createBrand(payload);
    }

    setOpen(false);
    setEditing(null);
  };

  const filteredData = data?.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = (id: number) => {
    deleteBrand(id);
  };

  const columns: ColumnsType<Brand> = [
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Logo",
      dataIndex: "logo",
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
      title: "Tên",
      dataIndex: "name",
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
      title: "Mô tả",
      dataIndex: "website",
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
            title="Xóa brand này?"
            description="Hành động này không thể hoàn tác!"
            onConfirm={() => handleDelete(record.id||0)}
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
          ➕ Thêm brand
        </Button>
        <Input.Search
          placeholder="Tìm kiếm brand..."
          style={{ width: 300 }}
          onSearch={(value) => setSearchText(value)}
          allowClear
        />
      </Space>

      <BrandModal
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        loading={creating || updating}
        brand={editing}
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
          showTotal: (total) => `Tổng ${total} brand`,
        }}
      />
    </div>
  );
};

export default BrandsPage;


