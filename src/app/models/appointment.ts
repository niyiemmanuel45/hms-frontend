import { Hospital } from "./hospital";
import { Doctor, Patient } from "./user";

export interface Appointment {
  id: number;
  status: string;
  date: string;
  remark: string;
  doctor: Doctor;
  patient: Patient;
  hospital: Hospital;
  dateCreated: string;
}

export interface AppointmentDto {
  date: string;
  remark: string;
  doctorId: string;
  patientId: string;
}

export class AppointmentStatusDto {
  id: number;
  status: number;
}