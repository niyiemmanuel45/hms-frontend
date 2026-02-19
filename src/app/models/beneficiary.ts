export interface Beneficiary {
  id: number;
  lineItemsId: string;
  beneficiaryName: string;
  beneficiaryAccount: string;
  beneficiaryAmount: string;
  bankCode: string;
  deductFeeFrom: string;
  tenantId: number;
  tenantCode: string;
  dateCreated: string;
}

export interface AddBeneficiary{
lineItemsId: string;
name: string;
accountNumber: string;
bankCode: string;
amount: number;
deductFeeFrom: string;
tenantId: number;
}
