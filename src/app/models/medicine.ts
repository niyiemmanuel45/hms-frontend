import { Category } from "./category";
import { Hospital } from "./hospital";

export interface Medicine {
  id: number;
  name: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
  genericName: string;
  companyName: string;
  milligram: string;
  expireDate: string;
  hospital: Hospital;
  category: Category;
  dateCreated: string;
}

export interface MedicineDto {
  name: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
  genericName: string;
  companyName: string;
  milligram: string;
  expireDate: string;
  categoryId: number;
}
