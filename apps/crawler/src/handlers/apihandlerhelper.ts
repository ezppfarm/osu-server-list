import { BanchoPyApiHandler } from "./banchopyhandler";
import { RippleApiHandler } from "./ripplehandler";


export function getApiHandler(baseUrl: string, type: string) {
  switch (type.toLowerCase()) {
    case "banchopy":
      return new BanchoPyApiHandler(baseUrl);
    case "ripple":
      return new RippleApiHandler(baseUrl);
    default:
      throw new Error(`Unsupported server type: ${type}`);
  }
}