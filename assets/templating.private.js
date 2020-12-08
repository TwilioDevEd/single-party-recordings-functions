const hbs = require("handlebars");
const assets = Runtime.getAssets();

hbs.registerHelper("eq", (first, second) => {
  return first === second;
});

function compileTemplates() {
  const templateFiles = Object.keys(assets).filter((assetPath) =>
    assetPath.startsWith("/templates/")
  );
  // Creates an object of function name to template function
  return templateFiles.reduce((registry, fileName) => {
    const templateString = assets[fileName].open();
    // Format: /templates/<function name>.hbs
    const functionName = fileName.match(/\/templates\/([^.]+).hbs/)[1];
    registry[`/${functionName}`] = hbs.compile(templateString);
    return registry;
  }, {});
}

// TODO: This could (maybe should) be memoized
const templateRegistry = compileTemplates();

function render(context, values, functionPath) {
  const response = new Twilio.Response();
  const path = functionPath || context.PATH;
  const templateFn = templateRegistry[path];
  response.appendHeader("Content-Type", "text/html");
  response.setBody(
    templateFn({
      CONTEXT: context,
      ...values,
    })
  );
  return response;
}

function errorHandler(context, err, callback) {
  console.error(`Error occurred: ${err}`);
  callback(null, render(context, { err }, "/error"));
}

module.exports = {
  render,
  errorHandler,
};
