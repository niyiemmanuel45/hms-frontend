export interface Role {
  roleId: string;
  name: string;
  assignName: string;
}
export interface AddRemoveModel
{
  roleId: string;
  userId: string;
  oldRoleId: string;
}
