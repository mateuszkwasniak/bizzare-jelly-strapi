module.exports = {
  routes: [
    {
      method: "GET",
      path: "/orders/me",
      handler: "order.me",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/orders/me/:id",
      handler: "order.meSingle",
      config: {
        policies: [],
      },
    },
  ],
};
