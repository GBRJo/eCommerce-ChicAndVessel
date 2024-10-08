import { ProductProjection } from '@commercetools/platform-sdk';

export interface IProductCardProps {
  product: ProductProjection;
  onButtonClick: () => void;
  className?: string;
}
