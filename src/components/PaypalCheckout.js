import React, { useEffect } from "react";

const PaypalCheckout = () => {
  useEffect(() => {
    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: "100.00" }
          }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then(details => {
          alert("Transacción completada por " + details.payer.name.given_name);
        });
      }
    }).render("#paypal-button-container");
  }, []);

  return <div id="paypal-button-container"></div>;
};

export default PaypalCheckout;
