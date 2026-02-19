export interface UserDto {
    firstName: string;
    lastName: string;
    username: string;
    middleName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    houseNumber: string;
    streetAddress: string;
    nearestBustop: string;
    cityId: string;
    organizationId: number;
    roles: string[];
}
export interface UpdateUserDto {
    firstName: string;
    lastName: string;
    username: string;
    middleName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    houseNumber: string;
    streetAddress: string;
    nearestBusStop: string;
    cityId: string;
    organizationId: number;
}
