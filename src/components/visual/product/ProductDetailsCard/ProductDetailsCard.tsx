import React, { useEffect, useState } from 'react';
import { ProductVariant } from '@commercetools/platform-sdk';
import { IProductDetailsCardProps } from './IProductDetailsCard';
import { BaseDescription } from '../ProductDescription/BaseDescription/BaseDescription';
import { ProductColor } from '../ProductColor/ProductColor';
import { ProductMaterial } from '../ProductMaterial/ProductMaterial';
import { ProductStyle } from '../ProductStyle/ProductStyle';
import { LargeButton } from '../../buttons/LargeButton/LargeButton';
import { ProductImage } from '../ProductImage/ProductImage';
import { Price } from '../ProductPrice/Price/Price';
import { ImageGallery } from '../../slider/SliderProductPage/SliderProductPage';

export const ProductDetailsCard: React.FC<IProductDetailsCardProps> = ({
  product,
  className,
  onButtonClick,
}) => {
  const [selectedVariant, setSelectedVariant] = useState(product.masterVariant);
  const formatPercentage = (percentage: number) => Math.round(percentage).toString();
  const calculateDiscountedPrice = (mainPrice?: {
    discounted?: { value: { centAmount: number } };
  }) => {
    if (mainPrice?.discounted?.value.centAmount) {
      return mainPrice.discounted.value.centAmount / 100;
    }
    return null;
  };

  const calculateOldPrice = (mainPrice?: { value?: { centAmount: number } }) => {
    if (mainPrice?.value?.centAmount) {
      return mainPrice.value.centAmount / 100;
    }
    return null;
  };

  const calculateDiscountPercentage = (mainPrice?: {
    discounted?: { value: { centAmount: number } };
    value: { centAmount: number };
  }) => {
    if (mainPrice && mainPrice.discounted) {
      return 100 - (mainPrice.discounted.value.centAmount * 100) / mainPrice.value.centAmount;
    }
    return null;
  };

  const color =
    (selectedVariant?.attributes?.find((attr) => attr.name === 'attribute-colour-03')
      ?.value as string) || 'Unknown';
  const material =
    (selectedVariant?.attributes?.find((attr) => attr.name === 'attribute-material-02')
      ?.value as string) || 'Unknown';
  const style =
    (selectedVariant?.attributes?.find((attr) => attr.name === 'attribute-style-01')
      ?.value as string) || 'Unknown';
  const description = product.description?.['en-US'] || 'Unknown';
  const { name } = product;
  const mainPrice = selectedVariant?.prices?.[0];
  const discountedPrice = calculateDiscountedPrice(mainPrice);
  const oldPrice = calculateOldPrice(mainPrice);
  const discountPercentage = calculateDiscountPercentage(mainPrice);

  const [images, setImages] = useState(selectedVariant?.images?.map((image) => image.url) || []);

  useEffect(() => {
    setImages(selectedVariant?.images?.map((image) => image.url) || []);
  }, [selectedVariant]);

  const handleVariantClick = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setImages(variant.images?.map((image) => image.url) || []);
  };

  const variantsWithMaster = [product.masterVariant, ...product.variants];

  return (
    <div className={className}>
      <div className="product-details_title">
        <h1 className="card-header">{name['en-US']}</h1>
      </div>
      <div className="product-details-first">
        <div className="product-info">
          <BaseDescription description={description} />
          {mainPrice && (
            <Price
              price={
                discountedPrice !== null
                  ? parseFloat(discountedPrice.toFixed(2))
                  : parseFloat((mainPrice.value.centAmount / 100).toFixed(2))
              }
              currencyCode={mainPrice.value.currencyCode}
              discounted={!!discountedPrice}
              discountPercentage={
                discountPercentage !== null
                  ? parseInt(formatPercentage(discountPercentage), 10)
                  : undefined
              }
              className={discountedPrice !== null ? 'discounted-price' : 'main-price'}
              oldPrice={oldPrice !== null ? parseFloat(oldPrice.toFixed(2)) : null}
            />
          )}
          <span>Choose a variant</span>
          <div className="variant-images">
            {variantsWithMaster.map((variant, index) => (
              <div
                key={index}
                className={` ${variant === selectedVariant ? 'selected-variant' : ''}`}
                // className={`${index + 1}`}
                onClick={() => handleVariantClick(variant)}
              >
                {variant.images && variant.images.length > 0 && (
                  <ProductImage url={variant.images[0].url} alt={`Variant ${index + 1} Image`} />
                )}
              </div>
            ))}
          </div>
        </div>
        <LargeButton className="product-details-button" onClick={onButtonClick}>
          Add to cart
        </LargeButton>
      </div>

      <div className="product-details-second">
        <div className="product-slider">
          {selectedVariant?.images?.[0] && (
            <ImageGallery images={images} key={selectedVariant.id} />
          )}
        </div>
      </div>
      <div className="product-details-third">
        <ProductColor color={color} />
        <ProductMaterial material={material} />
        <ProductStyle style={style} />
      </div>
    </div>
  );
};
