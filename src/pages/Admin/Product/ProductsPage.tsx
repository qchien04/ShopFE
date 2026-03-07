import { Table, Button, Space, Popconfirm, Tag, Image, Input, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useProductList } from "../../../hooks/Product/useProductList";
import { useDeleteProduct } from "../../../hooks/Product/useDeleteProduct";
import type { Product } from "../../../types/product.type";
import ProductForm from "./ProductFormProps";
import { useCreateProduct } from "../../../hooks/Product/useCreateProduct";
import { useUpdateProduct } from "../../../hooks/Product/useUpdateProduct";
import { useProductDetail } from "../../../hooks/Product/useProduct";

type ProductStatus = "DRAFT" | "PUBLISHED" | "OUT_OF_STOCK" | "DISCONTINUED";

const statusColor: Record<ProductStatus, string> = {
  DRAFT: "default",
  PUBLISHED: "success",
  OUT_OF_STOCK: "warning",
  DISCONTINUED: "error",
};

const statusText: Record<ProductStatus, string> = {
  DRAFT: "Nháp",
  PUBLISHED: "Đã xuất bản",
  OUT_OF_STOCK: "Hết hàng",
  DISCONTINUED: "Ngừng kinh doanh",
};

const ProductsPage = () => {
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data, isLoading } = useProductList<Product[]>({ type: "all" });
  const { mutate: deleteProduct, isPending: deleting } = useDeleteProduct();
  const { mutate: createProduct, isPending: creating } = useCreateProduct();
  const { mutate: updateProduct, isPending: updating } = useUpdateProduct();
  const { data: productDetail } = useProductDetail(editingId ?? 0);

  const filteredData = data?.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const openCreateModal = () => {
    setMode("create");
    setEditingId(null);
    setOpen(true);
  };

  const openEditModal = (id: number) => {
    setMode("edit");
    setEditingId(id);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      mainImage: values.mainImage?.[0]?.response?.imageUrl || values.mainImage?.[0]?.url,
      imageIds: values.images?.map((f: any) => f.response?.id || f.uid) || [],

      // ✅ Transform variants: [{key,value}] → { key: value }
      variants: values.variants?.map((v: any) => ({
        ...v,
        mainImage: v.mainImage?.[0]?.response?.imageUrl || v.mainImage?.[0]?.url || null,
        attributes: (v.attributes ?? []).reduce((acc: any, attr: any) => {
          if (attr?.key) acc[attr.key] = attr.value;
          return acc;
        }, {}),
      })) ?? [],
    };

    if (mode === "create") {
      createProduct(payload, { onSuccess: closeModal });
    } else {
      updateProduct({ id: editingId!, ...payload }, { onSuccess: closeModal });
    }
  };

  const initialValues =
    mode === "edit" && productDetail
      ? {
          name: productDetail.name,
          sku: productDetail.sku,
          categoryId: productDetail.category?.id,
          brandId: productDetail.brand?.id,
          price: productDetail.price,
          salePrice: productDetail.salePrice,
          stockQuantity: productDetail.stockQuantity,
          status: productDetail.status,
          featured: productDetail.featured,
          shortDescription: productDetail.shortDescription,
          fullDescription: productDetail.fullDescription,

          mainImage: productDetail.mainImage
            ? [{ uid: "-1", name: "main-image", status: "done", url: productDetail.mainImage }]
            : [],

          images: productDetail.images?.map((img: any) => ({
            uid: img.id,
            name: img.name ?? "image",
            status: "done",
            url: img.imageUrl,
          })) ?? [],

          // ✅ Map variants: { key: value } → [{key, value}]
          variants: productDetail.productVariants?.map((v: any) => ({
            id: v.id,
            name: v.name,
            sku: v.sku,
            price: v.price,
            salePrice: v.salePrice,
            stockQuantity: v.stockQuantity,
            mainImage: v.mainImage
              ? [{ uid: `v-${v.id}`, name: "image", status: "done", url: v.mainImage }]
              : [],
            attributes: Object.entries(v.attributes ?? {}).map(([key, value]) => ({
              key,
              value:String(value),
            })),
          })) ?? [],
        }
      : undefined;

  const columns: ColumnsType<Product> = [
    {
      title: "Ảnh",
      dataIndex: "mainImage",
      render: (url) => (
        <Image
          width={80} height={80}
          style={{ objectFit: "cover", borderRadius: 6 }}
          src={url}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />
      ),
    },
    { title: "SKU", dataIndex: "sku" },
    { title: "Tên sản phẩm", dataIndex: "name" },
    { title: "Danh mục", dataIndex: ["category", "name"] },
    { title: "Thương hiệu", dataIndex: ["brand", "name"] },
    {
      title: "Giá",
      dataIndex: "price",
      render: (price, record) => (
        <Space direction="vertical" size={0}>
          <span style={{ textDecoration: record.salePrice ? "line-through" : "none", color: "#999" }}>
            {price.toLocaleString()}₫
          </span>
          {record.salePrice && (
            <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>
              {record.salePrice.toLocaleString()}₫
            </span>
          )}
        </Space>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "stockQuantity",
      render: (qty) => <Tag color={qty > 0 ? "green" : "red"}>{qty}</Tag>,
    },
    { title: "Đã bán", dataIndex: "soldCount" },
    { title: "Lượt xem", dataIndex: "viewCount" },
    {
      title: "Variants",
      dataIndex: "productVariants",
      render: (variants: any[]) => (
        <Tag color="blue">{variants?.length ?? 0} variants</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: ProductStatus) => (
        <Tag color={statusColor[status]}>{statusText[status]}</Tag>
      ),
    },
    {
      title: "Hành động",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" onClick={() => openEditModal(record.id)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sản phẩm này?"
            description="Hành động này không thể hoàn tác!"
            onConfirm={() => deleteProduct(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger size="small" loading={deleting}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Modal
        open={open}
        onCancel={closeModal}
        footer={null}
        width={1000}
        destroyOnHidden
        title={mode === "create" ? "➕ Thêm sản phẩm" : "✏️ Sửa sản phẩm"}
      >
        <ProductForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          loading={creating || updating}
          submitText={mode === "create" ? "Tạo sản phẩm" : "Lưu thay đổi"}
        />
      </Modal>

      <Space style={{ marginBottom: 16, justifyContent: "space-between", width: "100%" }}>
        <Button type="primary" onClick={openCreateModal}>➕ Thêm sản phẩm</Button>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm..."
          style={{ width: 300 }}
          onSearch={(value) => setSearchText(value)}
          allowClear
        />
      </Space>

      <Table
        bordered
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        loading={isLoading}
        scroll={{ x: 1400 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} sản phẩm`,
        }}
      />
    </div>
  );
};

export default ProductsPage;