export interface RequestCreateProduct {
   price: number, 
   title: string, 
   quantity?: number,
   description: string, 
   placeholder: string, 
   isQuantityRestricted: boolean
}

export interface RequestUpdateProduct {
   price?: number, 
   title?: string, 
   quantity?: number,
   productId?: string,
   description?: string, 
   placeholder?: string, 
   isQuantityRestricted: boolean
}