"use strict";

const { isInt } = require("validator");

/**
 * shipping service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::shipping.shipping", ({ strapi }) => ({
  async checkIfShippingIdExists(shippingId) {
    if (!shippingId || !isInt(shippingId + "")) {
      throw new Error("Invalid id");
    }

    const shipping = await strapi.entityService.findOne(
      "api::shipping.shipping",
      shippingId
    );
    if (!shipping) throw new Error("No shipping with that id");
  },
}));
