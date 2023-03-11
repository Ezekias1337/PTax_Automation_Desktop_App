const paymentConfirmations = require("../../../automations/payment-confirmations/paymentConfirmations")

const paymentConfirmationsData = {
  key: 6,
  name: "Payment Confirmations",
  locations: [
    {
      key: 1,
      state: "California",
      subLocations: [
        { key: 1, name: "Los Angeles", function: paymentConfirmations },
        { key: 2, name: "Orange County", function: paymentConfirmations },
        { key: 3, name: "Riverside County", function: paymentConfirmations },
        { key: 4, name: "San Bernardino", function: paymentConfirmations },
        { key: 5, name: "San Diego", function: paymentConfirmations },
        { key: 4, name: "Ventura County", function: paymentConfirmations },
      ],
    },
    {
      key: 2,
      state: "Pennsylvania",
      subLocations: [
        { key: 1, name: "Multnomah County", function: paymentConfirmations },
      ],
    },
  ],
};

module.exports = paymentConfirmationsData;
