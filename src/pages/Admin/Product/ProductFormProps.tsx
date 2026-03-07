import {
  Button, Form, Input, InputNumber, Select, Card, Row, Col,
  Upload, Switch, Space
} from "antd";
import { PlusOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useCategoryList } from "../../../hooks/Category/useCategotyList";
import type { ProductFormValues } from "../../../types/request.type";
import { uploadProps } from "../../../utils/uploadProps";
import { useBrandList } from "../../../hooks/Brand/useBrand";

const { TextArea } = Input;

interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  loading?: boolean;
  submitText?: string;
  title?: string;
}

const ProductForm = ({
  initialValues,
  onSubmit,
  loading,
  submitText = "Lưu",
  title,
}: ProductFormProps) => {
  const [form] = Form.useForm<ProductFormValues>();
  const { data: categories } = useCategoryList();
  const { data: brands } = useBrandList();

  return (
    <div style={{ padding: 24 }}>
      <Card title={title}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          initialValues={{
            status: "DRAFT",
            featured: false,
            stockQuantity: 0,
            images: [],
            variants: [],
            ...initialValues,
          }}
        >
          {/* ===== Thông tin cơ bản ===== */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
              >
                <Input placeholder="VD: Arduino Uno R3" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sku"
                label="Mã SKU"
                rules={[{ required: true, message: "Vui lòng nhập SKU" }]}
              >
                <Input placeholder="VD: ARD-UNO-R3" />
              </Form.Item>
            </Col>
          </Row>

          {/* ===== Danh mục & Thương hiệu ===== */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="Danh mục"
                rules={[{ required: true, message: "Chọn danh mục" }]}
              >
                <Select
                  showSearch
                  placeholder="Chọn danh mục"
                  options={(categories ?? []).map((cat) => ({
                    label: cat.name,
                    value: cat.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="brandId"
                label="Thương hiệu"
                rules={[{ required: true, message: "Chọn thương hiệu" }]}
              >
                <Select
                  showSearch
                  placeholder="Chọn thương hiệu"
                  options={(brands ?? []).map((brand) => ({
                    label: brand.name,
                    value: brand.id,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* ===== Giá & Tồn kho ===== */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Giá gốc (₫)"
                rules={[{ required: true, message: "Nhập giá" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="salePrice" label="Giá khuyến mãi (₫)">
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="stockQuantity"
                label="Số lượng tồn kho"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          {/* ===== Trạng thái & Nổi bật ===== */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái">
                <Select
                  options={[
                    { label: "Nháp", value: "DRAFT" },
                    { label: "Đã xuất bản", value: "PUBLISHED" },
                    { label: "Hết hàng", value: "OUT_OF_STOCK" },
                    { label: "Ngừng kinh doanh", value: "DISCONTINUED" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="featured" label="Sản phẩm nổi bật" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          {/* ===== Hình ảnh ===== */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="mainImage"
                label="Ảnh chính"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[{ required: true, message: "Upload ảnh chính" }]}
              >
                <Upload listType="picture-card" maxCount={1} {...uploadProps(form, "mainPicture")}>
                  <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="images"
                label="Ảnh phụ"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              >
                <Upload listType="picture-card" multiple {...uploadProps(form, "images")}>
                  <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          {/* ===== Mô tả ===== */}
          <Form.Item
            name="shortDescription"
            label="Mô tả ngắn"
            rules={[{ required: true }]}
          >
            <TextArea rows={3} placeholder="Mô tả ngắn gọn về sản phẩm..." />
          </Form.Item>

          <Form.Item name="fullDescription" label="Mô tả chi tiết">
            <TextArea rows={6} placeholder="Mô tả đầy đủ về sản phẩm..." />
          </Form.Item>

          {/* ===== Variants ===== */}
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>
            Variants sản phẩm
          </div>

          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <Card
                    key={key}
                    size="small"
                    style={{ marginBottom: 12, border: "1px solid #d9d9d9", borderRadius: 8 }}
                    title={<span style={{ fontWeight: 600 }}>Variant #{name + 1}</span>}
                    extra={
                      <Button
                        danger size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      >
                        Xóa
                      </Button>
                    }
                  >
                    {/* Tên + SKU */}
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name={[name, "name"]}
                          label="Tên variant"
                          rules={[{ required: true, message: "Nhập tên variant" }]}
                        >
                          <Input placeholder="VD: Đỏ - XL" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={[name, "sku"]}
                          label="SKU"
                          rules={[{ required: true, message: "Nhập SKU" }]}
                        >
                          <Input placeholder="VD: SP001-RED-XL" />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Giá + Giá KM + Tồn kho */}
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          name={[name, "price"]}
                          label="Giá (₫)"
                          rules={[{ required: true, message: "Nhập giá" }]}
                        >
                          <InputNumber
                            min={0} style={{ width: "100%" }}
                            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name={[name, "salePrice"]} label="Giá KM (₫)">
                          <InputNumber
                            min={0} style={{ width: "100%" }}
                            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name={[name, "stockQuantity"]}
                          label="Tồn kho"
                          rules={[{ required: true }]}
                        >
                          <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Ảnh variant */}
                    <Form.Item
                      name={[name, "mainImage"]}
                      label="Ảnh variant"
                      valuePropName="fileList"
                      getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    >
                      <Upload
                        listType="picture-card"
                        maxCount={1}
                        {...uploadProps(form, `variant_${name}`)}
                      >
                        <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>
                      </Upload>
                    </Form.Item>

                    {/* Attributes (key-value) */}
                    <Form.List name={[name, "attributes"]}>
                      {(attrFields, { add: addAttr, remove: removeAttr }) => (
                        <>
                          <div style={{ fontWeight: 500, marginBottom: 8 }}>
                            Attributes
                            <Button
                              type="dashed" size="small"
                              icon={<PlusCircleOutlined />}
                              onClick={() => addAttr()}
                              style={{ marginLeft: 8 }}
                            >
                              Thêm
                            </Button>
                          </div>
                          {attrFields.map(({ key: ak, name: an }) => (
                            <Row key={ak} gutter={8} style={{ marginBottom: 8 }}>
                              <Col span={10}>
                                <Form.Item
                                  name={[an, "key"]}
                                  rules={[{ required: true, message: "Nhập key" }]}
                                  noStyle
                                >
                                  <Input placeholder="VD: màu sắc" />
                                </Form.Item>
                              </Col>
                              <Col span={10}>
                                <Form.Item
                                  name={[an, "value"]}
                                  rules={[{ required: true, message: "Nhập value" }]}
                                  noStyle
                                >
                                  <Input placeholder="VD: đỏ" />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Button
                                  danger size="small"
                                  icon={<DeleteOutlined />}
                                  onClick={() => removeAttr(an)}
                                />
                              </Col>
                            </Row>
                          ))}
                        </>
                      )}
                    </Form.List>
                  </Card>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add({ stockQuantity: 0, attributes: [] })}
                  block
                  icon={<PlusOutlined />}
                  style={{ marginBottom: 16 }}
                >
                  Thêm variant
                </Button>
              </>
            )}
          </Form.List>

          {/* ===== Submit ===== */}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} size="large">
                {submitText}
              </Button>
              <Button size="large" onClick={() => form.resetFields()}>
                Làm mới
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProductForm;