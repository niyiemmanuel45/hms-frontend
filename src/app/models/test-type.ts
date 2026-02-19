import { Hospital } from './hospital';
import { Doctor, Patient } from './user';

export interface TestType {
  id: number;
  testName: string;
  price: number;
  hospital: Hospital;
  dateCreated: string;
}

export interface TestTypeDto {
  testName: string;
  price: number;
}

export interface LabReport {
  id: number;
  report: string;
  fileUrl: string;
  labTestType: TestType;
  patient: Patient;
  doctor: Doctor;
  hospital: Hospital;
  dateCreated: string;
}

export interface LabReportDto {
  report: string;
  doctorId: string;
  patientId: string;
  testTypeId: number;
}