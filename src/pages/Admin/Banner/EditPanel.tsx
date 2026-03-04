import { useRef, useState } from "react";
import type { BannerSlot, BannerSlotChild } from "../../../types/entity.type";
import axios from "axios";
import { BASE_URL } from "../../../app/const";
import { antdMessage } from "../../../utils/antdMessage";
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

interface EditPanelProps {
  slot: BannerSlot;
  onSave: (updated: BannerSlot) => void;
  onClose: () => void;
}

const EditPanel = ({ slot, onSave, onClose }: EditPanelProps) => {
  const [form, setForm] = useState<BannerSlot>({ ...slot });
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
      setForm((f) => ({ ...f, image: url }));
      antdMessage.success("Upload ảnh thành công!");
    } catch {
      antdMessage.error("Upload thất bại!");
    }
  };

  const set = (key: keyof BannerSlot, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const addChild = () => {
    setForm((f) => ({
      ...f,
      children: [
        ...(f.children ?? []),
        { id: `child-${Date.now()}`, label: "", link: "/", icon: "" },
      ],
    }));
  };

  const removeChild = (id: string) => {
    setForm((f) => ({ ...f, children: (f.children ?? []).filter((c) => c.id !== id) }));
  };

  const setChild = (id: string, key: keyof BannerSlotChild, val: string) => {
    setForm((f) => ({
      ...f,
      children: (f.children ?? []).map((c) => c.id === id ? { ...c, [key]: val } : c),
    }));
  };

  const isMainOrSide = slot.type === "main" || slot.type === "side";
  const isIconLabel  = slot.type === "category" || slot.type === "quick-top" || slot.type === "quick-bottom";

  return (
    <div className="edit-panel">
      <div className="edit-panel__header">
        <span className="edit-panel__title">✏️ Chỉnh sửa: {slot.label}</span>
        <button className="edit-panel__close" onClick={onClose}>✕</button>
      </div>

      <div className="edit-panel__body">
        {/* Hình ảnh */}
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
                value={form.icon}
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

            {/* ── Dropdown children — chỉ với quick-top ── */}
            {slot.type === "quick-top" && (
              <div className="edit-field">
                <label className="edit-field__label">📋 Danh sách dropdown</label>

                <div className="children-list">
                  {(form.children ?? []).map((child, idx) => (
                    <div key={child.id} className="children-list__item">
                      <span className="children-list__num">{idx + 1}</span>

                      <Input
                        value={child.icon}
                        onChange={(e) => setChild(child.id, "icon", e.target.value)}
                        placeholder="🔥"
                        maxLength={4}
                        style={{ width: 52 }}
                      />
                      <Input
                        value={child.label}
                        onChange={(e) => setChild(child.id, "label", e.target.value)}
                        placeholder="Tên item"
                        style={{ flex: 1 }}
                      />
                      <Input
                        value={child.link}
                        onChange={(e) => setChild(child.id, "link", e.target.value)}
                        placeholder="/duong-dan"
                        style={{ flex: 1 }}
                      />

                      <button className="children-list__del" onClick={() => removeChild(child.id)}>
                        <DeleteOutlined />
                      </button>
                    </div>
                  ))}
                </div>

                <button className="children-list__add" onClick={addChild}>
                  <PlusOutlined /> Thêm item con
                </button>
              </div>
            )}
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