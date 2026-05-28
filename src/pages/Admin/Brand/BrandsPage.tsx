import { Button, Space, Popconfirm, Image, Input, Spin, Pagination, Card, Row, Col } from "antd";
import { useState } from "react";
import { useBrandList, useCreateBrand, useDeleteBrand, useUpdateBrand } from "../../../hooks/Brand/useBrand";
import type { Brand } from "../../../types/entity.type";
import BrandModal from "./BrandModal";
import {
  EditOutlined,
  DeleteOutlined,
  GlobalOutlined,
  LinkOutlined,
  SearchOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";
import "./BrandsPage.scss";

const BrandsPage = () => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (item.slug && item.slug.toLowerCase().includes(searchText.toLowerCase()))
  ) || [];

  const handleDelete = (id: number) => {
    deleteBrand(id);
  };

  // Pagination bounds
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="brands-page-wrapper">
      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col>
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
            Thêm thương hiệu mới
          </Button>
        </Col>
      </Row>

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

      {isLoading ? (
        <div className="brand-loading-container">
          <Spin size="large" tip="Đang tải danh sách thương hiệu..." />
        </div>
      ) : (
        <div className="brand-list-container">
          {paginatedData.length > 0 ? (
            paginatedData.map((brand) => (
              <div key={brand.id} className="brand-row-card">
                {/* Left: Logo */}
                <div className="brand-card-logo-wrapper">
                  <Image
                    width={72}
                    height={72}
                    style={{ objectFit: "contain", borderRadius: 8, padding: 4 }}
                    src={brand.logo}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                  />
                </div>

                {/* Middle: Details */}
                <div className="brand-card-info">
                  <div className="brand-title-row">
                    <h3 className="brand-title">{brand.name}</h3>
                    <span className="brand-id-badge">ID: {brand.id}</span>
                  </div>

                  <div className="brand-slug-row">
                    {brand.slug && (
                      <span className="slug-badge">
                        <LinkOutlined /> {brand.slug}
                      </span>
                    )}
                    {brand.website && (
                      <a
                        href={brand.website.startsWith("http") ? brand.website : `https://${brand.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="website-link"
                      >
                        <GlobalOutlined /> {brand.website}
                      </a>
                    )}
                  </div>

                  {brand.description ? (
                    <p className="brand-description" title={brand.description}>
                      {brand.description}
                    </p>
                  ) : (
                    <p className="brand-description" style={{ color: "#bfbfbf", fontStyle: "italic" }}>
                      Chưa có mô tả cho thương hiệu này.
                    </p>
                  )}
                </div>



                {/* Right: Actions */}
                <div className="brand-card-actions">
                  <Button
                    type="primary"
                    className="btn-edit"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditing(brand);
                      setOpen(true);
                    }}
                  >
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Xóa brand này?"
                    description="Hành động này không thể hoàn tác!"
                    onConfirm={() => handleDelete(brand.id || 0)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <Button danger className="btn-delete" icon={<DeleteOutlined />} loading={deleting}>
                      Xóa
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            ))
          ) : (
            <div className="brand-empty-state">
              Không tìm thấy thương hiệu nào phù hợp.
            </div>
          )}

          {/* Pagination */}
          <div className="brand-pagination-container">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={filteredData.length}
              showSizeChanger
              showTotal={(total) => `Tổng ${total} thương hiệu`}
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

export default BrandsPage;


