import { Hospital } from "./hospital";

export interface OrganizationSetting {
    id: number;
    parameter: string;
    value: string;
    orgId: string;
    hospital: Hospital;
}
export interface Setting {
    id: number;
    parameter: string;
    value: string;
}
