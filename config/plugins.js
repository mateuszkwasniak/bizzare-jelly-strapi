module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("", "http://localhost:1337"),
  email: {
    config: {
      provider: "sendmail",
      settings: {
        defaultFrom: "no-reply@strapi.io",
        defaultReplyTo: "no-reply@strapi.io",
      },
    },
  },
  // "users-permissions": {
  //   config: {
  //     jwt: {
  //       expiresIn: 15,
  //     },
  //   },
  // },
});
