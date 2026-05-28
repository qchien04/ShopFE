import { useEffect, useState } from "react";
import { Button, Modal, message, Space, Typography, Tabs, Card, Input, Select } from "antd";
import {
  PictureOutlined,
  SaveOutlined,
  EyeOutlined,
  AppstoreOutlined,
  TagOutlined,
  StarOutlined,
  FireOutlined,
  ShopOutlined,
  ThunderboltOutlined,
  ReadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import "./HomeConfigPage.scss";
import { adminApi } from "../../../api/admin.api";
import type {
  HomePageConfig, VisualBanner, NavSlot, FooterConfig,
  FeaturedProductConfig, NewProductConfig, BrandsShowcaseConfig,
  HotDealsSectionConfig, NewsSectionConfig, Post, CategoryConfig, FeaturedCategoryConfig,
  ShippingConfig
} from "../../../types/entity.type";
import { useGHNProvinces, useGHNDistricts, useGHNWards } from "../../../hooks/Order/useGHN";
import EditPanel from "./components/EditPanel";
import { useQuery } from "@tanstack/react-query";
import { postApi } from "../../../api/post.api";
import type { PageResponse } from "../../../types/response.type";
import PromoPostsSlot, { type PromoPost } from "./components/PromoPostsSlot";
import EditableSlot from "./components/EditableSlot";
import BannerImg from "./components/BannerImg";
import SlideStrip from "./components/SlideStrip";

// Modals
import ProductSectionModal from "./modals/ProductSectionModal";
import NewProductSectionModal from "./modals/NewProductSectionModal";
import HotDealsSectionModal from "./modals/HotDealsSectionModal";
import NewsSectionModal from "./modals/NewsSectionModal";
import BrandShowcaseModal from "./modals/BrandShowcaseModal";
import CategorySectionModal from "./modals/CategorySectionModal";
import FeaturedCategoryModal from "./modals/FeaturedCategoryModal";
import { SortableSectionCard } from "./components/SortableSectionCard";

const { Title, Text } = Typography;

// --- Defaults ---
const defaultMainSlides: VisualBanner[] = [
  { id: "main-1", type: "main", label: "Slide 1", image: "", title: "HAPPY NEW YEAR 2026", subtitle: "KHI MUA TỪ 2 MÓN TRỞ LÊN", badge: "GIẢM NGAY 15%", link: "/" },
];
const defaultSideBanners: VisualBanner[] = [
  { id: "side-1", type: "side", label: "Banner phụ 1", image: "", title: "TẾT SALE HẾT", subtitle: "TẤC CẢ MẶT HÀNG", badge: "GIẢM ĐẾN 50%", link: "/sale" },
  { id: "side-2", type: "side", label: "Banner phụ 2", image: "", title: "HAPPY NEW YEAR 2026", subtitle: "KHI MUA TỪ 2 MÓN TRỞ LÊN", badge: "GIẢM NGAY 15%", link: "/" },
];
const defaultCategories: NavSlot[] = [
  { id: "cat-1", type: "category", label: "Shopee Xử Lý", icon: "🏪", link: "/" },
  { id: "cat-2", type: "category", label: "Deal Hot Giờ Vàng", icon: "⚡", link: "/" },
  { id: "cat-3", type: "category", label: "Shopee Style Voucher 30%", icon: "👕", link: "/" },
  { id: "cat-4", type: "category", label: "Săn Ngay 100.000 Xu", icon: "🎁", link: "/" },
  { id: "cat-5", type: "category", label: "Khách Hàng Thân Thiết", icon: "⏰", link: "/" },
  { id: "cat-6", type: "category", label: "Mã Giảm Giá", icon: "💰", link: "/" },
];
const defaultQuickTopOption: NavSlot[] = [
  { id: "quick-top-1", type: "quick-top", label: "Adapter - Bộ Sạc - Nguồn", link: "/" },
  { id: "quick-top-2", type: "quick-top", label: "Biến Áp", link: "/" },
  { id: "quick-top-3", type: "quick-top", label: "Board Mạch", link: "/" },
  { id: "quick-top-4", type: "quick-top", label: "Các Loại Tụ", link: "/" },
];
const defaultQuickBottomOption: NavSlot[] = [
  { id: "quick-bottom-1", type: "quick-bottom", label: "Hộp Nhựa", link: "/" },
  { id: "quick-bottom-2", type: "quick-bottom", label: "Fe Sắt Silic", link: "/" },
  { id: "quick-bottom-3", type: "quick-bottom", label: "Khuôn Nhựa", link: "/" },
];

const genId = () => `main-${Date.now()}`;
const genCatId = () => `cat_sec_${Date.now()}`;

const HomeConfigPage = () => {
  // --- Visuals & Nav ---
  const [mainSlides, setMainSlides] = useState<VisualBanner[]>(defaultMainSlides);
  const [sideBanners, setSideBanners] = useState<VisualBanner[]>(defaultSideBanners);
  const [categories, setCategories] = useState<NavSlot[]>(defaultCategories);
  const [quickTopOption, setQuickTopOption] = useState<NavSlot[]>(defaultQuickTopOption);
  const [quickBottomOption, setQuickBottomOption] = useState<NavSlot[]>(defaultQuickBottomOption);
  const [selectedPromo, setSelectedPromo] = useState<PromoPost[]>([]);
  const [footer, setFooter] = useState<FooterConfig>({
    companyDescription: "",
    address: "",
    hotline: "",
    email: "",
    workingHours: "",
    copyright: "",
    facebookLink: "",
    twitterLink: "",
    instagramLink: "",
    youtubeLink: "",
    shopeeLink: "",
    lazadaLink: "",
    tiktokLink: ""
  });

  // --- Individual Sections State ---
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProductConfig>({ id: 'featured_products', title: 'Sản Phẩm Nổi Bật', productIds: [], active: true, productCount: 10 });
  const [newProducts, setNewProducts] = useState<NewProductConfig>({ id: 'new_products', title: 'Sản Phẩm Mới', active: true, categoryOfProduct: [], productPerRow: 5 });
  const [brandShowcase, setBrandShowcase] = useState<BrandsShowcaseConfig>({ id: 'brand_showcase', title: 'Thương Hiệu Nổi Bật', active: true, brandIds: [], brandCount: 10 });
  const [hotDeals, setHotDeals] = useState<HotDealsSectionConfig>({ id: 'hot_deals', title: 'Sản Phẩm Đang Hot', productIds: [], active: true, weeklyProductIds: [], weeklyTitle: 'Deal Hot Trong Tuần', productPerRow: 4 });
  const [news, setNews] = useState<NewsSectionConfig>({ id: 'news', title: 'Tin Tức', postIds: [], popularPostIds: [], active: true, postPerRow: 3 });
  const [featuredCategories, setFeaturedCategories] = useState<FeaturedCategoryConfig>({ id: 'featured_categories', title: 'Danh Mục Nổi Bật', active: true, categoryIds: [], categoryPerRow: 10 });
  const [categorySections, setCategorySections] = useState<CategoryConfig[]>([]);
  const [layout, setLayout] = useState<string[]>(['featured_products', 'featured_categories', 'new_products', 'brand_showcase', 'hot_deals', 'news']);
  const [shippingConfig, setShippingConfig] = useState<ShippingConfig>({});

  // --- UI States ---
  const [activeSlideId, setActiveSlideId] = useState<string>(defaultMainSlides[0].id);
  const [editing, setEditing] = useState<VisualBanner | NavSlot | null>(null);
  const [modalOpen, setModalOpen] = useState<{ type: string; open: boolean }>({ type: '', open: false });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // --- Data Loading ---
  const { data } = useQuery<HomePageConfig>({
    queryKey: ["banner-config"],
    queryFn: () => adminApi.getConfigBanner(),
    staleTime: 1000 * 60 * 10,
    retry: false,
  });

  const { data: allPosts, isLoading: isLoadingPosts } = useQuery<PageResponse<Post>>({
    queryKey: ["banner-post"],
    queryFn: () => postApi.getAll(),
  });

  const { data: rawShippingConfig } = useQuery<ShippingConfig>({
    queryKey: ["shipping-config"],
    queryFn: () => adminApi.getShippingConfig(),
  });

  const { data: provinces, isLoading: loadingProvinces } = useGHNProvinces();
  const { data: districts, isLoading: loadingDistricts } = useGHNDistricts(shippingConfig.ghnProvinceId || null);
  const { data: wards, isLoading: loadingWards } = useGHNWards(shippingConfig.ghnDistrictId || null);

  useEffect(() => {
    if (!data) return;

    if (data.banners) {
      const mains = data.banners.filter(b => b.type === "main");
      const sides = data.banners.filter(b => b.type === "side");
      if (mains.length) { setMainSlides(mains); setActiveSlideId(mains[0].id); }
      if (sides.length) setSideBanners(sides);
    }
    if (data.navCategories) setCategories(data.navCategories.map(c => ({ ...c, type: c.type || "category" })));
    if (data.navQuickTopOption) setQuickTopOption(data.navQuickTopOption.map(c => ({ ...c, type: c.type || "quick-top" })));
    if (data.navQuickBottomOption) setQuickBottomOption(data.navQuickBottomOption.map(c => ({ ...c, type: c.type || "quick-bottom" })));
    if (data.saleEvents) setSelectedPromo(data.saleEvents);
    if (data.footer) setFooter(data.footer);

    // Load individual sections
    if (data.featuredProducts) setFeaturedProducts(data.featuredProducts);
    if (data.newProducts) setNewProducts(data.newProducts);
    if (data.brandShowcase) setBrandShowcase(data.brandShowcase);
    if (data.hotDeals) setHotDeals(data.hotDeals);
    if (data.news) setNews(data.news);
    if (data.featuredCategories) setFeaturedCategories(data.featuredCategories);
    if (data.categorySections) setCategorySections(data.categorySections);

    if (data.layout && data.layout.length > 0) {
      let mergedLayout = [...data.layout];
      if (!mergedLayout.includes('featured_categories')) {
        mergedLayout.splice(1, 0, 'featured_categories');
      }
      setLayout(mergedLayout);
    }
  }, [data]);

  useEffect(() => {
    if (rawShippingConfig) {
      setShippingConfig(rawShippingConfig);
    }
  }, [rawShippingConfig]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: HomePageConfig = {
        banners: [...mainSlides, ...sideBanners],
        navCategories: categories,
        navQuickTopOption: quickTopOption,
        navQuickBottomOption: quickBottomOption,
        saleEvents: selectedPromo,
        footer,
        featuredProducts,
        newProducts,
        brandShowcase,
        hotDeals,
        news,
        featuredCategories,
        categorySections,
        layout,
      };
      await adminApi.saveFullConfig(payload);
      await adminApi.saveShippingConfig(shippingConfig);
      message.success("Đã lưu toàn bộ cấu hình thành công!");
    } catch (err) {
      message.error("Lưu thất bại!");
    } finally {
      setSaving(false);
    }
  };

  const updateSlot = (updated: VisualBanner | NavSlot) => {
    const update = (prev: any[]) => prev.map(x => x.id === updated.id ? updated : x);
    if (updated.type === "main") setMainSlides(update);
    else if (updated.type === "side") setSideBanners(update);
    else if (updated.type === "category") setCategories(update);
    else if (updated.type === "quick-top") setQuickTopOption(update);
    else if (updated.type === "quick-bottom") setQuickBottomOption(update);
  };

  const activeSlide = mainSlides.find((s) => s.id === activeSlideId) ?? mainSlides[0];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setLayout((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const getSectionData = (id: string) => {
    if (id === 'featured_products') return { data: featuredProducts, icon: <StarOutlined />, type: 'featured' };
    if (id === 'featured_categories') return { data: featuredCategories, icon: <AppstoreOutlined />, type: 'featured_categories' };
    if (id === 'new_products') return { data: newProducts, icon: <FireOutlined />, type: 'new' };
    if (id === 'brand_showcase') return { data: brandShowcase, icon: <ShopOutlined />, type: 'brand' };
    if (id === 'hot_deals') return { data: hotDeals, icon: <ThunderboltOutlined />, type: 'hot' };
    if (id === 'news') return { data: news, icon: <ReadOutlined />, type: 'news' };

    const catSec = categorySections.find(c => c.id === id);
    if (catSec) return { data: catSec, icon: <AppstoreOutlined />, type: 'category' };
    return null;
  };

  const deleteCategorySection = (id: string) => {
    setCategorySections(prev => prev.filter(c => c.id !== id));
    setLayout(prev => prev.filter(l => l !== id));
  };

  const activeCategorySection = categorySections.find(c => c.id === modalOpen.type.replace('cat_', '')) || null;

  return (
    <div className="banner-manager">
      <div className="banner-manager__toolbar">
        <div>
          <Title level={2} style={{ margin: 0 }}>⚙️ Cấu hình Trang Chủ</Title>
          <Text type="secondary">Quản lý nội dung và các khối hiển thị</Text>
        </div>
        <Space size="middle">
          <Button icon={<EyeOutlined />} size="large" onClick={() => setPreviewOpen(true)}>Xem trước</Button>
          <Button type="primary" icon={<SaveOutlined />} size="large" onClick={handleSave} loading={saving}>Lưu tất cả</Button>
        </Space>
      </div>

      <Tabs
        type="line"
        size="large"
        items={[
          {
            key: "visuals",
            label: <span><PictureOutlined /> Banners</span>,
            children: (
              <Card bordered={false}>
                <SlideStrip slides={mainSlides} activeId={activeSlideId} onSelect={setActiveSlideId} onAdd={() => setMainSlides([...mainSlides, { ...defaultMainSlides[0], id: genId() }])} onDelete={id => setMainSlides(mainSlides.filter(s => s.id !== id))} />
                <div className="banner-grid" style={{ marginTop: 24 }}>
                  <EditableSlot label={activeSlide?.label} onClick={() => setEditing(activeSlide)}><BannerImg slot={activeSlide} className="banner-grid__main" /></EditableSlot>
                  <div className="banner-grid__sides">
                    {sideBanners.map(s => <EditableSlot key={s.id} label={s.label} onClick={() => setEditing(s)}><BannerImg slot={s} className="banner-grid__side" /></EditableSlot>)}
                  </div>
                </div>
              </Card>
            )
          },
          {
            key: "navigation",
            label: <span><AppstoreOutlined /> Menu</span>,
            children: (
              <div className="navigation-config-grid">
                <Card
                  title="📁 Danh mục nhanh"
                  bordered={false}
                  actions={[
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        const newId = `cat-${Date.now()}`;
                        setCategories([...categories, { id: newId, type: "category", label: "Danh mục mới", icon: "🏪", link: "/" }]);
                      }}
                      style={{ width: "90%", margin: "0 auto" }}
                    >
                      Thêm dòng
                    </Button>
                  ]}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {categories.map(cat => (
                      <div key={cat.id} className="menu-config-row" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <EditableSlot label={cat.label} onClick={() => setEditing(cat)}>
                            <div className="category-slot-item"><span>{cat.icon}</span> {cat.label}</div>
                          </EditableSlot>
                        </div>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => setCategories(categories.filter(x => x.id !== cat.id))}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
                <div className="quick-options-column">
                  <Card
                    title="Sidebar top "
                    bordered={false}
                    actions={[
                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          const newId = `quick-top-${Date.now()}`;
                          setQuickTopOption([...quickTopOption, { id: newId, type: "quick-top", label: "Menu mới", link: "/" }]);
                        }}
                        style={{ width: "90%", margin: "0 auto" }}
                      >
                        Thêm dòng
                      </Button>
                    ]}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {quickTopOption.map(item => (
                        <div key={item.id} className="menu-config-row" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1 }}>
                            <EditableSlot label={item.label} onClick={() => setEditing(item)}>
                              <div className="sidebar-hint__item">{item.label}</div>
                            </EditableSlot>
                          </div>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => setQuickTopOption(quickTopOption.filter(x => x.id !== item.id))}
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card
                    title="⚡ Sidebar Bottom"
                    bordered={false}
                    style={{ marginTop: 24 }}
                    actions={[
                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          const newId = `quick-bottom-${Date.now()}`;
                          setQuickBottomOption([...quickBottomOption, { id: newId, type: "quick-bottom", label: "Từ khóa mới", link: "/" }]);
                        }}
                        style={{ width: "90%", margin: "0 auto" }}
                      >
                        Thêm dòng
                      </Button>
                    ]}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {quickBottomOption.map(item => (
                        <div key={item.id} className="menu-config-row" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1 }}>
                            <EditableSlot label={item.label} onClick={() => setEditing(item)}>
                              <div className="sidebar-hint__item">{item.label}</div>
                            </EditableSlot>
                          </div>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => setQuickBottomOption(quickBottomOption.filter(x => x.id !== item.id))}
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )
          },
          {
            key: "sections",
            label: <span><AppstoreOutlined /> Sections</span>,
            children: (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      const newId = genCatId();
                      setCategorySections([...categorySections, { id: newId, title: 'Danh mục mới', active: true, categoryIds: [], productPerRow: 5 }]);
                      setLayout([...layout, newId]);
                    }}
                  >
                    Thêm Section Danh Mục
                  </Button>
                </div>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={layout}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="sections-grid-layout" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {layout.map(id => {
                        const secInfo = getSectionData(id);
                        if (!secInfo) return null;
                        return (
                          <SortableSectionCard
                            key={id}
                            id={id}
                            icon={secInfo.icon}
                            title={secInfo.data.title}
                            section={secInfo.data}
                            onEdit={() => setModalOpen({ type: secInfo.type === 'category' ? `cat_${id}` : secInfo.type, open: true })}
                            onDelete={secInfo.type === 'category' ? () => deleteCategorySection(id) : undefined}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )
          },
          {
            key: "promos",
            label: <span><TagOutlined /> Khuyến mãi</span>,
            children: (
              <Card bordered={false}>
                <PromoPostsSlot posts={allPosts?.content} loading={isLoadingPosts} selected={selectedPromo} onChange={setSelectedPromo} />
              </Card>
            )
          },
          {
            key: "footer",
            label: <span><ShopOutlined /> Footer & Liên hệ</span>,
            children: (
              <Card bordered={false} title="🏢 Cấu hình Thông tin Footer & Liên hệ">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <div>
                    <h3 style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 8, marginBottom: 16, color: "#1890ff" }}>ℹ️ Thông tin chung</h3>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#595959" }}>Mô tả công ty</label>
                      <Input.TextArea
                        rows={4}
                        value={footer.companyDescription}
                        onChange={e => setFooter({ ...footer, companyDescription: e.target.value })}
                        placeholder="Chuyên cung cấp linh kiện điện tử chính hãng..."
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#595959" }}>Bản quyền (Copyright)</label>
                      <Input
                        value={footer.copyright}
                        onChange={e => setFooter({ ...footer, copyright: e.target.value })}
                        placeholder="© 2026 Anbato Electronic. All rights reserved."
                      />
                    </div>
                  </div>

                  <div>
                    <h3 style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 8, marginBottom: 16, color: "#1890ff" }}>📞 Liên hệ & Giờ làm việc</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                      <div>
                        <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#595959" }}>Hotline</label>
                        <Input
                          value={footer.hotline}
                          onChange={e => setFooter({ ...footer, hotline: e.target.value })}
                          placeholder="1900 1000"
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#595959" }}>Email</label>
                        <Input
                          value={footer.email}
                          onChange={e => setFooter({ ...footer, email: e.target.value })}
                          placeholder="lienhe@company.com"
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#595959" }}>Địa chỉ</label>
                      <Input
                        value={footer.address}
                        onChange={e => setFooter({ ...footer, address: e.target.value })}
                        placeholder="123 Đường Trần Phú, Quận Hà Đông, TP.Hà Nội"
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#595959" }}>Giờ làm việc</label>
                      <Input
                        value={footer.workingHours}
                        onChange={e => setFooter({ ...footer, workingHours: e.target.value })}
                        placeholder="Thứ 2 - Thứ 7: 8:00 - 19:00"
                      />
                    </div>
                  </div>
                </div>

                <h3 style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 8, marginTop: 24, marginBottom: 16, color: "#1890ff" }}>🌐 Liên kết Mạng xã hội</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#595959" }}>Facebook Link</label>
                    <Input
                      value={footer.facebookLink}
                      onChange={e => setFooter({ ...footer, facebookLink: e.target.value })}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#595959" }}>Twitter Link</label>
                    <Input
                      value={footer.twitterLink}
                      onChange={e => setFooter({ ...footer, twitterLink: e.target.value })}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#595959" }}>Instagram Link</label>
                    <Input
                      value={footer.instagramLink}
                      onChange={e => setFooter({ ...footer, instagramLink: e.target.value })}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#595959" }}>Youtube Link</label>
                    <Input
                      value={footer.youtubeLink}
                      onChange={e => setFooter({ ...footer, youtubeLink: e.target.value })}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                </div>

                <h3 style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 8, marginTop: 24, marginBottom: 16, color: "#fa541c" }}>🛍️ Gian hàng trên các Sàn TMĐT</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#595959" }}>Shopee Link</label>
                    <Input
                      value={footer.shopeeLink}
                      onChange={e => setFooter({ ...footer, shopeeLink: e.target.value })}
                      placeholder="https://shopee.vn/..."
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#595959" }}>Lazada Link</label>
                    <Input
                      value={footer.lazadaLink}
                      onChange={e => setFooter({ ...footer, lazadaLink: e.target.value })}
                      placeholder="https://lazada.vn/..."
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#595959" }}>Tiktok Shop Link</label>
                    <Input
                      value={footer.tiktokLink}
                      onChange={e => setFooter({ ...footer, tiktokLink: e.target.value })}
                      placeholder="https://tiktok.com/@..."
                    />
                  </div>
                </div>
              </Card>
            )
          },
          {
            key: "shipping",
            label: <span><EnvironmentOutlined /> Giao hàng (GHN)</span>,
            children: (
              <Card bordered={false} title="🚚 Cấu hình Vị trí Cửa hàng">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#595959" }}>Tỉnh/Thành (GHN)</label>
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Chọn tỉnh/thành"
                      loading={loadingProvinces}
                      value={shippingConfig.ghnProvinceId}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                      }
                      options={provinces?.map(p => ({
                        value: p.ProvinceID,
                        label: p.ProvinceName,
                      }))}
                      onChange={(val, option: any) => {
                        setShippingConfig(prev => ({
                          ...prev,
                          ghnProvinceId: val,
                          provinceName: option?.label,
                          ghnDistrictId: undefined,
                          districtName: undefined,
                          ghnWardCode: undefined,
                          wardName: undefined
                        }));
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#595959" }}>Quận/Huyện (GHN)</label>
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Chọn quận/huyện"
                      loading={loadingDistricts}
                      disabled={!shippingConfig.ghnProvinceId}
                      value={shippingConfig.ghnDistrictId}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                      }
                      options={districts?.map(d => ({
                        value: d.DistrictID,
                        label: d.DistrictName,
                      }))}
                      onChange={(val, option: any) => {
                        setShippingConfig(prev => ({
                          ...prev,
                          ghnDistrictId: val,
                          districtName: option?.label,
                          ghnWardCode: undefined,
                          wardName: undefined
                        }));
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#595959" }}>Phường/Xã (GHN)</label>
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Chọn phường/xã"
                      loading={loadingWards}
                      disabled={!shippingConfig.ghnDistrictId}
                      value={shippingConfig.ghnWardCode}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                      }
                      options={wards?.map(w => ({
                        value: w.WardCode,
                        label: w.WardName,
                      }))}
                      onChange={(val, option: any) => {
                        setShippingConfig(prev => ({
                          ...prev,
                          ghnWardCode: val,
                          wardName: option?.label
                        }));
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#595959" }}>Địa chỉ chi tiết (Không bắt buộc)</label>
                  <Input.TextArea
                    rows={2}
                    value={shippingConfig.detailAddress}
                    onChange={e => setShippingConfig({ ...shippingConfig, detailAddress: e.target.value })}
                    placeholder="Số 123, đường ABC..."
                  />
                </div>
              </Card>
            )
          }
        ]}
      />

      {editing && (
        <div className="edit-panel-overlay" onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <EditPanel slot={editing} onSave={updateSlot} onClose={() => setEditing(null)} />
        </div>
      )}

      {/* Modals for each section */}
      <ProductSectionModal open={modalOpen.type === 'featured'} section={featuredProducts} onCancel={() => setModalOpen({ type: '', open: false })} onSave={setFeaturedProducts} />
      <NewProductSectionModal open={modalOpen.type === 'new'} section={newProducts} onCancel={() => setModalOpen({ type: '', open: false })} onSave={setNewProducts} />
      <BrandShowcaseModal open={modalOpen.type === 'brand'} section={brandShowcase} onCancel={() => setModalOpen({ type: '', open: false })} onSave={setBrandShowcase} />
      <HotDealsSectionModal open={modalOpen.type === 'hot'} section={hotDeals} onCancel={() => setModalOpen({ type: '', open: false })} onSave={setHotDeals} />
      <NewsSectionModal open={modalOpen.type === 'news'} section={news} onCancel={() => setModalOpen({ type: '', open: false })} onSave={setNews} />
      <FeaturedCategoryModal open={modalOpen.type === 'featured_categories'} section={featuredCategories} onCancel={() => setModalOpen({ type: '', open: false })} onSave={setFeaturedCategories} />
      <CategorySectionModal
        open={modalOpen.type.startsWith('cat_')}
        section={activeCategorySection}
        onCancel={() => setModalOpen({ type: '', open: false })}
        onSave={(updated) => {
          setCategorySections(prev => prev.map(c => c.id === updated.id ? updated : c));
          setModalOpen({ type: '', open: false });
        }}
      />

      <Modal open={previewOpen} title="Xem trước" onCancel={() => setPreviewOpen(false)} footer={null} width={900}>
        <div className="preview-content">
          <div className="banner-grid">
            <BannerImg slot={activeSlide} className="banner-grid__main" />
            <div className="banner-grid__sides">{sideBanners.map(s => <BannerImg key={s.id} slot={s} className="banner-grid__side" />)}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HomeConfigPage;