import { Region } from "./region";

export interface Country {
  id: string;
  name: string;
  capital: string;
  region: string;
  subRegion: string;
  emoji: string;
  phoneCode: string;
  currency: string;
  currencySymbol: string;
  regionId: string;
  regions?: Region[];
}
