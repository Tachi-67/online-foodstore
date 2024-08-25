import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Input from "./Input";
import Button from "./Button";

const stripeLoadedPromise = loadStripe("pk_test_51Prn3NRqIjP3g1ytAdmKDtAKY3pE3WluWrxmCmBIHzPzfXmQLxAVah2uwuhkVNh2bhzXbdyQHiPSKPpL5IsxPrdr00KPp8O3bT");

const oldPriceId2NewPriceId = {
  'price_1HuavSGuhXEITAut56IgndJf': 'price_1PrnPhRqIjP3g1ytkiAPtjRp', //cheese
  'price_1HxVriGuhXEITAutt5KUKo2V': 'price_1PrnWTRqIjP3g1yt4fUg6raU', //milk
  'price_1HxW4YGuhXEITAutgcWugXH7': 'price_1PrnWrRqIjP3g1ytdMUAlLLh', //tomato
  'price_1HxW59GuhXEITAutCwoYZoOJ': 'price_1PrnXERqIjP3g1ytpSq07ifm', //pineapple
}

export default function Cart({ cart }) {

  console.log(cart);

  const totalPrice = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const [email, setEmail] = useState("");

  function handleFormSubmit(event) {
    event.preventDefault();

    const lineItems = cart.map((product) => {
      return { price: oldPriceId2NewPriceId[product.price_id],
         quantity: product.quantity };
    });

    console.log(lineItems);

    stripeLoadedPromise.then((stripe) => {
      stripe
        .redirectToCheckout({
          lineItems: lineItems,
          mode: "payment",
          successUrl: "https://coolsuperm.netlify.app/",
          cancelUrl: "https://coolsuperm.netlify.app/",
          customerEmail: email,
        })
        .then((response) => {
          // this will only log if the redirect did not work
          console.log(response.error);
        })
        .catch((error) => {
          // wrong API key? you will see the error message here
          console.log(error);
        });
    });
  }

  return (
    <div className="cart-layout">
      <div>
        <h1>Your Cart</h1>
        {cart.length === 0 && (
          <p>You have not added any product to your cart yet.</p>
        )}
        {cart.length > 0 && (
          <>
            <table className="table table-cart">
              <thead>
                <tr>
                  <th width="25%" className="th-product">
                    Product
                  </th>
                  <th width="20%">Unit price</th>
                  <th width="10%">Quanity</th>
                  <th width="25%">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((product) => {
                  return (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.image}
                          width="30"
                          height="30"
                          alt=""
                        />{" "}
                        {product.name}
                      </td>
                      <td>${product.price}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <strong>${product.price * product.quantity}</strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="2"></th>
                  <th className="cart-highlight">Total</th>
                  <th className="cart-highlight">${totalPrice}</th>
                </tr>
              </tfoot>
            </table>
            <form className="pay-form" onSubmit={handleFormSubmit}>
              <p>
                Enter your email and then click on pay and your products will be
                delivered to you on the same day!
                <br />
              </p>
              <Input
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                type="email"
                required
              />
              <Button type="submit">Pay</Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
