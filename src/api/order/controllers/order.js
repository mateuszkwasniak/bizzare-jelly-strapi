// @ts-nocheck
"use strict";

const { isInt } = require("validator");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  //dostosowana akcja w kontrolerze..."samodzielna" walidacja wszystkich przekazanych przez użytkownika danych i stworzenie rekordu za posrednictwem entityService
  async create(ctx) {
    let user;

    await this.validateQuery(ctx);

    if (ctx.state.isAuthenticated && ctx.state?.user) {
      console.log("Request from the auth user");

      user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        ctx.state.user.id,
        {
          fields: ["username"],
          populate: {
            orders: {
              fields: ["id"],
            },
            shippings: {
              fields: ["id"],
            },
          },
        }
      );

      if (user) {
        const ownedShippingAddress = user.shippings.find(
          (address) => address.id === ctx.request?.body?.data?.shipping?.id
        );

        if (!ownedShippingAddress) {
          return ctx.badRequest("Shipping address does not belong to the user");
        }
      }
    } else if (ctx.state.isAuthenticated) {
      console.log("Request from the NextJS Server");

      try {
        await strapi
          .service("api::shipping.shipping")
          .checkIfShippingIdExists(ctx.request?.body?.data?.shipping?.id);
      } catch (error) {
        return ctx.badRequest("Invalid shipping id");
      }
    }

    let totalSum;

    try {
      await strapi
        .service("api::payment-option.payment-option")
        .validatePaymentMethod(ctx.request?.body?.data?.payment);

      totalSum = await strapi
        .service("api::order.order")
        .calculateTotalOrderSum(
          ctx.request?.body?.data?.ordered,
          ctx.request?.body?.data?.delivery
        );
    } catch (error) {
      console.log(error);
      return ctx.badRequest(
        "Invalid products, delivery method or payment method!"
      );
    }

    const { ordered, shipping, delivery, payment, email } =
      ctx.request.body.data;

    const result = await strapi.entityService.create("api::order.order", {
      data: {
        shipping: {
          id: shipping.id,
        },
        ordered,
        delivery,
        payment,
        email,
        total: totalSum,
        status: "awaiting",
        ordered_by: ctx.state?.user?.id
          ? {
              id: ctx.state.user.id,
            }
          : ctx.request.body.data?.orderedBy
          ? {
              id: ctx.request.body.data.orderedBy,
            }
          : null,
      },
      populate: {
        ordered: {
          fields: ["count"],
          populate: {
            product: {
              fields: ["id", "name", "price", "category"],
              populate: {
                pictures: {
                  fields: ["url"],
                },
              },
            },
          },
        },
      },
    });

    if (user) {
      const ids = user.orders.map((order) => order?.id);

      await strapi.entityService.update(
        "plugin::users-permissions.user",
        ctx.state.user.id,
        {
          data: {
            orders: [...ids, result.id],
          },
        }
      );
    }

    return ctx.send(result, 200);
  },

  me: async (ctx) => {
    const user = ctx.state.user;

    if (!ctx.state.isAuthenticated || !user) {
      return ctx.badRequest("No authorization header was found");
    }

    const res = await strapi.entityService.findPage("api::order.order", {
      filters: {
        ordered_by: {
          id: ctx.state.user.id,
        },
      },
      populate: ["ordered"],
      page: ctx.request.query.pagination.page,
      pageSize: ctx.request.query.pagination.pageSize,
      fields: "*",
      sort: {
        createdAt: "desc",
      },
    });

    ctx.send({
      data: res.results,
      meta: res.pagination,
    });
  },

  meSingle: async (ctx) => {
    const user = ctx.state.user;

    if (!ctx.state.isAuthenticated || !user) {
      return ctx.badRequest("No authorization header was found");
    }

    const orderId = ctx?.request?.params?.id + "";

    if (!isInt(orderId)) {
      return ctx.badRequest("Invalid param");
    }

    const data = await strapi.entityService.findMany("api::order.order", {
      populate: ["ordered", "shipping"],
      fields: "*",
      filters: {
        $and: [
          {
            ordered_by: {
              id: ctx.state.user.id,
            },
          },
          {
            id: orderId,
          },
        ],
      },
    });

    ctx.send(data[0]);
  },
}));
