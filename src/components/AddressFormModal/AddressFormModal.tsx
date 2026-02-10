// src/components/AddressFormModal/CustomerAddressFormModal.tsx
import { Modal, Form, Input, Button, Spin, Checkbox } from "antd";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // ⭐ QUAN TRỌNG: Import CSS
import type { CustomerAddress } from "../../types/entity.type";
import { useCreateCustomerAddress, useUpdateCustomerAddress } from "../../hooks/CustomerAddress/useAddress";
import { antdMessage } from "../../utils/antdMessage";

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
          const address = data.address;
          const province = address.province || address.state || "";
          const district = address.county || address.city_district || "";
          const ward = address.suburb || address.village || "";
          const detailAddress = data.display_name || "";
          
          onLocationSelect(lat, lng, JSON.stringify({ province, district, ward, detailAddress }));
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

// ⭐ Component để invalidate size khi map ready
function MapInvalidator() {
  const map = useMapEvents({
    load: () => {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  });
  return null;
}

export default function CustomerAddressFormModal({
  open,
  onCancel,
  initial,
}: Props) {
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

  // Load map sau khi modal mở
  useEffect(() => {
    if (open) {
      setIsMapReady(false);
      
      const timer = setTimeout(() => {
        setShouldLoadMap(true);
      }, 300); // ⭐ Tăng delay lên 300ms

      return () => clearTimeout(timer);
    } else {
      setShouldLoadMap(false);
    }
  }, [open]);

  // ⭐ Invalidate size khi modal đã mở hoàn toàn
  useEffect(() => {
    if (open && shouldLoadMap && mapRef.current) {
      const timer = setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 400);
      
      return () => clearTimeout(timer);
    }
  }, [open, shouldLoadMap]);

  // Reset form khi mở/đóng modal
  useEffect(() => {
    if (open) {
      if (initial) {
        form.setFieldsValue(initial);
        const lat = initial.lat || 10.762622;
        const lng = initial.lng || 107.683994;
        setMarkerPosition([lat, lng]);
        setMapCenter([lat, lng]);
      } else {
        form.resetFields();
        form.setFieldsValue({ isDefault: false });
        setMarkerPosition([10.762622, 107.683994]);
        setMapCenter([10.762622, 107.683994]);
      }
    }
  }, [open, initial, form]);

  const handleLocationSelect = (lat: number, lng: number, addressData: string) => {
    setMarkerPosition([lat, lng]);
    
    try {
      const { province, district, ward, detailAddress } = JSON.parse(addressData);
      form.setFieldsValue({
        province,
        district,
        ward,
        detailAddress,
        lat,
        lng,
      });
      antdMessage.success("Đã chọn vị trí trên bản đồ");
    } catch {
      form.setFieldsValue({
        lat,
        lng,
      });
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
              province: address.province || address.state || "",
              district: address.county || address.city_district || "",
              ward: address.suburb || address.village || "",
              detailAddress: data.display_name || "",
              lat,
              lng,
            });
          } else {
            form.setFieldsValue({ lat, lng });
          }
        } catch (error) {
          console.error("Lỗi lấy địa chỉ:", error);
          form.setFieldsValue({ lat, lng });
        }

        if (mapRef.current) {
          mapRef.current.flyTo(newPosition, 15);
        }

        antdMessage.success("Đã lấy vị trí hiện tại");
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Lỗi lấy vị trí:", error);
        antdMessage.error("Không thể lấy vị trí hiện tại. Vui lòng cho phép truy cập vị trí.");
        setIsGettingLocation(false);
      }
    );
  };

  const handleSubmit = async (values: CustomerAddress) => {
    try {
      if (initial?.id) {
        await updateMutation.mutateAsync({
          ...values,
          id: initial.id,
        });
        antdMessage.success("Cập nhật địa chỉ thành công");
      } else {
        await createMutation.mutateAsync(values);
        antdMessage.success("Thêm địa chỉ thành công");
      }
      
      form.resetFields();
      onCancel();
    } catch (error: any) {
      antdMessage.error(error?.message || "Có lỗi xảy ra");
    }
  };

  const handleCancel = () => {
    form.resetFields();
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
        // ⭐ Invalidate size sau khi modal animation hoàn tất
        if (visible && mapRef.current) {
          setTimeout(() => {
            mapRef.current?.invalidateSize();
          }, 100);
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
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
          fontSize: 13, 
          color: "#666", 
          marginBottom: 12,
          padding: 10,
          backgroundColor: "#e6f7ff",
          borderRadius: 6,
          border: "1px solid #91d5ff"
        }}>
          💡 <strong>Hướng dẫn:</strong> Click vào bản đồ để chọn vị trí chính xác, sau đó điền thông tin địa chỉ bên dưới
        </p>

        {/* Leaflet Map */}
        <div style={{ 
          height: 350, 
          borderRadius: 8, 
          overflow: "hidden", 
          marginBottom: 16,
          position: 'relative',
          backgroundColor: '#f0f0f0',
          border: '1px solid #d9d9d9'
        }}>
          {!isMapReady && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              textAlign: 'center'
            }}>
              <Spin size="large" tip="Đang tải bản đồ..." />
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
                // ⭐ Invalidate size ngay khi map ready
                setTimeout(() => {
                  mapRef.current?.invalidateSize();
                }, 200);
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
          name="province" 
          label="Tỉnh/Thành phố"
          rules={[{ required: true, message: "Vui lòng nhập tỉnh/thành phố" }]}
        >
          <Input placeholder="VD: Bà Rịa - Vũng Tàu" />
        </Form.Item>

        <Form.Item 
          name="district" 
          label="Quận/Huyện"
          rules={[{ required: true, message: "Vui lòng nhập quận/huyện" }]}
        >
          <Input placeholder="VD: Thành phố Vũng Tàu" />
        </Form.Item>

        <Form.Item 
          name="ward" 
          label="Phường/Xã"
          rules={[{ required: true, message: "Vui lòng nhập phường/xã" }]}
        >
          <Input placeholder="VD: Phường 1" />
        </Form.Item>

        <Form.Item 
          name="detailAddress" 
          label="Địa chỉ chi tiết"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ chi tiết" }]}
        >
          <Input.TextArea 
            rows={3} 
            placeholder="VD: 123 Võ Văn Kiệt, gần chợ Vũng Tàu"
          />
        </Form.Item>

        <Form.Item 
          name="isDefault" 
          valuePropName="checked"
        >
          <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
        </Form.Item>

        <Form.Item name="lat" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="lng" hidden>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}