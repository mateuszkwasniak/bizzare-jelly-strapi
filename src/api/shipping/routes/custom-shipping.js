module.exports = {
  routes: [
    {
      method: "POST",
      path: "/shippings/me",
      handler: "shipping.createMe",
      config: {
        policies: [],
      },
    },
    {
      method: "PUT",
      path: "/shippings/me/:id",
      handler: "shipping.updateMe",
      config: {
        policies: [],
      },
    },
    {
      method: "PUT",
      path: "/shippings/detach/:id",
      handler: "shipping.detachMe",
      config: {
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/shippings/me/:id",
      handler: "shipping.deleteMe",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/shipping/me",
      handler: "shipping.me",
      config: {
        policies: [],
      },
    },
  ],
};
