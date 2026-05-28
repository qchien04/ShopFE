import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ghnApi, type CreateGHNShippingPayload, type GHNCalculateFeePayload } from "../../api/ghn.api"
import { antdMessage } from "../../utils/antdMessage"

export const useGHNProvinces = () =>
  useQuery({
    queryKey: ["ghn-provinces"],
    queryFn: ghnApi.getProvinces,
    staleTime: 24 * 60 * 60 * 1000, // cache 24h
  })

export const useGHNDistricts = (provinceId: number | null) =>
  useQuery({
    queryKey: ["ghn-districts", provinceId],
    queryFn: () => ghnApi.getDistricts(provinceId!),
    enabled: !!provinceId,
    staleTime: 24 * 60 * 60 * 1000,
  })

export const useGHNWards = (districtId: number | null) =>
  useQuery({
    queryKey: ["ghn-wards", districtId],
    queryFn: () => ghnApi.getWards(districtId!),
    enabled: !!districtId,
    staleTime: 24 * 60 * 60 * 1000,
  })

// Tính phí giao hàng (chung)
export const useGHNCalculateFee = () => {
  return useMutation({
    mutationFn: (payload: GHNCalculateFeePayload) => ghnApi.calculateFee(payload),
    onError: (error: any) => {
      antdMessage.error(error.message || 'Lỗi tính phí giao hàng GHN');
    }
  });
};

// Tính phí giao hàng cho order cụ thể (để tự động lấy district/ward người nhận)
export const useGHNCalculateFeeByOrder = () => {
  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: number, payload: GHNCalculateFeePayload }) => ghnApi.calculateFeeByOrder(orderId, payload),
    onError: (error: any) => {
      antdMessage.error(error.message || 'Lỗi tính phí giao hàng GHN');
    }
  });
};

export const useCreateGHNShipping = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: number; payload: CreateGHNShippingPayload }) =>
      ghnApi.createShipping(orderId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] })
      antdMessage.success(`Tạo vận đơn GHN thành công! Mã: ${data.ghnOrderCode || data.order_code}`)
    },
    onError: (error: any) => {
      antdMessage.error(error.response?.data?.message || "Không thể tạo vận đơn GHN!")
    },
  })
}

export const useGHNPrintToken = () =>
  useMutation({
    mutationFn: (orderCodes: string[]) => ghnApi.generatePrintToken(orderCodes),
    onSuccess: (data) => {
      window.open(data.printUrl, "_blank")
    },
    onError: (error: any) => {
      antdMessage.error(error.response?.data?.message || "Không thể tạo link in nhãn!")
    },
  })
