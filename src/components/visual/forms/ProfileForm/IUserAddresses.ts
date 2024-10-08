export interface IUserAddress {
  country: string;
  city: string;
  street: string;
  postalCode: string;
  isBilling: boolean;
  isShipping: boolean;
  isDefaultBilling: boolean;
  isDefaultShipping: boolean;
  id: string;
  version: number;
}

export interface IUserAddresses {
  addresses: IUserAddress[];
  updateAddresses: (updatedAddresses: IUserAddress[]) => void;
  fetchUserData: () => void;
}
