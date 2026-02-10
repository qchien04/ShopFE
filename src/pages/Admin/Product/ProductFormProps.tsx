import {
  Button, Form, Input, InputNumber, Select, Card, Row, Col,
  Upload, Switch, Space
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
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
            specifications: [],
            ...initialValues,
          }}
        >
          {/* ==== (GIỮ NGUYÊN TOÀN BỘ FORM CỦA BẠN) ==== */}
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
                  options={(categories?categories:[]).map((cat) => ({
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
                  options={brands?.map((brand) => ({
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
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  {...uploadProps(form, "mainPicture")}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
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
                <Upload
                  listType="picture-card"
                  multiple
                  {...uploadProps(form, "images")}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
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

          {/* ===== Thông số kỹ thuật ===== */}
          <Form.List name="specifications">
            {(fields, { add, remove }) => (
              <>
                <Form.Item label="Thông số kỹ thuật">
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm thông số
                  </Button>
                </Form.Item>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={16}>
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, "specName"]}
                        rules={[{ required: true, message: "Nhập tên thông số" }]}
                      >
                        <Input placeholder="VD: Điện áp" />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, "specValue"]}
                        rules={[{ required: true, message: "Nhập giá trị" }]}
                      >
                        <Input placeholder="VD: 5V" />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Button danger onClick={() => remove(name)}>
                        Xóa
                      </Button>
                    </Col>
                  </Row>
                ))}
              </>
            )}
          </Form.List>
          {/* ===== Submit ===== */}
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
              >
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
