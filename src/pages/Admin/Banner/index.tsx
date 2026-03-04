// BannerManager.tsx
import { useState, useEffect } from "react";
import { Button, Modal, message, Tooltip } from "antd";
import {
  EditOutlined,
  PictureOutlined,
  SaveOutlined,
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./Banner.scss";
import { adminApi } from "../../../api/admin.api";
import type { BannerConfig, BannerSlot } from "../../../types/entity.type";
import EditPanel from "./EditPanel";
import { useQuery } from "@tanstack/react-query";
import { Tabs } from "antd";
import { postApi } from "../../../api/post.api"; // ← điều chỉnh path
import type { Post } from "../../../types/entity.type";
import { PostPicker } from "./PostPicker";


  // ─── Default state ────────────────────────────────────────────────────────────
  const defaultMainSlides: BannerSlot[] = [
    { id: "main-1", type: "main", label: "Slide 1", image: "", title: "HAPPY NEW YEAR 2026", subtitle: "KHI MUA TỪ 2 MÓN TRỞ LÊN", badge: "GIẢM NGAY 15%", link: "/" },
    { id: "main-2", type: "main", label: "Slide 2", image: "", title: "TẾT SALE 2026", subtitle: "ƯU ĐÃI LÊN ĐẾN 50%", badge: "HOT DEAL", link: "/sale" },
  ];
  const defaultSideBanners: BannerSlot[] = [
    { id: "side-1", type: "side", label: "Banner phụ 1", image: "", title: "TẾT SALE HẾT", subtitle: "TẤT CẢ MẶT HÀNG", badge: "GIẢM ĐẾN 50%", link: "/sale" },
    { id: "side-2", type: "side", label: "Banner phụ 2", image: "", title: "HAPPY NEW YEAR 2026", subtitle: "KHI MUA TỪ 2 MÓN TRỞ LÊN", badge: "GIẢM NGAY 15%", link: "/" },
  ];
  const defaultCategories: BannerSlot[] = [
    { id: "cat-1", type: "category", label: "Shopee Xử Lý",           icon: "🏪", image: "", link: "/" },
    { id: "cat-2", type: "category", label: "Deal Hot Giờ Vàng",       icon: "⚡", image: "", link: "/" },
    { id: "cat-3", type: "category", label: "Shopee Style Voucher 30%", icon: "👕", image: "", link: "/" },
    { id: "cat-4", type: "category", label: "Săn Ngay 100.000 Xu",     icon: "🎁", image: "", link: "/" },
    { id: "cat-5", type: "category", label: "Khách Hàng Thân Thiết",   icon: "⏰", image: "", link: "/" },
    { id: "cat-6", type: "category", label: "Mã Giảm Giá",             icon: "💰", image: "", link: "/" },
  ];
  const defaultQuickTopOption: BannerSlot[] = [
    { id: "quick-top-1", type: "quick-top", label: "Shopee Xử Lý",            icon: "🏪", image: "", link: "/" },
    { id: "quick-top-2", type: "quick-top", label: "Deal Hot Giờ Vàng",        icon: "⚡", image: "", link: "/" },
    { id: "quick-top-3", type: "quick-top", label: "Shopee Style Voucher 30%", icon: "👕", image: "", link: "/" },
    { id: "quick-top-4", type: "quick-top", label: "Săn Ngay 100.000 Xu",      icon: "🎁", image: "", link: "/" },
    { id: "quick-top-5", type: "quick-top", label: "Khách Hàng Thân Thiết",    icon: "⏰", image: "", link: "/" },
    { id: "quick-top-6", type: "quick-top", label: "Mã Giảm Giá",              icon: "💰", image: "", link: "/" },
  ];
  const defaultQuickBottomOption: BannerSlot[] = [
    { id: "quick-bottom-1", type: "quick-bottom", label: "Hộp Nhựa",    icon: "🏪", image: "", link: "/" },
    { id: "quick-bottom-2", type: "quick-bottom", label: "Fe Sắt Silic", icon: "⚡", image: "", link: "/" },
    { id: "quick-bottom-3", type: "quick-bottom", label: "Khuôn Nhựa",  icon: "👕", image: "", link: "/" },
    { id: "quick-bottom-4", type: "quick-bottom", label: "Ổ cắm",       icon: "🎁", image: "", link: "/" },
    { id: "quick-bottom-5", type: "quick-bottom", label: "Điện trở",    icon: "⏰", image: "", link: "/" },
    { id: "quick-bottom-6", type: "quick-bottom", label: "Tụ",          icon: "💰", image: "", link: "/" },
    { id: "quick-bottom-7", type: "quick-bottom", label: "Núm xoay",    icon: "🎁", image: "", link: "/" },
    { id: "quick-bottom-8", type: "quick-bottom", label: "Đầu nối",     icon: "⏰", image: "", link: "/" },
    { id: "quick-bottom-9", type: "quick-bottom", label: "Băng dính",   icon: "💰", image: "", link: "/" },
  ];

  const genId = () => `main-${Date.now()}`;

  // ─── EditableSlot ──────────────────────────────────────────────────────────────
  const EditableSlot = ({ children, label, onClick }: {
    children: React.ReactNode; label: string; onClick: () => void;
  }) => (
    <Tooltip title={`Chỉnh sửa: ${label}`} placement="top">
      <div className="editable-slot" onClick={onClick}>
        {children}
        <div className="editable-slot__overlay">
          <div className="editable-slot__badge"><EditOutlined /> Chỉnh sửa</div>
        </div>
      </div>
    </Tooltip>
  );

  // ─── BannerImg ────────────────────────────────────────────────────────────────
  const BannerImg = ({ slot, className }: { slot: BannerSlot; className?: string }) => (
    <div
      className={`banner-preview ${className ?? ""}`}
      style={slot.image ? { backgroundImage: `url(${slot.image})` } : undefined}
    >
      {!slot.image && <div className="banner-preview__empty"><PictureOutlined /><span>Chưa có ảnh</span></div>}
      {slot.badge && <span className="banner-preview__badge">{slot.badge}</span>}
      {slot.title && (
        <div className="banner-preview__text">
          <strong>{slot.title}</strong>
          {slot.subtitle && <span>{slot.subtitle}</span>}
        </div>
      )}
    </div>
  );

  // ─── SlideStrip ───────────────────────────────────────────────────────────────
  const SlideStrip = ({ slides, activeId, onSelect, onAdd, onDelete }: {
    slides: BannerSlot[];
    activeId: string;
    onSelect: (id: string) => void;
    onAdd: () => void;
    onDelete: (id: string) => void;
  }) => (
    <div className="slide-strip">
      <div className="slide-strip__header">
        <span className="slide-strip__title">
          Carousel slides
          <span className="slide-strip__count">{slides.length}</span>
        </span>
        <button className="slide-strip__add-btn" onClick={onAdd}>
          <PlusOutlined /> Thêm slide
        </button>
      </div>
      <div className="slide-strip__list">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`slide-thumb ${s.id === activeId ? "slide-thumb--active" : ""}`}
            onClick={() => onSelect(s.id)}
          >
            <div
              className="slide-thumb__img"
              style={s.image ? { backgroundImage: `url(${s.image})` } : undefined}
            >
              {!s.image && <PictureOutlined />}
            </div>
            <div className="slide-thumb__info">
              <span className="slide-thumb__index">Slide {i + 1}</span>
              <span className="slide-thumb__name">{s.label}</span>
            </div>
            {slides.length > 1 && (
              <button
                className="slide-thumb__del"
                onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
              >
                <DeleteOutlined />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ─── BannerManager ────────────────────────────────────────────────────────────
  const BannerManager = () => {
    const [mainSlides,         setMainSlides]         = useState<BannerSlot[]>(defaultMainSlides);
    const [sideBanners,        setSideBanners]        = useState<BannerSlot[]>(defaultSideBanners);
    const [categories,         setCategories]         = useState<BannerSlot[]>(defaultCategories);
    const [quickTopOption,     setQuickTopOption]     = useState<BannerSlot[]>(defaultQuickTopOption);
    const [quickBottomOption,  setQuickBottomOption]  = useState<BannerSlot[]>(defaultQuickBottomOption);
    
    const [selectedPreIds,     setSelectedPreIds]     = useState<number[]>([]);
    const [selectedPopularIds, setSelectedPopularIds] = useState<number[]>([]);

    const [activeSlideId, setActiveSlideId] = useState<string>(defaultMainSlides[0].id);
    const [editing,       setEditing]       = useState<BannerSlot | null>(null);
    const [previewOpen,   setPreviewOpen]   = useState(false);
    const [saving,        setSaving]        = useState(false); // ← loading state

    // ── Load từ API ──────────────────────────────────────────────────────────────
    const { data } = useQuery<BannerConfig>({
      queryKey: ["banner-config"],
      queryFn: () => adminApi.getConfigBanner(),
      staleTime: 1000 * 60 * 10,
      retry: false,
    });

    const { data: prePosts,     isLoading: loadingPre }     = useQuery<Post[]>({
      queryKey: ["posts-pre"],
      queryFn:  () => postApi.getPre(),
      staleTime: 1000 * 60 * 5,
    });
    const { data: popularPosts, isLoading: loadingPopular } = useQuery<Post[]>({
      queryKey: ["posts-popular"],
      queryFn:  () => postApi.getPopular(),
      staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
      if (!data) return;

      const mains      = data.banners?.filter((b) => b.type === "main")         ?? [];
      const sides      = data.banners?.filter((b) => b.type === "side")         ?? [];
      const quickTop   = data.banners?.filter((b) => b.type === "quick-top")    ?? [];  // ← FIX: load quick-top
      const quickBot   = data.banners?.filter((b) => b.type === "quick-bottom") ?? [];  // ← FIX: load quick-bottom
      if (data.featuredPostIds?.length)     setSelectedPreIds(data.featuredPostIds);
      if (data.featuredPopularIds?.length)  setSelectedPopularIds(data.featuredPopularIds);

      if (mains.length)    { setMainSlides(mains); setActiveSlideId(mains[0].id); }
      if (sides.length)    setSideBanners(sides);
      if (data.categories?.length) setCategories(data.categories);
      if (quickTop.length) setQuickTopOption(quickTop);    // ← FIX
      if (quickBot.length) setQuickBottomOption(quickBot); // ← FIX
    }, [data]);

    // ── Slide actions ─────────────────────────────────────────────────────────────
    const addSlide = () => {
      const newSlide: BannerSlot = {
        id: genId(), type: "main",
        label: `Slide ${mainSlides.length + 1}`,
        image: "", title: "", subtitle: "", badge: "", link: "/",
      };
      setMainSlides((prev) => [...prev, newSlide]);
      setActiveSlideId(newSlide.id);
      setEditing(newSlide);
    };

    const deleteSlide = (id: string) => {
      setMainSlides((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (activeSlideId === id) setActiveSlideId(next[0]?.id ?? "");
        return next;
      });
    };

    // ── Update bất kỳ slot nào (bao gồm quick-top / quick-bottom) ────────────────
    const updateSlot = (updated: BannerSlot) => {
      switch (updated.type) {
        case "main":         setMainSlides        ((s) => s.map((x) => x.id === updated.id ? updated : x)); break;
        case "side":         setSideBanners       ((s) => s.map((x) => x.id === updated.id ? updated : x)); break;
        case "category":     setCategories        ((s) => s.map((x) => x.id === updated.id ? updated : x)); break;
        case "quick-top":    setQuickTopOption    ((s) => s.map((x) => x.id === updated.id ? updated : x)); break; // ← FIX
        case "quick-bottom": setQuickBottomOption ((s) => s.map((x) => x.id === updated.id ? updated : x)); break; // ← FIX
      }
    };

    const activeSlide = mainSlides.find((s) => s.id === activeSlideId) ?? mainSlides[0];

    // ── Save toàn bộ lên DB ───────────────────────────────────────────────────────
    const handleSave = async () => {
      setSaving(true);
      try {
        await adminApi.setConfigBanner(
          [...mainSlides, ...sideBanners],
          categories,
          quickTopOption,
          quickBottomOption,
          selectedPreIds,
          selectedPopularIds,
        );
        message.success("Đã lưu cấu hình banner!");
      } catch (err) {
        console.error("Save banner error:", err);
        message.error("Lưu thất bại! Vui lòng thử lại.");
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="banner-manager">
        {/* Toolbar */}
        <div className="banner-manager__toolbar">
          <div>
            <h2 className="banner-manager__heading">🖼️ Quản lý Banner</h2>
            <p className="banner-manager__sub">Click vào từng vùng để chỉnh sửa nội dung</p>
          </div>
          <div className="banner-manager__actions">
            <Button icon={<EyeOutlined />} onClick={() => setPreviewOpen(true)}>Xem trước</Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={saving} // ← loading spinner khi đang lưu
            >
              Lưu tất cả
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="banner-canvas">
          <div>
            <div className="banner-canvas__sidebar-hint">
              <div className="sidebar-hint__title">Danh Mục Sản Phẩm</div>
              {quickTopOption.map((item) => (
                <EditableSlot key={item.id} label={item.label} onClick={() => setEditing(item)}>
                  <div className="sidebar-hint__item">{item.label}</div>
                </EditableSlot>
              ))}
            </div>

            <div className="banner-canvas__sidebar-hint">
              <div className="sidebar-hint__title">Top tìm kiếm</div>
              {quickBottomOption.map((item) => (
                <EditableSlot key={item.id} label={item.label} onClick={() => setEditing(item)}>
                  <div className="sidebar-hint__item">{item.label}</div>
                </EditableSlot>
              ))}
            </div>
          </div>

          <div className="banner-canvas__main">
            <SlideStrip
              slides={mainSlides}
              activeId={activeSlideId}
              onSelect={setActiveSlideId}
              onAdd={addSlide}
              onDelete={deleteSlide}
            />

            <div className="banner-grid">
              <EditableSlot label={activeSlide?.label ?? "Banner chính"} onClick={() => activeSlide && setEditing(activeSlide)}>
                <BannerImg slot={activeSlide} className="banner-grid__main" />
              </EditableSlot>
              <div className="banner-grid__sides">
                {sideBanners.map((s) => (
                  <EditableSlot key={s.id} label={s.label} onClick={() => setEditing(s)}>
                    <BannerImg slot={s} className="banner-grid__side" />
                  </EditableSlot>
                ))}
              </div>
            </div>

            <div className="category-strip">
              {categories.map((cat) => (
                <EditableSlot key={cat.id} label={cat.label} onClick={() => setEditing(cat)}>
                  <div className="category-slot">
                    <span className="category-slot__icon">{cat.icon}</span>
                    <span className="category-slot__label">{cat.label}</span>
                  </div>
                </EditableSlot>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bài viết nổi bật ── */}
        <div className="post-section">
          <div className="post-section__header">
            <div>
              <h3 className="post-section__title">📰 Bài viết hiển thị trang chủ</h3>
              <p className="post-section__sub">Chọn bài viết cho từng khu vực • Nhấn "Lưu tất cả" để áp dụng</p>
            </div>
          </div>

          <Tabs
            defaultActiveKey="pre"
            items={[
              {
                key: "pre",
                label: `🗞️ Tin tức mới (${selectedPreIds.length} đã chọn)`,
                children: (
                  <PostPicker
                    posts={prePosts}
                    loading={loadingPre}
                    selectedIds={selectedPreIds}
                    onChange={setSelectedPreIds}
                    max={6}
                  />
                ),
              },
              {
                key: "popular",
                label: `🔥 Mẹo vặt (${selectedPopularIds.length} đã chọn)`,
                children: (
                  <PostPicker
                    posts={popularPosts}
                    loading={loadingPopular}
                    selectedIds={selectedPopularIds}
                    onChange={setSelectedPopularIds}
                    max={6}
                  />
                ),
              },
            ]}
          />
        </div>

        {/* Edit panel */}
        {editing && (
          <div className="edit-panel-overlay" onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
            <EditPanel slot={editing} onSave={updateSlot} onClose={() => setEditing(null)} />
          </div>
        )}

        {/* Preview modal */}
        <Modal
          open={previewOpen}
          title="Xem trước giao diện"
          onCancel={() => setPreviewOpen(false)}
          footer={null}
          width={900}
        >
          <div className="preview-content">
            <div className="preview-slide-nav">
              {mainSlides.map((s, i) => (
                <span
                  key={s.id}
                  className={`preview-slide-dot ${s.id === activeSlideId ? "preview-slide-dot--active" : ""}`}
                  onClick={() => setActiveSlideId(s.id)}
                >
                  {i + 1}
                </span>
              ))}
            </div>
            <div className="banner-grid">
              <BannerImg slot={activeSlide} className="banner-grid__main" />
              <div className="banner-grid__sides">
                {sideBanners.map((s) => <BannerImg key={s.id} slot={s} className="banner-grid__side" />)}
              </div>
            </div>
            <div className="category-strip">
              {categories.map((cat) => (
                <div key={cat.id} className="category-slot">
                  <span className="category-slot__icon">{cat.icon}</span>
                  <span className="category-slot__label">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      </div>
    );
  };

  export default BannerManager;