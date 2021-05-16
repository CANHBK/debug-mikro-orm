import { PermissionGroupCode, PermissionModuleCode } from ".";

export enum PermissionCode {
  ROOT,
  MANAGE_VEHICLE_ASSIGNMENT,
  VIEW_VEHICLE_DETAIL_SPEC,
  CREATE_VEHICLE,
  EDIT_VEHICLE,
}

export interface Permission {
  code: PermissionCode;
  name: string;
  description?: string;
  moduleCode: PermissionModuleCode;
  groupCode?: PermissionGroupCode;
}

export const permissions: Permission[] = [
  {
    code: PermissionCode.MANAGE_VEHICLE_ASSIGNMENT,
    moduleCode: PermissionModuleCode.VEHICLE,
    name: "Điều phối phương tiện",
    description: "Chỉ định hoặc bỏ chỉ định tài xế cho phương tiện trong dự án",
  },
  {
    code: PermissionCode.CREATE_VEHICLE,
    moduleCode: PermissionModuleCode.VEHICLE,
    name: "Thêm",
    description: "Khi được bật, người dùng sẽ có thể tạo Phương tiện mới",
  },
  {
    code: PermissionCode.EDIT_VEHICLE,
    moduleCode: PermissionModuleCode.VEHICLE,
    name: "Sửa",
    description:
      "Khi được bật, người dùng có thể chỉnh sửa thông tin chi tiết về Xe như thông tin nhận dạng và phân loại. * Các thông số kỹ thuật của xe, thông tin tài chính ...",
  },
  {
    code: PermissionCode.VIEW_VEHICLE_DETAIL_SPEC,
    moduleCode: PermissionModuleCode.VEHICLE,
    name: "Xem thông tin chi tiết của phương tiện",
    groupCode: PermissionGroupCode.READ,
    description:
      "Thông số kỹ thuật xe, Động cơ & hộp số, Bánh xe & Lốp, nhiên liệu, ...",
  },
];
