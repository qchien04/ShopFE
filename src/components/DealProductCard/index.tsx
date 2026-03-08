import { Tag } from "antd"
import type { Product } from "../../types/product.type"
import { useNavigate } from "react-router-dom"
import "./DealProduct.scss"

interface Props{
  product:Product,
}

const DealProduct=({product}:Props)=>{
  const nav= useNavigate()
  return <>
    <div key={product.id} className="deal-product-card" onClick={()=>nav(`/products/${product.id}`)}>
      <div className="deal-image">
        <img src={product.mainImage} alt={product.name} />
        {product.price > 0 && (
          <Tag className="deal-discount-tag" color="red">
            -{Math.round(
              ((product.price - product.salePrice) * 100) / product.price
            )}%
          </Tag>
        )}
      </div>
      <div className="deal-info">
        <h4 className="deal-name">{product.name}</h4>
        <div className="deal-pricing">
          <span className="deal-price">
            {product.salePrice.toLocaleString('vi-VN')}₫
          </span>
          <span className="deal-original-price">
            {product.price.toLocaleString('vi-VN')}₫
          </span>
        </div>
      </div>
    </div>
  </>
}

export default DealProduct;