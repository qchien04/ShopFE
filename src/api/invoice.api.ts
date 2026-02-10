import type {
  CreateInvoiceRequest,
  RecordPaymentRequest,
  GetInvoicesParams
} from "../types/request.type"
import type {
  Invoice,
  Payment,
  InvoiceSummary,
  MonthlyRevenue
} from "../types/serviceRoom.type"
import { deleteDataNoBody, getData, postData } from "../app/axiosClient"
import type { ApiResponse } from "../types"

export const invoiceApi = {
  // ========== INVOICES ==========
  
  getInvoices: (params: GetInvoicesParams): Promise<Invoice> =>
    getData<Invoice>("/invoices", params),

  getAllInvoices: (): Promise<Invoice[]> =>
    getData<Invoice[]>("/invoices/all"),

  getContractInvoices: (contractId: number): Promise<Invoice[]> =>
    getData<Invoice[]>(`/invoices/contract/${contractId}`),

  getUnpaidInvoices: (): Promise<Invoice[]> =>
    getData<Invoice[]>("/invoices/unpaid"),

  getOverdueInvoices: (): Promise<Invoice[]> =>
    getData<Invoice[]>("/invoices/overdue"),

  createInvoice: (payload: CreateInvoiceRequest): Promise<Invoice> =>
    postData<Invoice>("/invoices", payload),

  getInvoiceById: (id: number): Promise<Invoice> =>
    getData<Invoice>(`/invoices/${id}`),

  deleteInvoice: (id: number): Promise<ApiResponse> =>
    deleteDataNoBody<ApiResponse>("/invoices", { id }),

  // ========== PAYMENTS ==========
  
  recordPayment: (payload: RecordPaymentRequest): Promise<Payment> =>
    postData<Payment>("/invoices/payments", payload),

  getInvoicePayments: (invoiceId: number): Promise<Payment[]> =>
    getData<Payment[]>(`/invoices/${invoiceId}/payments`),

  deletePayment: (id: number): Promise<ApiResponse> =>
    deleteDataNoBody<ApiResponse>("/invoices/payments", { id }),

  // ========== STATISTICS ==========
  
  getInvoiceSummary: (contractId?: number): Promise<InvoiceSummary> =>
    getData<InvoiceSummary>("/invoices/summary", { contractId }),

  getMonthlyRevenue: (year: number, propertyId?: number): Promise<MonthlyRevenue[]> =>
    getData<MonthlyRevenue[]>("/invoices/revenue/monthly", { year, propertyId }),

  // ========== BATCH OPERATIONS ==========
  
  generateMonthlyInvoices: (month: string): Promise<ApiResponse> =>
    postData<ApiResponse>("/invoices/generate-monthly", { month }),

  sendPaymentReminders: (invoiceIds: number[]): Promise<ApiResponse> =>
    postData<ApiResponse>("/invoices/send-reminders", { invoiceIds }),
}
