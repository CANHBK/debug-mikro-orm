export interface PermissionModule {
  code: PermissionModuleCode;
  name: string;
  description?: string;
}
export enum PermissionModuleCode {
  ROOT,
  UNKNOWN,
  VEHICLE,
}

export const permissionModules: PermissionModule[] = [
  {
    code: PermissionModuleCode.ROOT,
    name: "Root",
  },
  {
    code: PermissionModuleCode.UNKNOWN,
    name: "Khác",
  },
  {
    code: PermissionModuleCode.VEHICLE,
    name: "Phương tiện",
    description:
      "Tập hợp các quyền và nhóm quyền thực thi liên quan tới phương tiện",
  },
];
