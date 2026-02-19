import { City } from "./city";

export interface Region {
  id: string;
  name: string;
  stateCode: string;
  latitude: number;
  longitude: number;
  countryId: string;
  countryName: string;
  cityId: string;
  cities?: City[];
}
