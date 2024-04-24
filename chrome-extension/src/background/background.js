// This is to remove X-Frame-Options header, if present
chrome.webRequest.onHeadersReceived.addListener(
  function (info) {
    var headers = info.responseHeaders;
    var index = headers.findIndex(
      (x) => x.name.toLowerCase() == "x-frame-options"
    );
    if (index != -1) {
      headers.splice(index, 1);
    }
    return { responseHeaders: headers };
  },
  {
    urls: ["*://*.google.fr/*"], //
    types: ["sub_frame"],
  },
  ["blocking", "responseHeaders"]
);
