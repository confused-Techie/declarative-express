const set = require("./set.js");
const buildEndpoints = require("./buildEndpoints.js");
const endpointHandler = require("./endpointHandler.js");

exports = module.exports = createApplication;

function createApplication(express) {
  console.log("createApplication");
  if (!express) {
    throw new Error("An Express instance must be passed during creation of 'declarative-express'");
  }

  // Here we assume that `express` is an active instance of the express application
  // Here we will override some defaults of express, and then finally return the
  // modified express instance

  // Override `.set()`
  express.__set = express.set; // The original set is available as `.__set()`

  express.set = set;

  // We will also set our namespace within `express` to allow saving
  // application specific settings
  express.__declarative = { // Notice the two '_'
    endpoints: [],
    limits: {},
    context: null,
    endpointHandler: endpointHandler,
    init: buildEndpoints
  };

  return express;
}
