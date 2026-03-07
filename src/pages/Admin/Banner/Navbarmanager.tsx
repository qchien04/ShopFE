// NavbarSection.tsx
// Section nhỏ gọn đặt TRÊN SlideStrip trong banner-canvas__main
// Cho phép chỉnh sửa menu topbar ngay trong trang BannerManager

import { useState, useEffect } from "react";
import { Input, Switch, Tooltip, Tag } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  LinkOutlined,
  DownOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CaretRightOutlined,
  MenuOutlined,
} from "@ant-design/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavChild {
  id: string;
  label: string;
  link: string;
  visible: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  link: string;
  visible: boolean;
  hasDropdown: boolean;
  children: NavChild[];
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const defaultNavItems: NavItem[] = [
  { id: "nav-1", label: "Trang Chủ",               link: "/",                  visible: true,  hasDropdown: false, children: [] },
  { id: "nav-2", label: "Giới Thiệu",              link: "/gioi-thieu",        visible: true,  hasDropdown: false, children: [] },
  {
    id: "nav-3", label: "Sản Phẩm", link: "/san-pham", visible: true, hasDropdown: true,
    children: [
      { id: "nav-3-1", label: "Linh kiện điện tử", link: "/san-pham/linh-kien", visible: true },
      { id: "nav-3-2", label: "Bo mạch & Module",  link: "/san-pham/bo-mach",  visible: true },
    ],
  },
  { id: "nav-4", label: "Kiểm Tra Đơn Hàng",       link: "/kiem-tra-don-hang", visible: true,  hasDropdown: false, children: [] },
  {
    id: "nav-5", label: "Sàn Thương Mại Điện Tử",  link: "/san-tmdt", visible: true, hasDropdown: true,
    children: [
      { id: "nav-5-1", label: "Shopee", link: "https://shopee.vn", visible: true },
      { id: "nav-5-2", label: "Lazada", link: "https://lazada.vn", visible: true },
    ],
  },
  {
    id: "nav-6", label: "Chương Trình Khuyến Mãi",  link: "/khuyen-mai", visible: true, hasDropdown: true,
    children: [
      { id: "nav-6-1", label: "Flash Sale",    link: "/khuyen-mai/flash-sale",  visible: true },
      { id: "nav-6-2", label: "Mã giảm giá",  link: "/khuyen-mai/ma-giam-gia", visible: true },
    ],
  },
  {
    id: "nav-7", label: "Bài Viết", link: "/bai-viet", visible: true, hasDropdown: true,
    children: [
      { id: "nav-7-1", label: "Tin tức",   link: "/bai-viet/tin-tuc",   visible: true },
      { id: "nav-7-2", label: "Mẹo vặt",   link: "/bai-viet/meo-vat",   visible: true },
      { id: "nav-7-3", label: "Hướng dẫn", link: "/bai-viet/huong-dan", visible: true },
    ],
  },
];

const genId = (p = "nav") => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;

// ─── NavPreviewBar ─────────────────────────────────────────────────────────────
// Mini preview giống hệt thanh nav thật

const NavPreviewBar = ({ items }: { items: NavItem[] }) => (
  <div className="nav-preview-bar">
    {items.filter(i => i.visible).map(item => (
      <div key={item.id} className="nav-preview-bar__item">
        <span>{item.label}</span>
        {item.hasDropdown && item.children.some(c => c.visible) && (
          <DownOutlined className="nav-preview-bar__caret" />
        )}
      </div>
    ))}
  </div>
);

// ─── NavItemRow ────────────────────────────────────────────────────────────────
// Mỗi menu item — compact, inline, expand khi có children

const NavItemRow = ({
  item, index, total, onChange, onDelete, onMoveUp, onMoveDown,
}: {
  item: NavItem; index: number; total: number;
  onChange: (u: NavItem) => void; onDelete: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const set = <K extends keyof NavItem>(k: K, v: NavItem[K]) => onChange({ ...item, [k]: v });

  const addChild = () => set("children", [
    ...item.children,
    { id: genId("c"), label: "", link: "/", visible: true },
  ]);
  const updChild = (id: string, u: NavChild) =>
    set("children", item.children.map(c => c.id === id ? u : c));
  const delChild = (id: string) =>
    set("children", item.children.filter(c => c.id !== id));

  return (
    <div className={`nav-item-row ${!item.visible ? "nav-item-row--hidden" : ""}`}>
      {/* ── Main row ── */}
      <div className="nav-item-row__main">
        {/* Order controls */}
        <div className="nav-item-row__order">
          <button className="nav-order-btn" disabled={index === 0}           onClick={onMoveUp}>▲</button>
          <span className="nav-order-num">{index + 1}</span>
          <button className="nav-order-btn" disabled={index === total - 1}   onClick={onMoveDown}>▼</button>
        </div>

        {/* Label */}
        <Input
          size="small"
          value={item.label}
          onChange={e => set("label", e.target.value)}
          placeholder="Tên menu"
          className="nav-item-row__label-input"
        />

        {/* Link */}
        <Input
          size="small"
          value={item.link}
          onChange={e => set("link", e.target.value)}
          placeholder="/duong-dan"
          prefix={<LinkOutlined style={{ color: "#9ca3af", fontSize: 11 }} />}
          className="nav-item-row__link-input"
        />

        {/* Dropdown toggle */}
        <Tooltip title="Có dropdown con">
          <div className="nav-item-row__toggle-group">
            <DownOutlined style={{ fontSize: 10, color: "#9ca3af" }} />
            <Switch size="small" checked={item.hasDropdown} onChange={v => { set("hasDropdown", v); if (v) setOpen(true); }} />
          </div>
        </Tooltip>

        {/* Visible toggle */}
        <Tooltip title={item.visible ? "Hiển thị" : "Đang ẩn"}>
          <Switch
            size="small"
            checked={item.visible}
            onChange={v => set("visible", v)}
            checkedChildren={<EyeOutlined />}
            unCheckedChildren={<EyeInvisibleOutlined />}
          />
        </Tooltip>

        {/* Expand children */}
        {item.hasDropdown && (
          <button
            className={`nav-item-row__expand-btn ${open ? "nav-item-row__expand-btn--open" : ""}`}
            onClick={() => setOpen(o => !o)}
          >
            <CaretRightOutlined />
            <span>{item.children.length}</span>
          </button>
        )}

        {/* Delete */}
        <Tooltip title="Xóa">
          <button className="nav-item-row__del-btn" onClick={onDelete}>
            <DeleteOutlined />
          </button>
        </Tooltip>
      </div>

      {/* ── Children rows (expanded) ── */}
      {item.hasDropdown && open && (
        <div className="nav-item-row__children">
          {item.children.map((child, ci) => (
            <div key={child.id} className="nav-child-row">
              <CaretRightOutlined style={{ color: "#d1d5db", fontSize: 10, flexShrink: 0 }} />
              <Input
                size="small" value={child.label}
                onChange={e => updChild(child.id, { ...child, label: e.target.value })}
                placeholder={`Item con ${ci + 1}`}
                style={{ flex: 1 }}
              />
              <Input
                size="small" value={child.link}
                onChange={e => updChild(child.id, { ...child, link: e.target.value })}
                placeholder="/duong-dan"
                prefix={<LinkOutlined style={{ color: "#9ca3af", fontSize: 10 }} />}
                style={{ flex: 1.2 }}
              />
              <Switch
                size="small" checked={child.visible}
                onChange={v => updChild(child.id, { ...child, visible: v })}
                checkedChildren={<EyeOutlined />}
                unCheckedChildren={<EyeInvisibleOutlined />}
              />
              <button className="nav-child-row__del" onClick={() => delChild(child.id)}>
                <DeleteOutlined />
              </button>
            </div>
          ))}
          <button className="nav-child-row__add" onClick={addChild}>
            <PlusOutlined /> Thêm item con
          </button>
        </div>
      )}
    </div>
  );
};

// ─── NavbarSection ─────────────────────────────────────────────────────────────

interface NavbarSectionProps {
  initialItems?: NavItem[];
  onChange: (items: NavItem[]) => void;
}

const NavbarSection = ({ initialItems, onChange }: NavbarSectionProps) => {
  const [items, setItems] = useState<NavItem[]>(initialItems ?? defaultNavItems);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (initialItems?.length) setItems(initialItems);
  }, [initialItems]);

  const update = (next: NavItem[]) => { setItems(next); onChange(next); };

  const addItem = () => update([...items, {
    id: genId(), label: "Menu mới", link: "/", visible: true, hasDropdown: false, children: [],
  }]);

  const moveUp   = (i: number) => { const a = [...items]; [a[i-1], a[i]] = [a[i], a[i-1]]; update(a); };
  const moveDown = (i: number) => { const a = [...items]; [a[i], a[i+1]] = [a[i+1], a[i]]; update(a); };

  return (
    <div className="navbar-section">
      {/* Header */}
      <div className="navbar-section__header" onClick={() => setCollapsed(c => !c)}>
        <div className="navbar-section__header-left">
          <MenuOutlined className="navbar-section__icon" />
          <span className="navbar-section__title">Thanh điều hướng (Topbar)</span>
          <Tag color="green" style={{ marginLeft: 6 }}>
            {items.filter(i => i.visible).length} hiển thị
          </Tag>
          {items.some(i => !i.visible) && (
            <Tag color="default">{items.filter(i => !i.visible).length} ẩn</Tag>
          )}
        </div>
        <div className="navbar-section__header-right">
          <span className="navbar-section__collapse-hint">
            {collapsed ? "Mở rộng ▼" : "Thu gọn ▲"}
          </span>
        </div>
      </div>

      {!collapsed && (
        <div className="navbar-section__body">
          {/* Live preview */}
          <NavPreviewBar items={items} />

          {/* Column headers */}
          <div className="nav-col-headers">
            <span style={{ width: 52 }}>Thứ tự</span>
            <span style={{ flex: 1 }}>Tên hiển thị</span>
            <span style={{ flex: 1.2 }}>Đường dẫn</span>
            <span style={{ width: 70 }}>Dropdown</span>
            <span style={{ width: 60 }}>Hiển thị</span>
            <span style={{ width: 24 }}></span>
            <span style={{ width: 24 }}></span>
          </div>

          {/* Items */}
          {items.map((item, idx) => (
            <NavItemRow
              key={item.id}
              item={item}
              index={idx}
              total={items.length}
              onChange={updated => update(items.map(i => i.id === updated.id ? updated : i))}
              onDelete={() => update(items.filter(i => i.id !== item.id))}
              onMoveUp={() => moveUp(idx)}
              onMoveDown={() => moveDown(idx)}
            />
          ))}

          {/* Add button */}
          <button className="navbar-section__add-btn" onClick={addItem}>
            <PlusOutlined /> Thêm menu item
          </button>
        </div>
      )}
    </div>
  );
};

export default NavbarSection;