import { useState } from "react";
import { Modal, Button, Spin, Image, Tag, Rate, Avatar, Pagination }  from "antd";
import { UserOutlined } from '@ant-design/icons';
import { useProductDetail, useProductStats, useProductReviews }                 from "../../../hooks/Product/useProduct";




const money = (val?: number) =>
  val != null ? val.toLocaleString("vi-VN") + "₫" : "—";

const StatCard = ({
  label, value, accent,
}: { label: string; value: string | number; accent?: "danger" | "success" }) => (
  <div style={{
    background: "var(--ant-color-fill-quaternary, #fafafa)",
    borderRadius: 8, padding: "12px 14px",
  }}>
    <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginBottom: 3 }}>{label}</div>
    <div style={{
      fontSize: 18, fontWeight: 500,
      color: accent === "danger"  ? "#ff4d4f"
           : accent === "success" ? "#52c41a"
           : "inherit",
    }}>
      {typeof value === "number" ? value.toLocaleString("vi-VN") : value}
    </div>
  </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    fontSize: 11, fontWeight: 500,
    color: "rgba(0,0,0,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 10,
  }}>
    {children}
  </div>
);

interface Props {
  productId: number | null;
  open:      boolean;
  onClose:   () => void;
}

const ProductDetailModal = ({ productId, open, onClose }: Props) => {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data: p,     isLoading: loadingDetail } = useProductDetail(productId ?? 0);
  const { data: stats, isLoading: loadingStats  } = useProductStats(productId);
  const { data: reviewSummary, isLoading: loadingReviews } = useProductReviews(productId, page - 1, pageSize);

  const variantStatsMap = Object.fromEntries(
    (stats?.variantStats ?? []).map(vs => [vs.variantId, vs])
  );

  const loading = loadingDetail || !p;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Đóng</Button>}
      width={900}
      destroyOnHidden
      title="Chi tiết sản phẩm"
      styles={{ body: { maxHeight: "78vh", overflowY: "auto", padding: "24px" } }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 80 }}>
          <Spin size="large" tip="Đang tải..." />
        </div>
      ) : (
        <>
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 24 }}>
            <Image
              width={110} height={110}
              style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #f0f0f0", flexShrink: 0 }}
              src={p.mainImage}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            />
            <div>
              <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", marginBottom: 10 }}>
                Slug: {p.slug}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {p.brand?.name    && <Tag>{p.brand.name}</Tag>}
                {p.category?.name && <Tag>{p.category.name}</Tag>}
              </div>
            </div>
          </div>

          {/* ── Giá & kho ──────────────────────────────────────────────────── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0,1fr))",
            gap: 10, marginBottom: 10,
          }}>
            <StatCard label="Giá gốc"     value={money(p.price)} />
            <StatCard label="Giá KM"      value={p.salePrice ? money(p.salePrice) : "—"} accent={p.salePrice ? "danger" : undefined} />
            <StatCard label="Tồn kho"     value={p.stockQuantity ?? 0} />
            <StatCard label="Đã bán tổng" value={stats?.totalSoldCount ?? p.soldCount ?? 0} />
          </div>

          {/* ── Bán theo kỳ ────────────────────────────────────────────────── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0,1fr))",
            gap: 10, marginBottom: 24,
          }}>
            <StatCard label="Bán hôm nay"   value={stats?.soldToday    ?? 0} accent="success" />
            <StatCard label="Bán tuần này"  value={stats?.soldThisWeek  ?? 0} accent="success" />
            <StatCard label="Bán tháng này" value={stats?.soldThisMonth ?? 0} accent="success" />
            <StatCard label="Lượt xem"      value={stats?.totalViewCount ?? p.viewCount ?? 0} />
          </div>

          {/* ── Mô tả ngắn ─────────────────────────────────────────────────── */}
          {p.shortDescription && (
            <div style={{ marginBottom: 24 }}>
              <SectionLabel>Mô tả ngắn</SectionLabel>
              <div style={{
                fontSize: 14, lineHeight: 1.7,
                padding: "12px 14px",
                background: "var(--ant-color-fill-quaternary, #fafafa)",
                borderRadius: 8,
              }}>
                {p.shortDescription}
              </div>
            </div>
          )}

          {/* ── Ảnh phụ ────────────────────────────────────────────────────── */}
          {p.images?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <SectionLabel>Ảnh phụ</SectionLabel>
              <Image.PreviewGroup>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {p.images.map((img: any) => (
                    <Image
                      key={img.id}
                      width={72} height={72}
                      style={{ objectFit: "cover", borderRadius: 6, border: "1px solid #f0f0f0" }}
                      src={img.imageUrl}
                    />
                  ))}
                </div>
              </Image.PreviewGroup>
            </div>
          )}

          {/* ── Variants ───────────────────────────────────────────────────── */}
          {p.productVariants?.length > 0 && (
            <div>
              <SectionLabel>Variants ({p.productVariants.length})</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {p.productVariants.map((v: any) => {
                  const vs = variantStatsMap[v.id];
                  return (
                    <div key={v.id} style={{
                      border: "1px solid #f0f0f0",
                      borderRadius: 8,
                      padding: "14px 16px",
                    }}>
                      {/* Row trên: ảnh + info + stats */}
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>

                        {/* Ảnh */}
                        {v.mainImage && (
                          <Image
                            width={56} height={56}
                            style={{ objectFit: "cover", borderRadius: 6, flexShrink: 0 }}
                            src={v.mainImage}
                          />
                        )}

                        {/* Tên + giá */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>
                            {v.name}
                          </div>
                          <div style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", marginBottom: 7 }}>
                            
                          </div>
                          <div style={{ display: "flex", gap: 16, fontSize: 13, flexWrap: "wrap" }}>
                            <span>
                              <span style={{ color: "rgba(0,0,0,0.4)" }}>Giá: </span>
                              <b style={{ fontWeight: 500 }}>{money(v.price)}</b>
                            </span>
                            <span>
                              <span style={{ color: "rgba(0,0,0,0.4)" }}>KM: </span>
                              {v.salePrice
                                ? <b style={{ color: "#ff4d4f", fontWeight: 500 }}>{money(v.salePrice)}</b>
                                : <span style={{ color: "rgba(0,0,0,0.4)" }}>—</span>}
                            </span>
                            <span>
                              <span style={{ color: "rgba(0,0,0,0.4)" }}>Kho: </span>
                              <b style={{ fontWeight: 500 }}>{v.stockQuantity}</b>
                            </span>
                          </div>
                        </div>

                        {/* Stats 2×2 */}
                        {vs && (
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 88px)",
                            gap: 6, flexShrink: 0,
                          }}>
                            {([
                              { label: "Hôm nay",   value: vs.soldToday     },
                              { label: "Tuần này",  value: vs.soldThisWeek  },
                              { label: "Tháng này", value: vs.soldThisMonth },
                              { label: "Tổng",      value: vs.soldTotal     },
                            ] as const).map(({ label, value }) => (
                              <div key={label} style={{
                                background: "var(--ant-color-fill-quaternary, #fafafa)",
                                borderRadius: 6,
                                padding: "6px 0",
                                textAlign: "center",
                              }}>
                                <div style={{ fontSize: 10, color: "rgba(0,0,0,0.38)" }}>
                                  {label}
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 500 }}>
                                  {(value ?? 0).toLocaleString("vi-VN")}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Fallback khi chưa có stats */}
                        {!vs && loadingStats && (
                          <Spin size="small" />
                        )}
                      </div>

                      {/* Attributes */}
                      {Object.keys(v.attributes ?? {}).length > 0 && (
                        <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {Object.entries(v.attributes).map(([k, val]) => (
                            <Tag key={k} style={{ fontSize: 12 }}>
                              {k}: {String(val)}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Đánh giá / Bình luận ────────────────────────────────────────── */}
          <div style={{ marginTop: 24 }}>
            <SectionLabel>Đánh giá & Bình luận</SectionLabel>
            {loadingReviews ? (
              <Spin size="small" />
            ) : reviewSummary?.reviews?.content && reviewSummary.reviews.content.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px",
                  background: "var(--ant-color-fill-quaternary, #fafafa)",
                  borderRadius: 8
                }}>
                  <div style={{ fontSize: 24, fontWeight: 600, color: "#faad14" }}>
                    {reviewSummary.averageRating?.toFixed(1) ?? 0}
                  </div>
                  <div>
                    <Rate disabled allowHalf value={reviewSummary.averageRating ?? 0} style={{ fontSize: 14 }} />
                    <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", marginTop: 2 }}>
                      Dựa trên {reviewSummary.totalReviews ?? 0} đánh giá
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {reviewSummary.reviews.content.map((r, idx) => (
                    <div key={r.id || idx} style={{
                      padding: "12px 16px",
                      border: "1px solid #f0f0f0",
                      borderRadius: 8,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <Avatar src={r.userAvatar} icon={<UserOutlined />} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{r.userName}</div>
                          <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>
                            {r.createdAt ? new Date(r.createdAt).toLocaleString("vi-VN") : ""}
                          </div>
                        </div>
                        <Rate disabled value={r.rating ?? 0} style={{ fontSize: 12 }} />
                      </div>
                      <div style={{ fontSize: 14, color: "rgba(0,0,0,0.85)" }}>
                        {r.comment}
                      </div>
                    </div>
                  ))}
                </div>

                {reviewSummary.reviews.totalElements > pageSize && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                    <Pagination
                      current={page}
                      pageSize={pageSize}
                      total={reviewSummary.reviews.totalElements}
                      onChange={(p) => setPage(p)}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                padding: "24px", textAlign: "center",
                background: "var(--ant-color-fill-quaternary, #fafafa)",
                borderRadius: 8, color: "rgba(0,0,0,0.4)"
              }}>
                Chưa có bình luận nào cho sản phẩm này.
              </div>
            )}
          </div>
        </>
      )}
    </Modal>
  );
};

export default ProductDetailModal;