import { Department } from "./department";
import { Hospital } from "./hospital";

export interface Bed {
  id: number;
  quantity: number;
  hospital: Hospital;
  department: Department;
  dateCreated: string;
}

export interface BedDto {
  quantity: number;
  departmentId: number;
}

export interface BedAllotment {
  id: number;
  patientName: string;
  status: string;
  cardNumber: string;
  department: string;
  allotedTime: string;
  dischargedTime: string;
  hospital: Hospital;
  dateCreated: string;
}

export interface BedAllotmentDto {
  bedId: number;
  patientId: string;
  allotedTime: string;
}