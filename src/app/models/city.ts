export interface City {
  id: string;
  name: string;
  regionId: string;
  regionName: string;
  latitude: number;
  longitude: number;
}

export interface Lga {
  id: number;
  name: string;
  logo_url: string;
  cityId: string;
  cityName: string;
}
