// src/components/AddressFormModal/CustomerAddressFormModal.tsx
import { Modal, Form, Input, Button, Spin, Checkbox, Select, Divider, Alert } from "antd";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CustomerAddress } from "../../types/entity.type";
import { useCreateCustomerAddress, useUpdateCustomerAddress } from "../../hooks/CustomerAddress/useAddress";
import { antdMessage } from "../../utils/antdMessage";
import { useGHNProvinces, useGHNDistricts, useGHNWards } from "../../hooks/Order/useGHN";

// Fix icon issue with Leaflet in React
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Props {
  open: boolean;
  onCancel: () => void;
  initial?: CustomerAddress;
}

// Component xử lý click trên map
function MapClickHandler({
  onLocationSelect
}: {
  onLocationSelect: (lat: number, lng: number, address: string) => void
}) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        );
        const data = await response.json();
        if (data && data.address) {
          const detailAddress = data.display_name || "";
          onLocationSelect(lat, lng, JSON.stringify({ detailAddress }));
        } else {
          onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      } catch (error) {
        console.error("Lỗi reverse geocoding:", error);
        onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    },
  });
  return null;
}

function MapInvalidator() {
  const map = useMapEvents({
    load: () => {
      setTimeout(() => { map.invalidateSize(); }, 100);
    }
  });
  return null;
}

export default function CustomerAddressFormModal({ open, onCancel, initial }: Props) {
  const [form] = Form.useForm();
  const createMutation = useCreateCustomerAddress();
  const updateMutation = useUpdateCustomerAddress();

  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    initial?.lat || 10.762622,
    initial?.lng || 107.683994,
  ]);
  const [mapCenter, setMapCenter] = useState<[number, number]>(markerPosition);
  const [isMapReady, setIsMapReady] = useState(false);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // GHN location state
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(initial?.ghnProvinceId || null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(initial?.ghnDistrictId || null);

  const { data: provinces, isLoading: loadingProvinces } = useGHNProvinces();
  const { data: districts, isLoading: loadingDistricts } = useGHNDistricts(selectedProvinceId);
  const { data: wards, isLoading: loadingWards } = useGHNWards(selectedDistrictId);

  useEffect(() => {
    if (open) {
      setIsMapReady(false);
      const timer = setTimeout(() => { setShouldLoadMap(true); }, 300);
      return () => clearTimeout(timer);
    } else {
      setShouldLoadMap(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && shouldLoadMap && mapRef.current) {
      const timer = setTimeout(() => { mapRef.current?.invalidateSize(); }, 400);
      return () => clearTimeout(timer);
    }
  }, [open, shouldLoadMap]);

  useEffect(() => {
    if (open) {
      if (initial) {
        form.setFieldsValue({
          ...initial,
          ghnWardCode: initial.ghnWardCode ? String(initial.ghnWardCode) : undefined,
        });
        const lat = initial.lat || 10.762622;
        const lng = initial.lng || 107.683994;
        setMarkerPosition([lat, lng]);
        setMapCenter([lat, lng]);
        setSelectedProvinceId(initial.ghnProvinceId ? Number(initial.ghnProvinceId) : null);
        setSelectedDistrictId(initial.ghnDistrictId ? Number(initial.ghnDistrictId) : null);
      } else {
        form.resetFields();
        form.setFieldsValue({ isDefault: false });
        setMarkerPosition([10.762622, 107.683994]);
        setMapCenter([10.762622, 107.683994]);
        setSelectedProvinceId(null);
        setSelectedDistrictId(null);
      }
    }
  }, [open, initial, form]);

  const handleLocationSelect = (lat: number, lng: number, addressData: string) => {
    setMarkerPosition([lat, lng]);
    try {
      const { detailAddress } = JSON.parse(addressData);
      form.setFieldsValue({ detailAddress, lat, lng });
      antdMessage.success("Đã chọn vị trí trên bản đồ");
    } catch {
      form.setFieldsValue({ lat, lng });
      antdMessage.success("Đã chọn vị trí. Vui lòng điền địa chỉ chi tiết");
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      antdMessage.error("Trình duyệt không hỗ trợ Geolocation");
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const newPosition: [number, number] = [lat, lng];
        setMarkerPosition(newPosition);
        setMapCenter(newPosition);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
          );
          const data = await response.json();
          if (data && data.address) {
            const address = data.address;
            form.setFieldsValue({
              detailAddress: data.display_name || "",
              lat, lng,
            });
          } else {
            form.setFieldsValue({ lat, lng });
          }
        } catch (error) {
          console.error("Lỗi lấy địa chỉ:", error);
          form.setFieldsValue({ lat, lng });
        }
        if (mapRef.current) { mapRef.current.flyTo(newPosition, 15); }
        antdMessage.success("Đã lấy vị trí hiện tại");
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Lỗi lấy vị trí:", error);
        antdMessage.error("Không thể lấy vị trí hiện tại.");
        setIsGettingLocation(false);
      }
    );
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        ghnProvinceId: selectedProvinceId,
        ghnDistrictId: selectedDistrictId,
        ghnWardCode: values.ghnWardCode,
      };
      if (initial?.id) {
        await updateMutation.mutateAsync({ ...payload, id: initial.id });
        antdMessage.success("Cập nhật địa chỉ thành công");
      } else {
        await createMutation.mutateAsync(payload);
        antdMessage.success("Thêm địa chỉ thành công");
      }
      form.resetFields();
      setSelectedProvinceId(null);
      setSelectedDistrictId(null);
      onCancel();
    } catch (error: any) {
      antdMessage.error(error?.message || "Có lỗi xảy ra");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedProvinceId(null);
    setSelectedDistrictId(null);
    onCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      title={initial ? "Sửa địa chỉ" : "Thêm địa chỉ"}
      width={800}
      confirmLoading={createMutation.isPending || updateMutation.isPending}
      afterOpenChange={(visible) => {
        if (visible && mapRef.current) {
          setTimeout(() => { mapRef.current?.invalidateSize(); }, 100);
        }
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="fullName"
          label="Họ tên"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ (10 số)" }
          ]}
        >
          <Input placeholder="0901234567" />
        </Form.Item>

        {/* GHN Location Section */}
        <Divider orientation="left" style={{ fontSize: 13 }}>
          🚚 Địa chỉ GHN (để tính phí & tạo vận đơn)
        </Divider>

        <Alert
          type="info"
          showIcon
          message="Chọn địa chỉ theo danh sách GHN để hỗ trợ tính phí vận chuyển và tạo vận đơn tự động."
          style={{ marginBottom: 12, fontSize: 12 }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          <Form.Item label="Tỉnh/Thành (GHN)" style={{ marginBottom: 0 }}>
            <Select
              showSearch
              placeholder="Chọn tỉnh/thành"
              loading={loadingProvinces}
              value={selectedProvinceId}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={provinces?.map(p => ({
                value: p.ProvinceID,
                label: p.ProvinceName,
              }))}
              onChange={(val, option: any) => {
                setSelectedProvinceId(val);
                setSelectedDistrictId(null);
                form.setFieldsValue({
                  province: option?.label,
                  district: undefined,
                  ward: undefined,
                  ghnWardCode: undefined,
                });
              }}
            />
          </Form.Item>

          <Form.Item label="Quận/Huyện (GHN)" style={{ marginBottom: 0 }}>
            <Select
              showSearch
              placeholder="Chọn quận/huyện"
              loading={loadingDistricts}
              disabled={!selectedProvinceId}
              value={selectedDistrictId}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={districts?.map(d => ({
                value: d.DistrictID,
                label: d.DistrictName,
              }))}
              onChange={(val, option: any) => {
                setSelectedDistrictId(val);
                form.setFieldsValue({
                  district: option?.label,
                  ward: undefined,
                  ghnWardCode: undefined,
                });
              }}
            />
          </Form.Item>

          <Form.Item name="ghnWardCode" label="Phường/Xã (GHN)" style={{ marginBottom: 0 }}>
            <Select
              showSearch
              placeholder="Chọn phường/xã"
              loading={loadingWards}
              disabled={!selectedDistrictId}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={wards?.map(w => ({
                value: w.WardCode,
                label: w.WardName,
              }))}
              onChange={(_val, option: any) => {
                form.setFieldsValue({ ward: option?.label });
              }}
            />
          </Form.Item>
        </div>

        <Divider orientation="left" style={{ fontSize: 13 }}>📍 Địa chỉ chi tiết</Divider>

        <Button
          onClick={getCurrentLocation}
          loading={isGettingLocation}
          style={{ marginBottom: 16, width: "100%" }}
          type="dashed"
          size="large"
        >
          📍 Lấy vị trí hiện tại
        </Button>

        <p style={{
          fontSize: 13, color: "#666", marginBottom: 12,
          padding: 10, backgroundColor: "#e6f7ff", borderRadius: 6,
          border: "1px solid #91d5ff"
        }}>
          💡 <strong>Hướng dẫn:</strong> Click vào bản đồ để chọn vị trí chính xác
        </p>

        {/* Leaflet Map */}
        <div style={{
          height: 300, borderRadius: 8, overflow: "hidden",
          marginBottom: 16, position: 'relative',
          backgroundColor: '#f0f0f0', border: '1px solid #d9d9d9'
        }}>
          {!isMapReady && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', zIndex: 1000, textAlign: 'center'
            }}>
              <Spin fullscreen size="large" tip="Đang tải bản đồ..." />
            </div>
          )}
          {shouldLoadMap && (
            <MapContainer
              center={mapCenter}
              zoom={15}
              style={{ height: "100%", width: "100%", zIndex: 1 }}
              ref={mapRef}
              whenReady={() => {
                setIsMapReady(true);
                setTimeout(() => { mapRef.current?.invalidateSize(); }, 200);
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />
              <Marker position={markerPosition} />
              <MapClickHandler onLocationSelect={handleLocationSelect} />
              <MapInvalidator />
            </MapContainer>
          )}
        </div>

        <Form.Item
          name="detailAddress"
          label="Địa chỉ chi tiết"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ chi tiết" }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="VD: 123 Võ Văn Kiệt, Phường Cầu Ông Lãnh, Quận 1, TP.HCM"
          />
        </Form.Item>

        <Form.Item name="isDefault" valuePropName="checked">
          <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
        </Form.Item>

        <Form.Item name="lat" hidden><Input /></Form.Item>
        <Form.Item name="lng" hidden><Input /></Form.Item>
      </Form>
    </Modal>
  );
}