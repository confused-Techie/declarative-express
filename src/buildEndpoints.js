
module.exports =
function buildEndpoints() {

  const pathOptions = [];

  for (const node of this.__declarative.endpoints) {
    if (!Array.isArray(node.endpoint.paths)) {
      node.endpoint.paths = [node.endpoint.path];
      // notice the support of path
    }
    // We force the endpoint paths to be an array, so we only have to deal with it once
    for (const path of node.endpoint.paths) {

      let limiter = this.__declarative.limits[node.endpoint.rateLimit] ?? null;

      if (!pathOptions.includes(path) && typeof node.endpoint.options === "object") {
        if (limiter) {
            this.options(path, limiter, async (req, res) => {
              res.header(node.endpoint.options);
              res.sendStatus(204);
              return;
            });
        } else {
          this.options(path, async (req, res) => {
            res.header(node.endpoint.options);
            res.sendStatus(204);
            return;
          });
        }

        pathOptions.push(path);
      }

      const method = node.endpoint.method.toLowerCase();

      if (limiter) {
        app[method](path, limiter, async (req, res) => {
          await this.__declarative.endpointHandler(req, res, node);
        });
      } else {
        app[method](path, async (req, res) => {
          await this.__declarative.endpointHandler(req, res, node);
        });
      }

    }

  }
}
