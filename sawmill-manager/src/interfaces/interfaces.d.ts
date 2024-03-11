export interface IEmployee {
    id: number;
    name: string;
    email: string;
    contact_number?: string;
    birthday?: Date;
    role: IRole;
    sawmills?: ISawmill[];
    avatar?: string;
}

export interface IRole {
    id: number,
    role_name: "executive" | "manager" | "worker"
}

export interface ISawmill {
    id: number;
    name: string;
    address?: string;
    open_hours?: string;
}

export interface IProduct {
    id: number;
    name: string;
    description?: string;
    unit_of_measure: string;
    price: number;
    photo?: string;
}

export interface IProductWQuantity extends IProduct {
    quantity: number;
}

export interface IMaterial {
    id: number;
    name: string;
    description?: string;
    unit_of_measure: string;
    price?: number;
    photo?: string;
}

export interface IMaterialWQuantity extends IMaterial {
    quantity: number;
}

export interface IWaste {
    id: number;
    name: string;
    description?: string;
    unit_of_measure: string;
    price?: number;
    photo?: string;
}

export interface IWasteWQuantity extends IWaste {
    quantity: number;
}

export interface IInventory<T extends IProductWQuantity | IWasteWQuantity | IMaterialWQuantity> {
    id: number;
    sawmill: ISawmill;
    materials?: T extends IMaterialWQuantity ? T[] : never;
    products?: T extends IProductWQuantity ? T[] : never;
    wastes?: T extends IWasteWQuantity ? T[] : never;
}

export interface IEquipment {
    id: number;
    name: string;
    type: string;
    description?: string;
    notes?: string;
    production_year?: number;
    last_service_date?: string;
    last_service_working_hours?: string;
    sawmill?: ISawmill;
    photo: string;
}

export interface ICustomer {
    id: number;
    name: string;
    contact_number?: string;
    address?: string;
}

export interface ICustomerFilterVariables {
    q?: string;
}

export interface IOrder {
    id: number;
    amount?: integer;
    notes?: string;
    deadline?: string;
    ordered_at: string;
    ready_at?: string;
    dispatched_at?: string;
    products: IProductWQuantity[];
    status?: "Pending" | "Ready" | "Dispatched"  | "Cancelled";
    customer: ICustomer;
    sawmill: ISawmill;
}

export interface IOrderFilterVariables {
    status?: string[];
    customer?: ICustomer;
    sawmill?: ISawmill;
}

export interface IInventoryFilterVariables {
    sawmill?: ISawmill;
}

export interface IIdentity {
    id: number;
    name: string;
    email: string;
    contact_number?: string;
    birthday?: string;
    role: string;
    sawmills: ISawmill[];
}
