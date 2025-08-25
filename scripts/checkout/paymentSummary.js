import { cart } from "../../data/cart.js";
import { matchingItem, deliveryOptionFind } from "../utils/matchingItem.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingCharge = 0;

  let paymentSummaryHTML = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const product = matchingItem(productId);
    const deliveryOption = deliveryOptionFind(cartItem.deliveryOptionId);

    if (deliveryOption) {
      shippingCharge += deliveryOption.price;
    }

    productPriceCents += product.priceCents * cartItem.quantity;
  });

  const totalBeforeTaxCounts = productPriceCents + shippingCharge;
  const taxCents = totalBeforeTaxCounts * 0.1;
  const totalCents = totalBeforeTaxCounts + taxCents;

  let cartSize = cart.length;
  console.log(cartSize);

  paymentSummaryHTML += `
             <div class="payment-summary">
           <div class="payment-summary-title">Order Summary</div>

           <div class="payment-summary-row">
             <div>Items (${cartSize}):</div>
             <div class="payment-summary-money">$42.75</div>
           </div>

           <div class="payment-summary-row">
             <div>Shipping &amp; handling:</div>
             <div class="payment-summary-money">$${shippingCharge}</div>
           </div>

           <div class="payment-summary-row subtotal-row">
             <div>Total before tax:</div>
             <div class="payment-summary-money">$${(totalBeforeTaxCounts/100).toFixed(2)}</div>
           </div>

           <div class="payment-summary-row">
             <div>Estimated tax (10%):</div>
             <div class="payment-summary-money">$${((taxCents)/100).toFixed(2)}</div>
           </div>

           <div class="payment-summary-row total-row">
             <div>Order total:</div>
             <div class="payment-summary-money">$${(totalCents/100).toFixed(2)}</div>
           </div>

           <button class="place-order-button button-primary">
             Place your order
           </button>
         </div>
   `;

  document.querySelector(".payment-summary").innerHTML = paymentSummaryHTML;
}
