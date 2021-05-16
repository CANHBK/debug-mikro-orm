import { PermissionModuleCode } from ".";

export enum PermissionGroupCode {
  ALL,
  CREATE,
  READ,
  UPDATE,
  DELETE,
}

export interface PermissionGroup {
  code: PermissionGroupCode;
  name: string;
  description?: string;
  moduleCode: PermissionModuleCode;
}

export const permissionGroups: PermissionGroup[] = [
  {
    code: PermissionGroupCode.READ,
    name: "Xem",
    moduleCode: PermissionModuleCode.VEHICLE,
  },
];
