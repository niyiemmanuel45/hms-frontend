import { Patient } from "./user";
import { Hospital } from './hospital';

export interface Bills {
  id: number;
  description: string;
  status: string;
  amount: number;
  dateCreated: string;
  patient: Patient;
  hospital: Hospital
}

export interface BillsDto {
  description: string;
  patientId: string;
  amount: number;
}