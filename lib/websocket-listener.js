module.exports = connect;

function connect (opt, cb) {
  opt = opt || {};

  // If budo is running, we will try to hook into that since it
  // will produce less spam in console on reconnect errors.
  const devClient = window['budo-livereload'];
  if (devClient && typeof devClient.listen === 'function') {
    return devClient.listen(cb);
  }

  // Otherwise we will just create our own socket interface
  var route = typeof opt.route === 'undefined' ? '/' : opt.route;

  var reconnectPoll = 1000;
  var maxRetries = 50;
  var retries = 0;
  var reconnectInterval;
  var isReconnecting = false;
  var protocol = document.location.protocol;
  var hostname = document.location.hostname;
  var port = document.location.port;
  var host = hostname + ':' + port;

  var isIOS = /(iOS|iPhone|iPad|iPod)/i.test(navigator.userAgent);
  var isSSL = /^https:/i.test(protocol);
  var socket = createWebSocket();

  function scheduleReconnect () {
    if (isIOS && isSSL) {
      // Special case for iOS with a self-signed certificate.
      return;
    }
    if (isSSL) {
      // Don't attempt to re-connect in SSL since it will likely be insecure
      return;
    }
    if (retries >= maxRetries) {
      return;
    }
    if (!isReconnecting) {
      isReconnecting = true;
    }
    retries++;
    clearTimeout(reconnectInterval);
    reconnectInterval = setTimeout(reconnect, reconnectPoll);
  }

  function reconnect () {
    if (socket) {
      // force close the existing socket
      socket.onclose = function () {};
      socket.close();
    }
    socket = createWebSocket();
  }

  function createWebSocket () {
    var wsProtocol = isSSL ? 'wss://' : 'ws://';
    var wsUrl = wsProtocol + host + route;
    var ws = new window.WebSocket(wsUrl);
    ws.onmessage = function (event) {
      var data;
      try {
        data = JSON.parse(event.data);
      } catch (err) {
        console.warn('Error parsing WebSocket Server data: ' + event.data);
        return;
      }

      cb(data);
    };
    ws.onclose = function (ev) {
      if (ev.code === 1000 || ev.code === 1001) {
        // Browser is navigating away.
        return;
      }
      scheduleReconnect();
    };
    ws.onopen = function () {
      if (isReconnecting) {
        isReconnecting = false;
        retries = 0;
      }
    };
    ws.onerror = function () {
      return false;
    };
    return ws;
  }
}
