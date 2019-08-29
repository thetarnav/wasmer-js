import * as randomfill from "randomfill";
import hrtime from "browser-process-hrtime";
import path from "path-browserify";

import { WASIBindings } from "../wasi";
import getBigIntHrtime from "../polyfills/hrtime.bigint";

export class WASIExitError extends Error {
  code: number | null;
  constructor(code: number | null) {
    super(`WASI Exit error: ${code}`);
    this.code = code;
  }
}

export class WASIKillError extends Error {
  signal: string;
  constructor(signal: string) {
    super(`WASI Kill signal: ${signal}`);
    this.signal = signal;
  }
}

const bindings: WASIBindings = {
  hrtime: getBigIntHrtime(hrtime),
  exit: (code: number | null) => {
    throw new WASIExitError(code);
  },
  kill: (signal: string) => {
    throw new WASIKillError(signal);
  },
  randomFillSync: randomfill.randomFillSync,
  isTTY: () => true,
  path: path,

  // Let the user attach the fs at runtime
  fs: null
};

export default bindings;