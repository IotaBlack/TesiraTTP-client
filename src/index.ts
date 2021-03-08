import { Socket, SocketConnectOpts } from "net";

import net = require("net");
import EventEmitter = require("events");
import {
  TTP_SUBSCRIPTION_MESSAGE,
  anyTTPMessage,
  parseMessage,
  TTP_OK_MESSAGE,
} from "./messageParser";
import { FaultList } from "./faults";

declare interface ConnectOptions {
  host?: string;
  port?: number;
  localAddress?: string;
  socketConnectOptions?: SocketConnectOpts;
  timeout?: number;
  execTimeout?: number;
  sendTimeout?: number;
}

declare interface SendOptions {
  sendTimeout: number;
  execTimeout: number;
}



declare interface TelnetTTP {
  // on(event: string, listener: (...args: any[]) => void): this;
  on(event: "close", listener: (had_error: boolean) => void): this;
  on(event: "connect", listener: () => void): this;
  on(event: "data", listener: (data: Buffer) => void): this;
  on(event: "end", listener: () => void): this;
  on(event: "error", listener: (err: Error) => void): this;
  on(event: "timeout", listener: () => void): this;
  on(event: "ready", listener: () => void): this;
  on(
    event: "subscription",
    listener: (msg: TTP_SUBSCRIPTION_MESSAGE) => void
  ): this;
  on(
    event: `subscription_${string}`,
    listener: (msg: TTP_SUBSCRIPTION_MESSAGE) => void
  );

  
  send(cmd: "DEVICE get activeFaultList"): Promise<TTP_OK_MESSAGE<FaultList>>;
}

interface cmd {
  cmd: string;
  sendTimeout: number;
  execTimeout: number;
}
interface queueItem extends cmd {
  resolve: (value: anyTTPMessage | PromiseLike<anyTTPMessage>) => void;
  reject: (reason?: anyTTPMessage) => void;
}

class TelnetTTP extends EventEmitter {
  public state = {
    awaitingEcho: false,
    awaitingResponse: false,
    ready: false,
    sentBuffer: "",
  };
  public socket: Socket;
  private internalTimeout: NodeJS.Timeout;
  public connectTimeout: number;
  public execTimeout: number = 5000;
  public sendTimeout: number = 5000;
  private inputBuffer: string = "";
  private queue: queueItem[] = [];

  constructor() {
    super();

    this.socket = null;
  }

  connect(opts: ConnectOptions) {
    let promise = new Promise<void>((resolve, reject) => {
      const host = opts.host || "127.0.0.1";
      const port = opts.port || 23;
      const localAddress = opts.localAddress || "";
      const socketConnectOptions = opts.socketConnectOptions || {};

      this.connectTimeout = opts.timeout || 500;
      this.execTimeout = opts.execTimeout || 2000;
      this.sendTimeout = opts.sendTimeout || 2000;

      this.socket = net.createConnection(
        {
          port,
          host,
          localAddress,
          ...socketConnectOptions,
        },
        () => {
          this.state.ready = false;
          this.emit("connect");
        }
      );

      this.inputBuffer = "";

      this.socket.setTimeout(this.connectTimeout, () => {
        if (this.state == null) {
          /* if cannot connect, emit error and destroy */
          this.emit("error", "Cannot connect");

          this.socket.destroy();
          return reject(new Error("Cannot connect"));
        }
        this.emit("timeout");
        return reject(new Error("timeout"));
      });

      this.socket.on("connect", () => {
        resolve();
      });

      this.socket.on("data", (data) => {
        // console.log(data);
        data = this._parsedata(data);
      });

      this.socket.on("error", (error) => {
        this.emit("error", error);

        if (this.state == null) reject(error);
      });

      this.socket.on("end", () => {
        this.emit("end");

        if (this.state == null) reject(new Error("Socket ended"));
      });

      this.socket.on("close", (had_error) => {
        this.emit("close", had_error);
        console.log("asdfasdfasdf");
        if (this.state == null) reject(new Error("Socket closed"));
      });
    });

    return promise;
  }

  end() {
    return new Promise<void>((resolve) => {
      this.socket.end();
      resolve();
    });
  }

  destroy() {
    return new Promise<void>((resolve) => {
      this.socket.destroy();
      resolve();
    });
  }

  //   exec(cmd: string, options?: ExecOptions): Promise<string> {}
  send(cmd: string, options?: SendOptions): Promise<anyTTPMessage> {
    return new Promise((resolve, reject) => {
      this._queue(
        {
          cmd: cmd,
          sendTimeout: options?.sendTimeout || this.sendTimeout,
          execTimeout: options?.execTimeout || this.execTimeout,
        },
        resolve,
        reject
      );
      this._processQueue();
    });
  }

  private _queue(
    cmd: cmd,
    resolve: (value: anyTTPMessage | PromiseLike<anyTTPMessage>) => void,
    reject: (reason?: any) => void
  ) {
    this.queue.push({ ...cmd, resolve, reject });
  }

  private _processQueue() {
    if (
      !this.state.awaitingEcho &&
      !this.state.awaitingResponse &&
      this.state.ready &&
      this.queue.length
    ) {
      this.socket.write(this.queue[0].cmd + "\n");
      this.state.sentBuffer += this.queue[0].cmd;
      this.state.awaitingEcho = true;
      this.state.awaitingResponse = true;
      this.internalTimeout = setTimeout(() => {
        this.emit("timeout");
      }, this.queue[0].sendTimeout);
    }
  }

  private _resolveResponse(value: anyTTPMessage | PromiseLike<anyTTPMessage>) {
    this.state.awaitingResponse = false;
    clearTimeout(this.internalTimeout);
    this.queue[0].resolve(value);
    this.queue.shift();
    this._processQueue();
  }
  private _rejectResponse(reason?: anyTTPMessage) {
    this.state.awaitingResponse = false;
    clearTimeout(this.internalTimeout);
    this.queue[0].reject(reason);
    this.queue.shift();
    this._processQueue();
  }

  private _parsedata(data: Buffer) {
    let tBuffer = [];
    let nvtResponse = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i] == 0xff) {
        switch (data[++i]) {
          case 0xff:
            this.inputBuffer += String.fromCharCode(0xff);
            break;
          case 0xfb: //Will, respond Don't (unless it is echo or binary transmit)
            if (data[i + 1] == 0x01 || data[i + 1] == 0x03)
              nvtResponse.push(0xff, 0xfd, data[++i]);
            else nvtResponse.push(0xff, 0xfe, data[++i]);
            break;
          case 0xfd: //Do, respont Won't
            nvtResponse.push(0xff, 0xfc, data[++i]);
            break;
          case 0xfe: //Don't, respond Won't
            nvtResponse.push(0xff, 0xfc, data[++i]);
            break;
          case 0xfc: //Won't, respont Don't
            nvtResponse.push(0xff, 0xfe, data[++i]);
            break;
        }
      } else {
        if (
          (data[i] == 0x0d && data[i + 1] == 0x0a && i++) ||
          data[i] == 0x0a
        ) {
          if (this.inputBuffer.length && this._processMessage(this.inputBuffer))
            this.inputBuffer = "";
        } else {
          this.inputBuffer += String.fromCharCode(data[i]);
        }
      }
    }
    if (nvtResponse.length) this.socket.write(Buffer.from(nvtResponse));

    return Buffer.from(tBuffer);
  }
  private _processMessage(message: string): boolean {
    this.emit("data", message);
    if (this.state.ready) {
      if (this.state.awaitingEcho) {
        if (message == this.state.sentBuffer) {
          this.state.sentBuffer = "";
          this.state.awaitingEcho = false;
          clearTimeout(this.internalTimeout);
          this.internalTimeout = setTimeout(() => {
            this.emit("timeout");
          }, this.queue[0].execTimeout);
        }
      } else if (this.state.awaitingResponse) {
        if (message.startsWith("+OK")) {
          this._resolveResponse(parseMessage(message));
          return true;
        }
        if (message.startsWith("-ERR")) {
          this._rejectResponse(parseMessage(message));
          return true;
        }
      }

      if (message.startsWith("!")) {
        let msg = parseMessage(message) as TTP_SUBSCRIPTION_MESSAGE;
        this.emit("subscription", msg);
        this.emit(`subscription_${msg.publishToken}`, msg);
      }
    } else {
      if (message == "Welcome to the Tesira Text Protocol Server...") {
        this.inputBuffer = "";
        this.state.ready = true;
        this.emit("ready");
      }
    }
    return true;
  }
}

export = TelnetTTP;
