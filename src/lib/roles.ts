export type Role = "admin" | "operador" | "cliente";

export const ROLES: Role[] = ["admin", "operador", "cliente"];

export const ADMIN_ROLES: Role[] = ["admin"];
export const OPERATOR_ROLES: Role[] = ["operador", "admin"];
export const CLIENT_ROLES: Role[] = ["cliente"];
