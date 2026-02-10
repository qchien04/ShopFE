// src/hooks/useAddress.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerAddressApi } from "../../api/customerAddress.api";

export const useCustomerAddresses = () =>
  useQuery({
    queryKey: ["addresses"],
    queryFn: () => customerAddressApi.getAll(),
  });

export const useCreateCustomerAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: customerAddressApi.createAddress,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
};

export const useUpdateCustomerAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: any) =>
      customerAddressApi.updateAddress(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
};

export const useDeleteCustomerAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: customerAddressApi.deleteAddress,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
};
