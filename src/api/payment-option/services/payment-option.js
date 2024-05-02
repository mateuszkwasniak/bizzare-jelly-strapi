"use strict";

/**
 * payment-option service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::payment-option.payment-option",
  ({ strapi }) => ({
    //serwis sprawdza poprawnosc pól ordered (odwolujac sie do serwisu w api::product.product) +

    async validatePaymentMethod(paymentMethod) {
      if (!paymentMethod) throw new Error("No payment method provided");

      const allPaymentMethods = await strapi.entityService.findOne(
        "api::payment-option.payment-option",
        1,
        {
          populate: {
            option: {
              fields: ["name"],
            },
          },
        }
      );

      if (
        !allPaymentMethods.option.find(
          (option) => option.name === paymentMethod
        )
      ) {
        throw new Error("Invalid payment method!");
      }
    },
  })
);
