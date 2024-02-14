
module.exports =
function set(setting, val) {
  if (arguments.length === 1) {
    // app.get(setting)
    // Taken from: https://github.com/expressjs/express/blob/master/lib/application.js#L361
    // call original set
    return this.__set(setting, val);
  }

  // But if we are setting values, we want to set our own
  switch(setting) {
    case "endpoints":
      this.__declarative.endpoints = val;
      break;
    case "limits":
      this.__declarative.limits = val;
      break;
    case "declarative":
      if (val === "ready") {
        this.__declarative.init();
      }
      break;
    default:
      // We didn't know how to handle this, we will pass it to the original func
      return this.__set(setting, val);
  }

  return this;
}
