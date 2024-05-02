"use strict";

const { isDate, isInt, isNumeric, isDataURI, isISO8601 } = require("validator");

/**
 * order service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::order.order", ({ strapi }) => ({
  //serwis sprawdza poprawnosc pól ordered (odwolujac sie do serwisu w api::product.product) +

  async calculateTotalOrderSum(products, deliveryMethod) {
    if (
      !products ||
      !Array.isArray(products) ||
      products?.length === 0 ||
      !deliveryMethod
    ) {
      throw new Error("Invalid products or delivery method provided");
    } else {
      const deliveryMethods = await strapi.entityService.findOne(
        "api::delivery.delivery",
        1,
        {
          populate: {
            method: {
              fields: ["name", "price"],
            },
          },
        }
      );

      const existingDeliveryMethod = deliveryMethods.method.find(
        (method) => method.name === deliveryMethod
      );

      if (!existingDeliveryMethod) {
        throw new Error("Incorrect delivery method name!");
      }

      const validateProductFieldsAndCalculatePrice = async (item) => {
        strapi.service("api::product.product").validateProductFields(item);

        const existingProduct = await strapi.entityService.findOne(
          "api::product.product",
          item.product.id
        );

        if (!existingProduct) {
          throw new Error("Invalid product id provided by the user!");
        } else {
          return existingProduct.price * item.count;
        }
      };

      const priceArray = await Promise.all(
        products.map((product) =>
          validateProductFieldsAndCalculatePrice(product)
        )
      );

      const productsSum = priceArray.reduce((prev, curr) => (prev += curr));

      return productsSum + existingDeliveryMethod.price;
    }
  },

  validateOrderDate(date) {
    if (!date || !isISO8601(date)) throw new Error("Invalid order date!");
  },
}));
