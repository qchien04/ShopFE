export interface CreatePaymentLinkResponse{
  accountName: string,
  accountNumber: string,
  amount: number,
  bin: string,
  checkoutUrl: string,
  currency: string,
  description: string,
  expiredAt: null,
  orderCode: number,
  paymentLinkId: string,
  qrCode: string,
  status: string,
}