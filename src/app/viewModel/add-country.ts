export interface AddCountry {
    name: string;
    capital: string;
    currency: string;
    currencySymbol: string;
    phoneCode: string;
    region: string;
    native: string;
    subRegion: string,
    tld: string,
    latitude: Number,
    longitude: Number,
    emoji: string 
}

export interface AddRegion {
    name: string;
    stateCode: string;
    latitude: Number,
    longitude: Number,
    countryId: string 
}

export interface AddCity {
    name: string;
    latitude: Number,
    longitude: Number,
    regionId: string 
}
export interface AddLga {
    name: string;
    cityId: string 
}