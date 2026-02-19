import { City, Lga } from "./city";
import { Country } from "./country";
import { Region } from "./region";

export interface Hospital {
  id: number;
  code: string;
  name: string;
  slogan: string;
  address: string;
  licenseNumber: string;
  phoneNumber: string;
  emailAddress: string;
  contactName: string;
  websiteURL: string;
  redirectUrl: string;
  logoURL: string;
  letter_head_invoice: boolean;
  letter_head_receipt: boolean;
  signature: boolean;
  signature_url: string;
  director_health_signature_url: string;
  chief_health_officer_signature_url: string;
  city: City;
  country: Country;
  state: Region;
  dateCreated: string;
}

export interface AddHospitalDto {
  name: string;
  code: string;
  slogan: string;
  address: string;
  licenseNumber: string;
  phoneNumber: string;
  emailAddress: string;
  contactName: string;
  websiteURL: string;
  redirectURL: string;
  logoURL: File;
  countryId: string;
  stateId: string;
  cityId: string;
}

export class UpdateHospitalDto {
  name: string;
  code: string;
  slogan: string;
  address: string;
  licenseNumber: string;
  phoneNumber: string;
  emailAddress: string;
  contactName: string;
  websiteURL: string;
  redirectURL: string;
  countryId: string;
  stateId: string;
  cityId: string;
}

export interface BloodGroups {
  id: number;
  bloodGroup: string;
  quantity: string;
  dateCreated: string;
}

export interface BloodGroupDto {
  bloodGroup: string;
  quantity: number;
}
