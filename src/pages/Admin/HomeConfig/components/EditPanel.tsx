import { useRef, useState } from "react";
import axios from "axios";
import {
  EditOutlined,
  PictureOutlined,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  FontSizeOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { Button, Input } from "antd";
import type { NavSlot, VisualBanner } from "../../../../types/entity.type";
import { BASE_URL } from "../../../../app/const";
import { antdMessage } from "../../../../utils/antdMessage";

interface EditPanelProps {
  slot: VisualBanner | NavSlot;
  onSave: (updated: VisualBanner | NavSlot) => void;
  onClose: () => void;
}

const EditPanel = ({ slot, onSave, onClose }: EditPanelProps) => {
  const [form, setForm] = useState<any>({ ...slot });
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(`${BASE_URL}/upload/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.imageUrl as string;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        antdMessage.error("Ảnh phải nhỏ hơn 5MB");
        return;
      }
      const url = await uploadImage(file);
      setForm((f: any) => ({ ...f, image: url }));
      antdMessage.success("Upload ảnh thành công!");
    } catch {
      antdMessage.error("Upload thất bại!");
    }
  };

  const set = (key: string, val: string) =>
    setForm((f: any) => ({ ...f, [key]: val }));

  const isMainOrSide = slot.type === "main" || slot.type === "side";
  const isIconLabel = slot.type === "category" || slot.type === "quick-top" || slot.type === "quick-bottom";

  return (
    <div className="edit-panel">
      <div className="edit-panel__header">
        <span className="edit-panel__title">✏️ Chỉnh sửa: {slot.label}</span>
        <button className="edit-panel__close" onClick={onClose}>✕</button>
      </div>

      <div className="edit-panel__body">
        {/* Hình ảnh - Không hiển thị cho Danh mục nhanh (category) và Sidebar Bottom (quick-bottom) */}
        {slot.type !== "category" && slot.type !== "quick-bottom" && (
          <div className="edit-field">
            <label className="edit-field__label"><PictureOutlined /> Hình ảnh</label>
            <div
              className="image-drop"
              onClick={() => fileRef.current?.click()}
              style={form.image ? { backgroundImage: `url(${form.image})` } : undefined}
            >
              {!form.image && (
                <div className="image-drop__placeholder">
                  <PlusOutlined />
                  <span>Chọn ảnh</span>
                  <small>JPG, PNG, WebP — tối đa 5MB</small>
                </div>
              )}
              {form.image && <div className="image-drop__overlay"><EditOutlined /> Đổi ảnh</div>}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            {form.image && (
              <button className="image-clear" onClick={() => set("image", "")}>
                <DeleteOutlined /> Xóa ảnh
              </button>
            )}
          </div>
        )}

        {/* ── Danh mục con (Chỉ hiển thị cho Sidebar top - quick-top) ── */}
        {slot.type === "quick-top" && (
          <div className="edit-field" style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
            <label className="edit-field__label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span>📂 Danh mục con</span>
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => {
                  const children = form.children || [];
                  setForm({
                    ...form,
                    children: [
                      ...children,
                      { id: `sub-${Date.now()}`, type: "quick-top", label: "Danh mục con mới", link: "/" }
                    ]
                  });
                }}
              >
                Thêm con
              </Button>
            </label>

            <div className="sub-categories-list" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(!form.children || form.children.length === 0) && (
                <div style={{ color: "#8c8c8c", fontSize: 13, fontStyle: "italic", textAlign: "center", padding: "12px 0" }}>
                  Chưa có danh mục con nào.
                </div>
              )}
              {form.children?.map((child: any, idx: number) => (
                <div
                  key={child.id}
                  style={{
                    background: "#f9f9f9",
                    border: "1px solid #e8e8e8",
                    borderRadius: 6,
                    padding: 10,
                    position: "relative"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 12, color: "#595959" }}>Danh mục con #{idx + 1}</span>
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        setForm({
                          ...form,
                          children: form.children.filter((c: any) => c.id !== child.id)
                        });
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 10, color: "#8c8c8c", display: "block", marginBottom: 2 }}>Tên hiển thị</label>
                      <Input
                        size="small"
                        value={child.label}
                        onChange={(e) => {
                          const updatedChildren = form.children.map((c: any) =>
                            c.id === child.id ? { ...c, label: e.target.value } : c
                          );
                          setForm({ ...form, children: updatedChildren });
                        }}
                        placeholder="VD: Adapter sạc"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: "#8c8c8c", display: "block", marginBottom: 2 }}>Đường dẫn</label>
                    <Input
                      size="small"
                      value={child.link}
                      onChange={(e) => {
                        const updatedChildren = form.children.map((c: any) =>
                          c.id === child.id ? { ...c, link: e.target.value } : c
                        );
                        setForm({ ...form, children: updatedChildren });
                      }}
                      placeholder="/san-pham/bo-sac"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fields cho main / side */}
        {isMainOrSide && (
          <>
            <div className="edit-field">
              <label className="edit-field__label"><FontSizeOutlined /> Tiêu đề</label>
              <Input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="VD: HAPPY NEW YEAR 2026"
              />
            </div>
            <div className="edit-field">
              <label className="edit-field__label"><FontSizeOutlined /> Phụ đề</label>
              <Input
                value={form.subtitle}
                onChange={(e) => set("subtitle", e.target.value)}
                placeholder="VD: KHI MUA TỪ 2 MÓN TRỞ LÊN"
              />
            </div>
            <div className="edit-field">
              <label className="edit-field__label">🏷️ Badge / Nhãn</label>
              <Input
                value={form.badge}
                onChange={(e) => set("badge", e.target.value)}
                placeholder="VD: GIẢM NGAY 15%"
              />
            </div>
          </>
        )}

        {/* Fields cho category / quick-top / quick-bottom */}
        {isIconLabel && (
          <>
            <div className="edit-field">
              <label className="edit-field__label">Icon (emoji)</label>
              <Input
                value={(form as NavSlot).icon}
                onChange={(e) => set("icon", e.target.value)}
                placeholder="VD: ⚡"
                maxLength={4}
              />
            </div>
            <div className="edit-field">
              <label className="edit-field__label"><FontSizeOutlined /> Tên hiển thị</label>
              <Input
                value={form.label}
                onChange={(e) => set("label", e.target.value)}
                placeholder="VD: Deal Hot Giờ Vàng"
              />
            </div>
          </>
        )}

        {/* Link — hiện với tất cả */}
        <div className="edit-field">
          <label className="edit-field__label"><LinkOutlined /> Đường dẫn</label>
          <Input
            value={form.link}
            onChange={(e) => set("link", e.target.value)}
            placeholder="/san-pham"
          />
        </div>
      </div>

      <div className="edit-panel__footer">
        <Button onClick={onClose}>Hủy</Button>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={() => { onSave(form); onClose(); antdMessage.success("Đã lưu!"); }}
        >
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default EditPanel;