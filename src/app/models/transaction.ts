import { Bills } from "./bills"
import { Hospital } from "./hospital";

export interface Transaction {
  id: number;
  billId: number;
  transactionReference: string;
  amountPaid: number;
  amountReceivable: number;
  cardNumber: string;
  phoneNumber: string;
  status: string;
  narration: string;
  patientName: string;
  dateCreated: string;
  hospital: Hospital;
}

export interface PaymentResult
{
  invoiceUrl: string;
  paymentReceiptUrl: string;
  bill: Bills;
  transactions: Transaction
}
export interface DashboardDto
{
  paidAmount:number;
  totalPaid: number;
  totalPatient: number;
  totalUnpaid: number
}
