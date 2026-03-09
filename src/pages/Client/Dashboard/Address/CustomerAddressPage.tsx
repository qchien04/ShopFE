// src/pages/CustomerAddress/CustomerAddressPage.tsx
import { Button, Row, Col } from "antd";
import { useState } from "react";
import { useCustomerAddresses, useDeleteCustomerAddress } from "../../../../hooks/CustomerAddress/useAddress";
import type { CustomerAddress } from "../../../../types/entity.type";
import AddressCard from "../../../../components/AddressCard/AddressCard";
import CustomerAddressFormModal from "../../../../components/AddressFormModal/AddressFormModal";

export default function CustomerAddressPage() {
  const { data } = useCustomerAddresses();
  const deleteMutation = useDeleteCustomerAddress();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerAddress | undefined>();

  return (
    <div style={{ padding: 24 }}>
      <Button 
        type="primary" 
        size="large"
        onClick={() => {
          setEditing(undefined);
          setOpen(true);
        }}
      >
        + Thêm địa chỉ mới
      </Button>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {data?.map(addr => (
          <Col xs={24} sm={12} lg={8} key={addr.id}>
            <AddressCard
              address={addr}
              onEdit={() => {
                setEditing(addr);
                setOpen(true);
              }}
              onDelete={() => {
                if (window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
                  deleteMutation.mutate(addr.id!);
                }
              }}
              onSetDefault={() => {
                // TODO: Implement set default address logic
              }}
            />
          </Col>
        ))}
      </Row>

      <CustomerAddressFormModal
        open={open}
        initial={editing}
        onCancel={() => {
          setOpen(false);
          setEditing(undefined);
        }}
      />
    </div>
  );
}