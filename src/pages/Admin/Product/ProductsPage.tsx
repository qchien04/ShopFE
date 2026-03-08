// ProductsPage.tsx
import { Table, Button, Space, Input, Modal, Spin } from "antd";
import { useState } from "react";
import { useProductList }   from "../../../hooks/Product/useProductList";
import { useDeleteProduct } from "../../../hooks/Product/useDeleteProduct";
import { useCreateProduct } from "../../../hooks/Product/useCreateProduct";
import { useUpdateProduct } from "../../../hooks/Product/useUpdateProduct";
import { useProductDetail } from "../../../hooks/Product/useProduct";
import type { Product }      from "../../../types/product.type";
import type { PageResponse } from "../../../types/response.type";
import ProductForm           from "./ProductFormProps";
import { buildColumns } from "./Column";

export const toPayload = (values: any) => ({
  ...values,
  mainImage:
    values.mainImage?.[0]?.response?.imageUrl ||
    values.mainImage?.[0]?.url || null,
  imageIds: values.images?.map((f: any) => f.response?.id || f.uid) ?? [],
  variants: (values.variants ?? []).map((v: any) => ({
    ...v,
    mainImage:
      v.mainImage?.[0]?.response?.imageUrl ||
      v.mainImage?.[0]?.url || null,
    attributes: (v.attributes ?? []).reduce(
      (acc: Record<string, string>, attr: any) => {
        if (attr?.key) acc[attr.key] = attr.value;
        return acc;
      }, {}
    ),
  })),
});


// ─── Component ───────────────────────────────────────────────────────────────

const ProductsPage = () => {
  const [page,       setPage]       = useState(1);
  const [pageSize,   setPageSize]   = useState(10);
  const [searchText, setSearchText] = useState("");
  const [keyword,    setKeyword]    = useState("");
  const [open,       setOpen]       = useState(false);
  const [mode,       setMode]       = useState<"create" | "edit">("create");
  const [editingId,  setEditingId]  = useState<number | null>(null);

  const { data, isLoading } = useProductList<PageResponse<Product>>({
    type: "all", page: page - 1, size: pageSize, keyword,
  });

  const { mutate: deleteProduct, isPending: deleting  } = useDeleteProduct();
  const { mutate: createProduct, isPending: creating  } = useCreateProduct();
  const { mutate: updateProduct, isPending: updating  } = useUpdateProduct();

  // ✅ Chỉ fetch khi đang edit
  const { data: productDetail, isLoading: loadingDetail } =
    useProductDetail(editingId ?? 0);

  const openCreateModal = () => { setMode("create"); setEditingId(null); setOpen(true); };
  const openEditModal   = (id: number) => { setMode("edit"); setEditingId(id); setOpen(true); };
  const closeModal      = () => { setOpen(false); setEditingId(null); };

  const handleSearch = (value: string) => { setKeyword(value); setPage(1); };
  const handleClear  = () => { setKeyword(""); setPage(1); setSearchText(""); };

  const handleSubmit = (values: any) => {
    const payload = toPayload(values);
    if (mode === "create") {
      createProduct(payload, { onSuccess: closeModal });
    } else {
      updateProduct({ id: editingId!, ...payload }, { onSuccess: closeModal });
    }
  };

  const columns = buildColumns(openEditModal, deleteProduct, deleting);

  // ── Nội dung Modal ──
  const modalContent = () => {
    // Tạo mới — render thẳng, không cần chờ
    if (mode === "create") {
      return (
        <ProductForm
          onSubmit={handleSubmit}
          loading={creating}
          submitText="Tạo sản phẩm"
        />
      );
    }

    // Sửa — hiện Spin khi đang fetch
    if (loadingDetail || !productDetail) {
      return (
        <div style={{ textAlign: "center", padding: 80 }}>
          <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
        </div>
      );
    }

    return (
      <ProductForm
        productDetail={productDetail}  // ✅ truyền thẳng productDetail, không cần transform ở đây
        onSubmit={handleSubmit}
        loading={updating}
        submitText="Lưu thay đổi"
      />
    );
  };

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
        {modalContent()}
      </Modal>

      <Space style={{ marginBottom: 16, justifyContent: "space-between", width: "100%" }}>
        <Button type="primary" onClick={openCreateModal}>➕ Thêm sản phẩm</Button>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm..."
          style={{ width: 300 }}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onSearch={handleSearch}
          onClear={handleClear}
          allowClear
        />
      </Space>

      <Table
        bordered
        rowKey="id"
        columns={columns}
        dataSource={data?.content ?? []}
        loading={isLoading}
        scroll={{ x: 1400 }}
        pagination={{
          current:         page,
          pageSize:        pageSize,
          total:           data?.totalElements ?? 0,
          showSizeChanger: true,
          showTotal:       (total) => `Tổng ${total} sản phẩm`,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); },
        }}
      />
    </div>
  );
};

export default ProductsPage;