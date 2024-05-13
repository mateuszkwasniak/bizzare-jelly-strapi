module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("", "https://bizzare-jelly-strapi-production.up.railway.app"),

  email: {
    config: {
      provider: "sendmail",
      settings: {
        defaultFrom: "no-reply@strapi.io",
        defaultReplyTo: "no-reply@strapi.io",
      },
    },
  },
});
