import type { BannerSlot } from "../../../types/entity.type";
import { DeleteOutlined, PictureOutlined, PlusOutlined } from "@ant-design/icons";
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

export default SlideStrip;