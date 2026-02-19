export interface Category {
  id: number;
  name: string;
  description: string;
  dateCreated: string;
}

export interface CategoryDto {
  name: string;
  description: string;
}