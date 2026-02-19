import { City } from "./city";
import { Country } from "./country";
import { BloodGroups, Hospital } from './hospital';
import { Region } from "./region";

export class User {
  userId: string;
  firstName: string;
  lastName: string;
  userName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  picturePath: string;
  isBlocked: boolean;
  isAccountActivated: boolean;
  houseNumber: string;
  streetAddress: string;
  nearestBusStop: string;
  createdOnUtc: string;
  cityID: string;
  regionID: string;
  countryID: string;
  city: City;
  region: Region;
  country: Country;
  role: string;
  roleId: string;
  occupation: string;
  cardNumber: string;
  age: number;
  dob: string;
  tenantId: string;
  hospital?: Hospital;
  bloodBank?: BloodGroups;

  constructor(data?: any) {
      if (data) {
          Object.assign(this, data);
      }
  }
}

export interface Roles {
  roleId: string;
  name: string;
  assignName: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  logoUrl: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  cardNumber: string;
  logoUrl: string;
}
