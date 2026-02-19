import { Hospital } from "./hospital";
import { Doctor, Patient } from "./user";

export interface Prescription {
  id: number;
  history: string;
  patient: Patient;
  doctor: Doctor;
  hospital: Hospital;
  dosage: Dosage[];
  dateCreated: string;
}

export interface Dosage {
  frequency: string;
  days: string;
  medicine: string;
  instruction: string;
  milligram: string;
}

export interface PrescriptionDto {
  history: string;
  patientId: string;
  doctorId: string;
  dosage: DosageDto[];
}
export interface DosageDto {
  frequency: string;
  days: string;
  medicineId: number;
  instruction: string;
}