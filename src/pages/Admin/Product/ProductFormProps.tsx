// ProductForm.tsx
import {
  Button, Form, Input, InputNumber, Select, Row, Col, Upload
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  ProfileOutlined,
  DollarOutlined,
  EditOutlined,
  PictureOutlined,
  AppstoreOutlined
} from "@ant-design/icons";
import { useEffect } from "react";
import { useCategoryList } from "../../../hooks/Category/useCategotyList";
import { useBrandList } from "../../../hooks/Brand/useBrand";
import { uploadProps } from "../../../utils/uploadProps";
import type { ProductFormValues } from "../../../types/request.type";

const { TextArea } = Input;


const toFormValues = (p: any): Partial<ProductFormValues> => ({
  name: p.name,
  slug: p.slug,

  categoryId: p.category?.id,
  brandId: p.brand?.id,
  price: p.price,
  salePrice: p.salePrice,
  stockQuantity: p.stockQuantity,
  shortDescription: p.shortDescription,
  fullDescription: p.fullDescription,
  mainImage: p.mainImage
    ? [{ uid: "-1", name: "main-image", status: "done", url: p.mainImage }]
    : [],
  images: (p.images ?? []).map((img: any) => ({
    uid: img.id, name: img.name ?? "image", status: "done", url: img.imageUrl,
  })),
  variants: (p.productVariants ?? []).map((v: any) => ({
    id: v.id,
    name: v.name,

    price: v.price,
    salePrice: v.salePrice,
    stockQuantity: v.stockQuantity,
    mainImage: v.mainImage
      ? [{ uid: `v-${v.id}`, name: "image", status: "done", url: v.mainImage }]
      : [],
    attributes: Object.entries(v.attributes ?? {}).map(([key, value]) => ({
      key, value: String(value),
    })),
  })),
});

const DEFAULT_VALUES = {
  stockQuantity: 0, images: [], variants: [],
};

// ─── Props ───────────────────────────────────────────────────────────────────

interface ProductFormProps {
  productDetail?: any;   // truyền khi edit
  onSubmit: (values: ProductFormValues) => void;
  loading?: boolean;
  submitText?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

const ProductForm = ({ productDetail, onSubmit, loading, submitText = "Lưu" }: ProductFormProps) => {
  const [form] = Form.useForm<ProductFormValues>();
  const { data: categories } = useCategoryList();
  const { data: brands } = useBrandList();

  //  Set values khi productDetail thay đổi
  useEffect(() => {
    if (productDetail) {
      form.setFieldsValue({ ...DEFAULT_VALUES, ...toFormValues(productDetail) });
    } else {
      form.resetFields();
      form.setFieldsValue(DEFAULT_VALUES);
    }
  }, [productDetail]);

  const moneyFormatter = (v: any) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <div className="premium-product-form">
      <Form form={form} layout="vertical" onFinish={onSubmit}>

        {/* ── Section 1: Thông tin cơ bản & Định danh ── */}
        <div className="form-section-card">
          <div className="section-header">
            <span className="section-icon"><ProfileOutlined /></span>
            <h3>Thông tin cơ bản & Định danh</h3>
          </div>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Tên sản phẩm"
                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}>
                <Input placeholder="VD: Arduino Uno R3" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="slug" label="Slug sản phẩm"
                rules={[{ required: true, message: "Vui lòng nhập Slug" }]}>
                <Input placeholder="VD: arduino-uno-r3" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="categoryId" label="Danh mục"
                rules={[{ required: true, message: "Chọn danh mục" }]}>
                <Select showSearch placeholder="Chọn danh mục"
                  options={(categories ?? []).map(c => ({ label: c.name, value: c.id }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="brandId" label="Thương hiệu"
                rules={[{ required: true, message: "Chọn thương hiệu" }]}>
                <Select showSearch placeholder="Chọn thương hiệu"
                  options={(brands ?? []).map(b => ({ label: b.name, value: b.id }))} />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* ── Section 2: Giá & Tồn kho ── */}
        <div className="form-section-card">
          <div className="section-header">
            <span className="section-icon"><DollarOutlined /></span>
            <h3>Thiết lập Giá & Tồn kho</h3>
          </div>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="price" label="Giá gốc (₫)"
                rules={[{ required: true, message: "Nhập giá" }]}>
                <InputNumber min={0} style={{ width: "100%" }} formatter={moneyFormatter} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="salePrice"
                label="Giá khuyến mãi (₫)"
                dependencies={['price']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const price = getFieldValue('price');
                      if (!value || !price || value < price) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Giá khuyến mãi phải nhỏ hơn giá gốc!'));
                    },
                  }),
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} formatter={moneyFormatter} />
              </Form.Item>
            </Col>
          </Row>
        </div>



        {/* ── Section 4: Mô tả ── */}
        <div className="form-section-card">
          <div className="section-header">
            <span className="section-icon"><EditOutlined /></span>
            <h3>Mô tả sản phẩm</h3>
          </div>
          <Form.Item name="shortDescription" label="Mô tả ngắn" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="Mô tả ngắn gọn về sản phẩm..." />
          </Form.Item>
          <Form.Item name="fullDescription" label="Mô tả chi tiết">
            <TextArea rows={6} placeholder="Mô tả đầy đủ về sản phẩm..." />
          </Form.Item>
        </div>

        {/* ── Section 5: Hình ảnh ── */}
        <div className="form-section-card">
          <div className="section-header">
            <span className="section-icon"><PictureOutlined /></span>
            <h3>Bộ sưu tập hình ảnh</h3>
          </div>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="mainImage" label="Ảnh chính"
                valuePropName="fileList"
                getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
                rules={[{ required: true, message: "Upload ảnh chính" }]}>
                <Upload listType="picture-card" maxCount={1} {...uploadProps(form, "mainPicture")}>
                  <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="images" label="Ảnh phụ"
                valuePropName="fileList"
                getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}>
                <Upload listType="picture-card" multiple {...uploadProps(form, "images")}>
                  <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* ── Section 6: Các phiên bản (Variants) ── */}
        <div className="form-section-card">
          <div className="section-header">
            <span className="section-icon"><AppstoreOutlined /></span>
            <h3>Các phiên bản sản phẩm (Variants)</h3>
          </div>

          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <div key={key} className="variant-card-container">
                    <div className="variant-header">
                      <span className="variant-title-text">Phiên bản #{name + 1}</span>
                      <Button danger size="small" icon={<DeleteOutlined />} onClick={() => remove(name)}>
                        Xóa phiên bản
                      </Button>
                    </div>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name={[name, "name"]} label="Tên variant"
                          rules={[{ required: true, message: "Nhập tên variant" }]}>
                          <Input placeholder="VD: Đỏ - XL" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>

                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item name={[name, "price"]} label="Giá (₫)"
                          rules={[{ required: true, message: "Nhập giá" }]}>
                          <InputNumber min={0} style={{ width: "100%" }} formatter={moneyFormatter} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name={[name, "salePrice"]}
                          label="Giá KM (₫)"
                          dependencies={[['variants', name, 'price']]}
                          rules={[
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                const price = getFieldValue(['variants', name, 'price']);
                                if (!value || !price || value < price) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error('Giá KM phải nhỏ hơn giá gốc!'));
                              },
                            }),
                          ]}
                        >
                          <InputNumber min={0} style={{ width: "100%" }} formatter={moneyFormatter} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name={[name, "stockQuantity"]} label="Tồn kho"
                          rules={[{ required: true }]}>
                          <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item name={[name, "mainImage"]} label="Ảnh variant"
                      valuePropName="fileList"
                      getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}>
                      <Upload listType="picture-card" maxCount={1}
                        {...uploadProps(form, `variant_${name}`)}>
                        <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>
                      </Upload>
                    </Form.Item>

                    <Form.List name={[name, "attributes"]}>
                      {(attrFields, { add: addAttr, remove: removeAttr }) => (
                        <>
                          <div style={{ fontWeight: 650, fontSize: 13, color: "#595959", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                            Thuộc tính Variant
                            <Button type="dashed" size="small" icon={<PlusCircleOutlined />}
                              onClick={() => addAttr()} style={{ borderColor: "#00c853", color: "#00c853" }}>
                              Thêm thuộc tính
                            </Button>
                          </div>
                          {attrFields.map(({ key: ak, name: an }) => (
                            <Row key={ak} gutter={8} style={{ marginBottom: 12, alignItems: "center" }}>
                              <Col span={10}>
                                <Form.Item name={[an, "key"]} noStyle
                                  rules={[{ required: true, message: "Nhập key" }]}>
                                  <Input placeholder="Tên thuộc tính (màu sắc, dung lượng,...)" />
                                </Form.Item>
                              </Col>
                              <Col span={10}>
                                <Form.Item name={[an, "value"]} noStyle
                                  rules={[{ required: true, message: "Nhập value" }]}>
                                  <Input placeholder="Giá trị thuộc tính (đỏ, 64GB,...)" />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Button danger size="small" icon={<DeleteOutlined />}
                                  onClick={() => removeAttr(an)} style={{ display: "flex", alignItems: "center", justifyContent: "center" }} />
                              </Col>
                            </Row>
                          ))}
                        </>
                      )}
                    </Form.List>
                  </div>
                ))}

                <Button type="dashed" block icon={<PlusOutlined />} className="add-variant-btn"
                  onClick={() => add({ stockQuantity: 0, attributes: [] })}>
                  Thêm phiên bản mới (Variant)
                </Button>
              </>
            )}
          </Form.List>
        </div>

        {/* ── Submit & Actions ── */}
        <div className="form-actions">
          <Button size="large" className="btn-reset"
            onClick={() => { form.resetFields(); form.setFieldsValue(DEFAULT_VALUES); }}>
            Nhập lại từ đầu
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} size="large" className="btn-submit">
            {submitText}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProductForm;