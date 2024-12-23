// Modules
import HTMLJS from "./html.js";

/**
 * Enables the template engine for the application.
 *
 * @param {Object} app - The Express application instance.
 */
export const enableTemplateEngine = (app) => {
  app.engine("html.js", (filePath, options, callback) => {
    import(filePath)
      .then((obj) => {
        const app = new HTMLJS();

        const html = options.serverData
          ? app.render(obj.default(options), options.serverData)
          : app.render(obj.default(options));

        return callback(null, html);
      })
      .catch((err) => {
        console.error(err);
      });
  });
};
