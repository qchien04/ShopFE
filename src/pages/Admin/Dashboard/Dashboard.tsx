// Dashboard.tsx
import { Table, Tag, Progress, Tooltip, Spin, Alert } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  RecentOrderDTO,
  FeaturedProductDTO,
  OrderStatus,
} from "../../../types/entity.type";
import "./Dashboard.scss";
import type { ProductStatus } from "../../../types/product.type";
import { useDashboard } from "../../../hooks/Admin";

const fmtCurrency = (v: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

const fmtPercent = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  PENDING:    { label: "Chờ xác nhận", color: "amber"  },
  CONFIRMED:  { label: "Đã xác nhận",  color: "blue"   },
  PROCESSING: { label: "Đang xử lý",   color: "violet" },
  SHIPPING:   { label: "Đang giao",    color: "cyan"   },
  DELIVERED:  { label: "Đã giao",      color: "green"  },
  CANCELLED:  { label: "Đã huỷ",       color: "red"    },
  RETURNED:   { label: "Hoàn hàng",    color: "orange" },
};

const PRODUCT_STATUS_CONFIG: Record<ProductStatus, { label: string; color: string }> = {
  PUBLISHED:    { label: "Đang bán",  color: "green"   },
  DRAFT:        { label: "Nháp",      color: "default" },
  OUT_OF_STOCK: { label: "Hết hàng",  color: "red"     },
  DISCONTINUED: { label: "Ngưng bán", color: "orange"  },
};

const PAY_STATUS_CONFIG = {
  UNPAID:   { label: "Chưa TT", color: "red"   },
  PAID:     { label: "Đã TT",   color: "green" },
  REFUNDED: { label: "Hoàn TT", color: "blue"  },
};

const MiniBarChart = ({ data }: { data: { dayLabel: string; revenue: number }[] }) => {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="mini-chart">
      {data.map((d, i) => (
        <Tooltip key={i} title={`${d.dayLabel}: ${fmtCurrency(d.revenue)}`}>
          <div className="mini-chart__col">
            <div className="mini-chart__bar" style={{ height: `${(d.revenue / max) * 100}%` }} />
            <span className="mini-chart__label">{d.dayLabel}</span>
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

const DonutChart = ({ data }: { data: { label: string; count: number; color: string }[] }) => {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const radius = 56;
  const circ = 2 * Math.PI * radius;
  let cumulative = 0;
  return (
    <div className="donut-chart">
      <svg viewBox="0 0 140 140" className="donut-chart__svg">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#f0f2f5" strokeWidth="18" />
        {data.map((d, i) => {
          const frac = d.count / total;
          const rotation = (cumulative / total) * 360 - 90;
          cumulative += d.count;
          return (
            <circle key={i} cx="70" cy="70" r={radius} fill="none"
              stroke={d.color} strokeWidth="18"
              strokeDasharray={`${frac * circ} ${circ}`}
              transform={`rotate(${rotation}, 70, 70)`}
              strokeLinecap="round" />
          );
        })}
        <text x="70" y="66" textAnchor="middle" fill="#1a1d27" fontSize="20" fontWeight="700">{total}</text>
        <text x="70" y="82" textAnchor="middle" fill="#9ca3af" fontSize="9">ĐƠN HÀNG</text>
      </svg>
      <div className="donut-chart__legend">
        {data.map((d, i) => (
          <div key={i} className="donut-chart__legend-item">
            <span className="donut-chart__legend-dot" style={{ background: d.color }} />
            <span className="donut-chart__legend-label">{d.label}</span>
            <span className="donut-chart__legend-count">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert type="error" message="Không tải được dữ liệu dashboard"
        description={(error as Error)?.message} showIcon style={{ margin: 24 }} />
    );
  }

  const { stats, revenueByDay, orderStatusCounts, topProducts, recentOrders, featuredProducts } = data!;

  const statCards = [
    { label: "Tổng doanh thu",   value: fmtCurrency(stats.totalRevenue),          sub: `${fmtPercent(stats.revenueGrowthPercent)} so tháng trước`, icon: "💰", color: "emerald", trend: stats.revenueGrowthPercent },
    { label: "Đơn hàng hôm nay", value: stats.todayOrders.toString(),              sub: `${stats.pendingOrders} đơn đang xử lý`,                   icon: "🛒", color: "cyan",    trend: stats.orderGrowthPercent    },
    { label: "Sản phẩm",         value: stats.totalProducts.toLocaleString(),      sub: `${stats.lowStockProducts} sắp hết hàng`,                  icon: "📦", color: "amber",   trend: 0                           },
    { label: "Khách hàng mới",   value: stats.newCustomersThisWeek.toString(),     sub: "Tuần này",                                                 icon: "👥", color: "violet",  trend: stats.customerGrowthPercent },
  ];

  const orderColumns: ColumnsType<RecentOrderDTO> = [
    {
      title: "Đơn hàng",
      render: (_: unknown, r) => (
        <div className="order-cell">
          <span className="order-cell__num">{r.orderNumber}</span>
          <span className="order-cell__name">{r.customerName}</span>
        </div>
      ),
    },
    { title: "Tổng tiền", dataIndex: "total", render: (v: number) => <span className="amount-cell">{fmtCurrency(v)}</span>, sorter: (a, b) => a.total - b.total },
    { title: "Trạng thái", dataIndex: "status", render: (v: OrderStatus) => { const c = STATUS_CONFIG[v]; return <Tag className={`status-tag status-tag--${c.color}`}>{c.label}</Tag>; } },
    { title: "Thanh toán", dataIndex: "paymentStatus", render: (v: string) => { const c = PAY_STATUS_CONFIG[v as keyof typeof PAY_STATUS_CONFIG]; return <Tag className={`status-tag status-tag--${c?.color ?? "default"}`}>{c?.label ?? v}</Tag>; } },
    { title: "Ngày tạo", dataIndex: "createdAt", render: (v: string) => new Date(v).toLocaleDateString("vi-VN") },
  ];

  const productColumns: ColumnsType<FeaturedProductDTO> = [
    {
      title: "Sản phẩm",
      render: (_: unknown, r) => (
        <div className="product-cell">
          <span className="product-cell__img">
            {r.mainImage
              ? <img src={r.mainImage} alt={r.name} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              : <span className="product-cell__img-fallback">📦</span>
            }
          </span>
          <div>
            <div className="product-cell__name">{r.name}</div>
            <div className="product-cell__sku">{r.sku}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Giá",
      render: (_: unknown, r) => r.salePrice
        ? <><span className="price-sale">{fmtCurrency(r.salePrice)}</span><span className="price-original">{fmtCurrency(r.price)}</span></>
        : <span className="price-sale">{fmtCurrency(r.price)}</span>,
    },
    {
      title: "Kho", dataIndex: "stockQuantity",
      render: (v: number) => (
        <div className="stock-cell">
          <span className={`stock-cell__num${v === 0 ? " stock-cell__num--empty" : v < 10 ? " stock-cell__num--low" : ""}`}>{v}</span>
          <Progress percent={Math.min((v / 50) * 100, 100)} showInfo={false} size="small"
            strokeColor={v === 0 ? "#ef4444" : v < 10 ? "#f59e0b" : "#10b981"} />
        </div>
      ),
    },
    { title: "Đã bán", dataIndex: "soldCount", render: (v: number) => <span className="sold-count">{v.toLocaleString()}</span>, sorter: (a, b) => a.soldCount - b.soldCount, defaultSortOrder: "descend" },
    { title: "Trạng thái", dataIndex: "status", render: (v: ProductStatus) => { const c = PRODUCT_STATUS_CONFIG[v]; return <Tag className={`status-tag status-tag--${c.color}`}>{c.label}</Tag>; } },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Dashboard</h1>
          <p className="dashboard__subtitle">Tổng quan hoạt động kinh doanh</p>
        </div>
        <div className="dashboard__date">
          {new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      <div className="stat-grid">
        {statCards.map((card, i) => (
          <div key={i} className={`stat-card stat-card--${card.color}`} style={{ animationDelay: `${i * 80}ms` }}>
            <div className="stat-card__icon">{card.icon}</div>
            <div className="stat-card__body">
              <div className="stat-card__label">{card.label}</div>
              <div className="stat-card__value">{card.value}</div>
              <div className={`stat-card__trend ${card.trend >= 0 ? "stat-card__trend--up" : "stat-card__trend--down"}`}>
                {card.trend !== 0 && <span>{card.trend > 0 ? "↑" : "↓"} {Math.abs(card.trend).toFixed(1)}%</span>}
                <span className="stat-card__sub">{card.sub}</span>
              </div>
            </div>
            <div className="stat-card__glow" />
          </div>
        ))}
      </div>

      <div className="charts-row">
        <div className="glass-card charts-row__revenue">
          <div className="glass-card__header"><h3>Doanh thu 7 ngày</h3></div>
          <MiniBarChart data={revenueByDay} />
        </div>
        <div className="glass-card charts-row__donut">
          <div className="glass-card__header"><h3>Trạng thái đơn hàng</h3></div>
          <DonutChart data={orderStatusCounts} />
        </div>
        <div className="glass-card charts-row__top">
          <div className="glass-card__header"><h3>Top bán chạy</h3></div>
          <div className="top-products">
            {topProducts.map((p, i) => (
              <div key={p.id} className="top-products__item">
                <span className={`top-products__rank top-products__rank--${i + 1}`}>#{i + 1}</span>
                <span className="top-products__img">
                  {p.mainImage
                    ? <img src={p.mainImage} alt={p.name} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    : "📦"
                  }
                </span>
                <div className="top-products__info">
                  <div className="top-products__name">{p.name.length > 22 ? p.name.slice(0, 22) + "…" : p.name}</div>
                  <div className="top-products__brand">{p.brand}</div>
                </div>
                <div className="top-products__sold">{p.soldCount.toLocaleString()} đã bán</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: 20 }}>
        <div className="glass-card__header">
          <h3>Đơn hàng gần đây</h3>
          <a className="glass-card__link" href="/admin/orders">Xem tất cả →</a>
        </div>
        <Table dataSource={recentOrders} columns={orderColumns} rowKey="id" pagination={false} size="small" className="dark-table" />
      </div>

      <div className="glass-card">
        <div className="glass-card__header">
          <h3>Sản phẩm nổi bật</h3>
          <a className="glass-card__link" href="/admin/products">Xem tất cả →</a>
        </div>
        <Table dataSource={featuredProducts} columns={productColumns} rowKey="id" pagination={false} size="small" className="dark-table" />
      </div>
    </div>
  );
};

export default Dashboard;