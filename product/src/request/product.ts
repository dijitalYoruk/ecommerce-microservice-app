export interface RequestCreateProduct {
   price: number, 
   title: string, 
   description: string, 
   placeholder: string, 
}

export interface RequestUpdateProduct {
   price?: number, 
   title?: string, 
   productId?: string,
   description?: string, 
   placeholder?: string, 
}