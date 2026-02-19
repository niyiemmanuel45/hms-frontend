import { Hospital } from "./hospital";

export interface Case {
  id: number;
  title: string;
  statement: string;
  cardNumber: string;
  patient: string;
  hospital: Hospital;
  dateCreated: string;
}

export interface CaseDto {
  title: string;
  statement: string;
  patientId: string;
}