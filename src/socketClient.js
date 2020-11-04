import io from "socket.io-client";

class SocketClient {
  constructor() {
    this.socket = null;
    this.options = {
      onData: null,
      onConnect: null,
      onDisconnect: null,
      url: null,
    };
  }

  connect(options) {
    this.options = { ...this.options, ...options };
    if (this.options.url) {
      this.socket = io(this.options.url);

      this.socket.on("app:tweets", (data) => {
        if (this.options.onData) {
          this.options.onData(data);
        }
      });

      this.socket.on("connect", () => {
        if (this.options.onConnect) {
          this.options.onConnect();
        }
      });

      this.socket.on("disconnect", (reason) => {
        if (this.options.onDisconnect) {
          this.options.onDisconnect();
        }
        if (reason === "io server disconnect") {
          this.socket.connect();
        }
      });
    }
    return this;
  }

  onConnect(fn) {
    this.options.onConnect = fn;
  }

  onDisconnect(fn) {
    this.options.onDisconnect = fn;
  }

  onData(fn) {
    this.options.onData = fn;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  emit(...data) {
    if (this.socket) {
      this.socket.emit(...data);
    }
  }
}

export default new SocketClient();
