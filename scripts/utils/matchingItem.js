import { deliveryOptions } from "../../data/delivery.js";
import { products } from "../../data/products.js";

export function matchingItem(productId) {
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  return matchingProduct;
}

export function deliveryOptionFind(deliveryOptionId) {
  let deliveryOption;
    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    });

    return deliveryOption || deliveryOptions[0];
}
