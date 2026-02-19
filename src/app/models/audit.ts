export interface Audit {
  id : number;
  createdBy : string;
  action : string;
  module : string;
  createdDate : Date;
  ipAddress : string;
  customDatas : string;
  tenantId : string;
  operationPerformed : string;
}
