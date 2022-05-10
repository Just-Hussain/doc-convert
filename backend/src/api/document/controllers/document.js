"use strict";

/**
 *  document controller
 */
const { createCoreController } = require("@strapi/strapi").factories;
const { parseMultipartData, sanitize } = require("@strapi/utils");

module.exports = createCoreController(
  "api::document.document",
  ({ strapi }) => ({
    async find(ctx) {
      // some logic here
      const { data, meta } = await super.find(ctx);
      // some more logic

      return { data, meta };
    },

    async findOne(ctx) {
      // some logic here
      const response = await super.findOne(ctx);
      // some more logic

      return response;
    },

    async create(ctx) {
      // some logic here
      const response = await super.create(ctx);
      // some more logic

      return response;
    },

    async delete(ctx) {
      // some logic here
      const response = await super.delete(ctx);
      // some more logic

      return response;
    },
  })
);
