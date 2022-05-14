"use strict";

/**
 *  document controller
 */
const { createCoreController } = require("@strapi/strapi").factories;
const { parseMultipartData, sanitize } = require("@strapi/utils");
const fs = require("fs");
const FileReader = require("filereader");

const {
  pipe,
  gotenberg,
  convert,
  office,
  to,
  landscape,
  portrait,
  set,
  filename,
  please,
} = require("gotenberg-js-client");

const toPDF = pipe(
  gotenberg(process.env.CONVERTER_URL),
  convert,
  office,
  to(portrait),
  set(filename("namename.pdf")),
  please
);

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onend = reject;
    reader.onabort = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsArrayBuffer(file);
  });
};

const stream2buffer = (stream) => {
  return new Promise((resolve, reject) => {
    const _buf = [];

    stream.on("data", (chunk) => _buf.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(err));
  });
};

module.exports = createCoreController(
  "api::document.document",
  ({ strapi }) => ({
    async find(ctx) {
      if (ctx.state.user) {
        const response = await strapi.db
          .query("api::document.document")
          .findMany({
            where: { owner: ctx.state.user.id },
            populate: { originalFile: true },
          });

        return response;
      } else {
        return undefined;
      }

      // const { data, meta } = await super.find(ctx);

      // return { data, meta };
    },

    async findOne(ctx) {
      if (ctx.state.user) {
        const { id } = ctx.params;

        const response = await strapi.db
          .query("api::document.document")
          .findOne({
            where: { id, owner: ctx.state.user.id },
            populate: { originalFile: true },
          });

        return response;
      } else {
        return undefined;
      }
    },

    async create(ctx) {
      // start timer
      const start = Date.now();

      // file uploaded by user to convert
      const originalFile = ctx.request.files["files.originalFile"];

      // convert to pdf
      const pdfStream = await toPDF({
        [`${originalFile.name}`]: await readFile(originalFile),
      });

      // write to disk so stupid Strapi can handle uploading it
      pdfStream.pipe(fs.createWriteStream("DELETEME.pdf"));

      // upload the pdf file, use its id to tie it to this document instance
      const pdfFile = await strapi.plugins.upload.services.upload.upload({
        data: {},
        files: {
          path: "DELETEME.pdf",
          name: originalFile.name + ".pdf",
          type: "application/pdf",
          size: originalFile.size,
        },
      });

      // delete the file form disk
      fs.rmSync("DELETEME.pdf");

      // stop timer
      const end = Date.now();

      // include all fields
      ctx.request.body.data = JSON.stringify({
        owner: ctx.state.user ? ctx.state.user : undefined,
        originalExt: `.${originalFile["name"].split(".").pop()}`,
        pdfFile: pdfFile[0],
        duration: (end - start) / 1000,
      });

      // finally create
      const response = await super.create(ctx);

      return response;
    },

    async update(ctx) {
      const response = await super.update(ctx);

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
