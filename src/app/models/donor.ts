import { Hospital } from "./hospital";

export interface Donor {
  id: number;
  fullname: string;
  email: string;
  phoneNumber: string;
  sex: string;
  age: number;
  bloodGroup: string;
  hospital: Hospital;
  dateCreated: string;
}

export interface DonorDto {
  name: string;
  email: string;
  phoneNumber: string;
  sex: string;
  age: number;
  bloodGroupId: string;
}