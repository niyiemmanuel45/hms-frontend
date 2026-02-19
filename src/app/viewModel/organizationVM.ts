export interface OrganizationVM {
  orgName: string;
  orgCode: string;
  redirectUrl: string;
  orgUrl: string;
  status: boolean;
  address: string;
  contactPersonEmail: string;
  contactPersonName: string;
  phoneNumber: string;
  stateId: string;
  countryId: string;
}

export class EditOrganizationVM {
  orgName: string;
  orgCode: string;
  redirectUrl: string;
  orgUrl: string;
  status: boolean;
  address: string;
  contactPersonEmail: string;
  contactPersonName: string;
  phoneNumber: string;
  stateId: string;
  countryId: string;
}

export class SettingVM {
  parameter: string;
  value: string;
}

export class QuestionAuditVM {
  response: string;
  answer: string;
  questionId: string;
  categoryRatingId: string;
}

export interface InvoiceChargesVM {
  amount: number;
}
