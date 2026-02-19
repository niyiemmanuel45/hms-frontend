import { City, Lga } from "./city";
import { Country } from 'src/app/models/country';
import { Region } from "./region";
import { Hospital } from './hospital';
import { Department } from "./department";

export interface Staff {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber: string;
  gender: string;
  picturePath: string;
  isAccountActivated: boolean;
  houseNumber: string;
  streetAddress: string;
  nearestBusStop: string;
  role: string;
  age: number;
  dob: string;
  isActive: boolean;
  city: City;
  country: Country;
  state: Region;
  department: Department;
  hospital: Hospital;
}
export interface AddStaffDto {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber: string;
  gender: string;
  picture: File;
  houseNumber: string;
  streetAddress: string;
  nearestBusStop: string;
  dob: string;
  cityId: string;
  stateId: string;
  hospitalId: number;
  departmentId: number;
  staffType: number;
}

export class UpdateStaffDto {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber: string;
  gender: string;
  houseNumber: string;
  streetAddress: string;
  nearestBusStop: string;
  dob: string;
  cityId: string;
  stateId: string;
  hospitalId: number;
  departmentId: number;
}

export interface AddPatientDto {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  username: string;
  phoneNumber: string;
  gender: string;
  houseNumber: string;
  streetAddress: string;
  nearestBustop: string;
  dob: string;
  occupation: string;
  cityId: string;
  regionId: string;
  hospitalId: number;
  bloodGroupId: number;
}
export interface UpdatePatientDto {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  username: string;
  phoneNumber: string;
  gender: string;
  houseNumber: string;
  streetAddress: string;
  nearestBusStop: string;
  dob: string;
  occupation: string;
  cityId: string;
  regionId: string;
  hospitalId: number;
  bloodGroupId: number;
}
