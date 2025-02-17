mergeInto(LibraryManager.library, {
  SendMessageToWebView: function (data) {
    var message = Pointer_stringify(data);
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(message);
    } else {
      window.parent.postMessage(message, "*");
    }
  },
});
