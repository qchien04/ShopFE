import type { BannerSlot } from "../../../types/entity.type";
import { PictureOutlined } from "@ant-design/icons";
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
export default BannerImg;