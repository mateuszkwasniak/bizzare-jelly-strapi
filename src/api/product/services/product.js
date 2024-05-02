"use strict";

const { isInt } = require("validator");

/**
 * product service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::product.product", ({ strapi }) => ({
  validateProductFields(item) {
    const { product, count } = item;

    if (
      !product?.id ||
      !isInt(product?.id + "") ||
      !count ||
      !isInt(count + "") ||
      count <= 0
    ) {
      console.log("Invalid product!");
      throw new Error("Invalid product!");
    }
  },
}));
