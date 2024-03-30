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
    open_from?: string;
    open_until?: string;
}

export interface IProduct {
    id: number;
    name: string;
    description?: string;
    unit_of_measure: string;
    price: number;
    photo?: string;
    vat: number;
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
    vat: number;
}

export interface IWasteWQuantity extends IWaste {
    quantity: number;
}

export interface IInventory {
    id: number;
    sawmill: ISawmill;
    materials: IMaterialWQuantity[];
    products: IProductWQuantity[];
    wastes: IWasteWQuantity[];
    logs: IInventoryLog[];
}

export interface IInventoryLog {
    id: number;
    context: "user" | "order" | "daily_log";
    action: "add" | "reduce" | "delete";
    quantity: number;
    timestamp: string;
    user?: string;
    dailylog?: string;
    order?: string;
    product?: string;
    material?: string;
    waste?: string;
}

export interface IDailyLog {
    id: number;
    date: Date;
    sawmill: ISawmill;
    materials?: IMaterialWQuantity[];
    products?: IProductWQuantity[];
    wastes?: IWasteWQuantity[];
}

export interface IDailyLogFilterVariables {
    sawmill?: ISawmill;
}

export interface IEquipment {
    id: number;
    name: string;
    type: string;
    description?: string;
    notes?: string;
    production_year?: number;
    last_service_date?: Date;
    last_service_working_hours?: string;
    sawmill?: ISawmill;
    photo: string;
    next_service_date: Date;
}

export interface ICustomer {
    id: number;
    name: string;
    contact_number?: string;
    address?: string;
}

export interface ICustomerWTotalSpent extends ICustomer {
    total_spent: number;
}

export interface ICustomerFilterVariables {
    q?: string;
}

export interface IOrder {
    id: number;
    amount?: number;
    discount?: number;
    notes?: string;
    deadline?: string;
    ordered_at: string;
    ready_at?: string;
    dispatched_at?: string;
    canceled_at?: string;
    products: IProductWQuantity[];
    status?: "Pending" | "Ready" | "Dispatched"  | "Canceled";
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

export interface IDailyProductivity {
    date: Date;
    product_quantity: number;
    waste_quantity: number;
    material_quantity: number;
}
