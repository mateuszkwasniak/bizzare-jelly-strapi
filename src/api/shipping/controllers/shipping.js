"use strict";

const { isInt } = require("validator");

/**
 * shipping controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::shipping.shipping",
  ({ strapi }) => ({
    async createMe(ctx) {
      let newShippingId;

      if (ctx.state.isAuthenticated && ctx.state?.user) {
        await this.validateQuery(ctx);

        const userId = ctx.state.user.id;

        const user = await strapi.entityService.findOne(
          "plugin::users-permissions.user",
          userId,
          {
            fields: ["username"],
            populate: {
              shippings: {
                fields: ["id", "main"],
              },
            },
          }
        );

        if (!user) {
          return ctx.badRequest("No user found.");
        }

        if (user?.shippings?.length < 3) {
          const ids = user.shippings.map((ship) => ship.id);
          // @ts-ignore
          const newShipping = ctx.request.body.data;

          const result = await super.create(ctx);

          newShippingId = result.data.id;

          await strapi.entityService.update(
            "plugin::users-permissions.user",
            userId,
            {
              data: {
                shippings: [...ids, newShippingId],
              },
            }
          );

          if (ids.length === 0 && !newShipping.main) {
            await strapi.entityService.update(
              "api::shipping.shipping",
              newShippingId,
              {
                data: {
                  main: true,
                },
              }
            );
          } else if (ids.length > 0 && newShipping.main) {
            const currentMainId = user?.shippings?.find(
              (shipping) => shipping.main
            )?.id;
            await strapi.entityService.update(
              "api::shipping.shipping",
              currentMainId,
              {
                data: {
                  main: false,
                },
              }
            );
          }
        } else {
          return ctx.badRequest("Limit reached.");
        }
      } else {
        return ctx.badRequest("Not authenticated.");
      }

      return ctx.send({ id: newShippingId }, 200);
    },

    //dostosowany akcja do uzytku przez klienta.
    async updateMe(ctx) {
      // @ts-ignore
      const shippingId = ctx?.request?.params?.id + "";

      if (!isInt(shippingId)) {
        return ctx.badRequest("Invalid param");
      }

      if (ctx.state.isAuthenticated && ctx.state?.user) {
        await this.validateQuery(ctx);

        const userId = ctx.state.user.id;

        const users = await strapi.entityService.findMany(
          "plugin::users-permissions.user",
          {
            filters: {
              $and: [
                {
                  id: userId,
                },
                {
                  shippings: {
                    id: shippingId,
                  },
                },
              ],
            },
            fields: ["username"],
            populate: {
              shippings: {
                fields: ["id", "main"],
              },
            },
          }
        );

        if (users?.length === 1) {
          // @ts-ignore
          const updatedShipping = ctx.request.body.data;

          if (updatedShipping?.main) {
            const previousMainShippingId = users[0].shippings.find(
              (shipping) => shipping.main
            )?.id;

            if (previousMainShippingId !== shippingId) {
              await strapi.entityService.update(
                "api::shipping.shipping",
                previousMainShippingId,
                {
                  data: {
                    main: false,
                  },
                }
              );
            }
          }

          await super.update(ctx);
        } else {
          console.log("No such user!");

          return ctx.badRequest("Invalid data.");
        }
      } else {
        console.log("Not auth!");
        return ctx.badRequest("Not authenticated.");
      }

      return ctx.send({ message: "Shipping Data updated successfuly" }, 200);
    },

    async detachMe(ctx) {
      // @ts-ignore
      const shippingId = ctx?.request?.params?.id + "";

      if (!isInt(shippingId)) {
        return ctx.badRequest("Invalid address identifier");
      }

      if (ctx.state.isAuthenticated && ctx.state?.user) {
        await this.validateQuery(ctx);

        const userId = ctx.state.user.id;

        const users = await strapi.entityService.findMany(
          "plugin::users-permissions.user",
          {
            filters: {
              $and: [
                {
                  id: userId,
                },
                {
                  shippings: {
                    id: shippingId,
                  },
                },
              ],
            },
            fields: ["username"],
            populate: {
              shippings: {
                fields: ["id", "main", "createdAt"],
              },
            },
          }
        );

        if (users?.length === 1) {
          // @ts-ignore

          const detachedShipping = users[0].shippings.find(
            (shipping) => shipping.id === Number(shippingId)
          );

          if (detachedShipping?.main && users[0].shippings.length > 1) {
            const nextMainShippingId = users[0].shippings
              .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
              .find((shipping) => !shipping.main).id;

            await strapi.entityService.update(
              "api::shipping.shipping",
              nextMainShippingId,
              {
                data: {
                  main: true,
                },
              }
            );
          }

          if (detachedShipping?.main) {
            await strapi.entityService.update(
              "api::shipping.shipping",
              shippingId,
              {
                data: {
                  main: false,
                },
              }
            );
          }

          await strapi.entityService.update(
            "plugin::users-permissions.user",
            ctx.state.user.id,
            {
              data: {
                shippings: users[0].shippings
                  .map((shipping) => shipping.id)
                  .filter((id) => id !== Number(shippingId)),
              },
            }
          );
        } else {
          console.log("No such user!");
          return ctx.badRequest("Invalid data.");
        }
      } else {
        console.log("Not auth!");
        return ctx.badRequest("Not authenticated.");
      }

      return ctx.send({ message: "Shipping detached successfuly" }, 200);
    },

    async deleteMe(ctx) {
      // @ts-ignore
      const shippingId = ctx?.request?.params?.id + "";

      if (!isInt(shippingId)) {
        return ctx.badRequest("Invalid address identifier");
      }

      if (ctx.state.isAuthenticated && ctx.state?.user) {
        await this.validateQuery(ctx);

        const userId = ctx.state.user.id;

        const users = await strapi.entityService.findMany(
          "plugin::users-permissions.user",
          {
            filters: {
              $and: [
                {
                  id: userId,
                },
                {
                  shippings: {
                    id: shippingId,
                  },
                },
              ],
            },
            fields: ["username"],
            populate: {
              shippings: {
                fields: ["id", "main", "createdAt"],
              },
            },
          }
        );

        if (users?.length === 1) {
          // @ts-ignore

          const deletedShipping = users[0].shippings.find(
            (shipping) => shipping.id === Number(shippingId)
          );

          if (deletedShipping?.main && users[0].shippings.length > 1) {
            const nextMainShippingId = users[0].shippings
              .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
              .find((shipping) => !shipping.main).id;

            await strapi.entityService.update(
              "api::shipping.shipping",
              nextMainShippingId,
              {
                data: {
                  main: true,
                },
              }
            );
          }

          await super.delete(ctx);
        } else {
          console.log("No such user!");
          return ctx.badRequest("Invalid data.");
        }
      } else {
        console.log("Not auth!");
        return ctx.badRequest("Not authenticated.");
      }

      return ctx.send({ message: "Shipping deleted successfuly" }, 200);
    },

    me: async (ctx) => {
      const user = ctx.state.user;

      if (!ctx.state.isAuthenticated || !user) {
        return ctx.badRequest([
          { messages: [{ id: "No authorization header was found" }] },
        ]);
      }

      const userId = ctx.state.user.id;

      const existingUser = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        userId,
        {
          fields: ["username"],
          populate: {
            shippings: {
              fields: "*",
            },
          },
        }
      );

      ctx.send(existingUser.shippings);
    },
  })
);
