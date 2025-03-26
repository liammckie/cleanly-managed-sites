
export interface ContractDetails {
  startDate?: string;
  endDate?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  autoRenewal?: boolean;
  renewalPeriod?: number;
  renewalNotice?: number;
  noticeUnit?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  additionalContracts?: any[];
}
