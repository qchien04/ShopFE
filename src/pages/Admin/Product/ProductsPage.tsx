// ProductsPage.tsx
import { Button, Space, Input, Modal, Spin, Pagination, Popconfirm, Image } from "antd";
import { useState } from "react";
import { useProductList } from "../../../hooks/Product/useProductList";
import { useDeleteProduct } from "../../../hooks/Product/useDeleteProduct";
import { useCreateProduct } from "../../../hooks/Product/useCreateProduct";
import { useUpdateProduct } from "../../../hooks/Product/useUpdateProduct";
import { useProductDetail } from "../../../hooks/Product/useProduct";
import type { Product } from "../../../types/product.type";
import type { PageResponse } from "../../../types/response.type";
import ProductForm from "./ProductFormProps";
import ProductDetailModal from "./ProductDetailModal";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  BarcodeOutlined,
  TagOutlined,
  FireOutlined,
  PlusOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";
import "./ProductsPage.scss";



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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewingId, setViewingId] = useState<number | null>(null);

  const { data, isLoading } = useProductList<PageResponse<Product>>({
    type: "all", page: page - 1, size: pageSize, keyword,
  });

  const openViewModal = (id: number) => { setViewingId(id); setViewOpen(true); };
  const closeViewModal = () => { setViewOpen(false); setViewingId(null); };

  const { mutate: deleteProduct, isPending: deleting } = useDeleteProduct();
  const { mutate: createProduct, isPending: creating } = useCreateProduct();
  const { mutate: updateProduct, isPending: updating } = useUpdateProduct();

  //  Chỉ fetch khi đang edit
  const { data: productDetail, isLoading: loadingDetail } =
    useProductDetail(editingId ?? 0);

  const openCreateModal = () => { setMode("create"); setEditingId(null); setOpen(true); };
  const openEditModal = (id: number) => { setMode("edit"); setEditingId(id); setOpen(true); };
  const closeModal = () => { setOpen(false); setEditingId(null); };

  const handleSearch = (value: string) => { setKeyword(value); setPage(1); };
  const handleClear = () => { setKeyword(""); setPage(1); setSearchText(""); };

  const handleSubmit = (values: any) => {
    const payload = toPayload(values);
    if (mode === "create") {
      createProduct(payload, { onSuccess: closeModal });
    } else {
      updateProduct({ id: editingId!, ...payload }, { onSuccess: closeModal });
    }
  };

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
        productDetail={productDetail}  //  truyền thẳng productDetail, không cần transform ở đây
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
        destroyOnClose
        className="premium-product-modal"
        title={
          <Space size={8}>
            {mode === "create" ? (
              <PlusCircleOutlined style={{ color: "#00c853" }} />
            ) : (
              <EditOutlined style={{ color: "#00c853" }} />
            )}
            <span>{mode === "create" ? "Thêm sản phẩm mới" : "Cấu hình sản phẩm"}</span>
          </Space>
        }
      >
        {modalContent()}
      </Modal>

      <ProductDetailModal
        productId={viewingId}
        open={viewOpen}
        onClose={closeViewModal}
      />

      <Space style={{ marginBottom: 16, justifyContent: "space-between", width: "100%" }}>
        <Button
          type="primary"
          size="large"
          onClick={openCreateModal}
          icon={<PlusOutlined />}
          style={{ borderRadius: 8, fontWeight: 600, display: "inline-flex", alignItems: "center" }}
        >
          Thêm sản phẩm
        </Button>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm..."
          style={{ width: 320 }}
          size="large"
          enterButton
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onSearch={handleSearch}
          onClear={handleClear}
          allowClear
        />
      </Space>

      {isLoading ? (
        <div className="product-loading-container">
          <Spin size="large" tip="Đang tải danh sách sản phẩm..." />
        </div>
      ) : (
        <div className="product-list-container">
          {data?.content && data.content.length > 0 ? (
            data.content.map((product) => {
              const hasSale = product.salePrice && product.salePrice > 0;
              const discountPercent = hasSale && product.price
                ? Math.round(((product.price - product.salePrice) / product.price) * 100)
                : 0;

              return (
                <div key={product.id} className="product-row-card">
                  {/* Left: Image */}
                  <div className="product-card-img-wrapper">
                    <Image
                      width={90}
                      height={90}
                      style={{ objectFit: "cover", borderRadius: 8 }}
                      src={product.mainImage}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                    />
                  </div>

                  {/* Middle Left: Info */}
                  <div className="product-card-info">
                    <h3 className="product-title" title={product.name}>
                      {product.name}
                    </h3>
                    <div className="product-meta">
                      {product.sku && (
                        <span className="sku-badge" title="SKU">
                          <BarcodeOutlined /> {product.sku}
                        </span>
                      )}
                      {product.category?.name && (
                        <span className="meta-tag category-tag">
                          <TagOutlined /> {product.category.name}
                        </span>
                      )}
                      {(product.brand?.name || product.brandName) && (
                        <span className="meta-tag brand-tag">
                          <FireOutlined /> {product.brand?.name || product.brandName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle Right: Pricing & Inventory */}
                  <div className="product-card-pricing">
                    <div className="price-row">
                      {hasSale ? (
                        <>
                          <span className="actual-price">
                            {product.salePrice.toLocaleString()}₫
                          </span>
                          <span className="original-price">
                            {product.price?.toLocaleString()}₫
                          </span>
                          {discountPercent > 0 && (
                            <span className="discount-pill">-{discountPercent}%</span>
                          )}
                        </>
                      ) : (
                        <span className="standard-price">
                          {product.price ? product.price.toLocaleString() : 0}₫
                        </span>
                      )}
                    </div>
                    
                    <div className={`stock-status ${product.stockQuantity > 0 ? "in" : "out"}`}>
                      <span className={`status-dot ${product.stockQuantity > 0 ? "in-stock" : "out-of-stock"}`} />
                      {product.stockQuantity > 0 ? `Còn hàng (${product.stockQuantity})` : "Hết hàng"}
                    </div>
                  </div>



                  {/* Right: Actions */}
                  <div className="product-card-actions">
                    <Button
                      className="btn-view"
                      icon={<EyeOutlined />}
                      onClick={() => openViewModal(product.id)}
                    >
                      Xem
                    </Button>
                    <Button
                      type="primary"
                      className="btn-edit"
                      icon={<EditOutlined />}
                      onClick={() => openEditModal(product.id)}
                    >
                      Sửa
                    </Button>
                    <Popconfirm
                      title="Xóa sản phẩm này?"
                      description="Hành động này không thể hoàn tác!"
                      onConfirm={() => deleteProduct(product.id)}
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <Button
                        danger
                        className="btn-delete"
                        icon={<DeleteOutlined />}
                        loading={deleting}
                      >
                        Xóa
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="product-empty-state">
              Không tìm thấy sản phẩm nào phù hợp.
            </div>
          )}

          {/* Pagination */}
          <div className="product-pagination-container">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={data?.totalElements ?? 0}
              showSizeChanger
              showTotal={(total) => `Tổng ${total} sản phẩm`}
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

export default ProductsPage;