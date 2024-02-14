
module.exports =
function endpointHandler(req, res, node) {

  // TODO Revisit after some thought about how best to handle params
  // for now lets assume context exists?
  const context = this.__declarative.context;

  let params = {};

  for (const param in node.params) {
    params[param] = node.params[param](context, req);
  }

  if (typeof node.preLogic === "function") {
    await node.preLogic(req, res, context);
  }

  let obj;

  try {
    if (node.endpoint.endpointKind === "raw") {
      await node.logic(req, res, context);
      // If it's a raw endpoint, they must handle all other steps manually
      return;
    } else {
      obj = await node.logic(params, context);
    }
  } catch(err) {
    if (this.__declarative.logicErr === "function") {
      obj = await this.__declarative.logicErr(err);
    } else {
      throw err;
    }
  }

  if (typeof node.postLogic === "function") {
    await node.postLogic(req, res, context);
  }

  // TODO This is normally where I would handle the SSO return
  // but not sure if we should cement this here, maybe use a generic handler?

  if (typeof node.postReturnHTTP === "function") {
    await node.postReturnHTTP(req, res, context, obj);
  }

  return;
}
