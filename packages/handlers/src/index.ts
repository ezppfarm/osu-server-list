import { BanchoPyApiHandler } from "./banchopyhandler";
import type { IServerApiHandler } from "./iserverapihandler";
import { RippleApiHandler } from "./ripplehandler";


export const getApiHandler = (baseUrl: string, type: string): IServerApiHandler => {
  switch (type.toLowerCase()) {
    case "banchopy":
      return new BanchoPyApiHandler(baseUrl);
    case "ripple":
      return new RippleApiHandler(baseUrl);
    default:
      throw new Error(`Unsupported server type: ${type}`);
  }
}