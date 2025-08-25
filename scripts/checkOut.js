import { cart, removeFromCart } from "../data/cart.js";
import { products } from "../data/products.js";
import { twoDecimal } from "./utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliveryOptions } from "../data/delivery.js";

console.log("hello");

const today = dayjs();

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  const deliveryOptionId = cartItem.deliveryOptions;

  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.day, "days");
  const dateString = deliveryDate.format("dddd, MMMM, D");

  cartSummaryHTML += `
  <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: ${dateString}
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          $${twoDecimal(matchingProduct.priceCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary">
            Update
          </span>
          <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
            matchingProduct.id
          }">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        ${deliveryOptionsHTML(matchingProduct, cartItem)}
      </div>
    </div>
  </div>
  `;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = "";

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.day, "days");
    const dateString = deliveryDate.format("dddd, MMMM, D");
    const priceString =
      deliveryOption.price === 0
        ? "FREE"
        : `$${twoDecimal(deliveryOption.price)} - `;

    const isChecked = deliveryOption.id === cartItem.deliveryOptions;

    html += `
        <div class="delivery-option">
          <input type="radio"
          ${isChecked ? "checked" : ""}
            class="delivery-option-input"
            name="${matchingProduct.id}"
            value="${deliveryOption.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
    `;
  });

  return html;
}

document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.remove();
  });
});


document.querySelectorAll(".delivery-option-input").forEach((radio) => {
  radio.addEventListener("change", () => {
    const productId = radio.name;
    const deliveryOptionId = radio.value;


    let selectedDeliveryOption;
    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        selectedDeliveryOption = option;
      }
    });

    const today = dayjs();
    const deliveryDate = today.add(selectedDeliveryOption.day, "days");
    const dateString = deliveryDate.format("dddd, MMMM, D");

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    const deliveryDateElement = container.querySelector(".delivery-date");
    deliveryDateElement.innerHTML = `Delivery date: ${dateString}`;

    cart.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        cartItem.deliveryOptions = deliveryOptionId;
      }
    });

    localStorage.setItem("cart", JSON.stringify(cart));
  });
});
