import { BanchoPyApiHandler } from "./banchopyhandler";
import type { IServerApiHandler } from "./iserverapihandler";
import { RippleApiHandler } from "./ripplehandler";
import { SunriseApiHandler } from "./sunrisehandler";
import { TitanicApiHandler } from "./titanichandler";

export const getApiHandler = (
  apiUrl: string,
  type: string,
): IServerApiHandler => {
  switch (type.toLowerCase()) {
    case "titanic":
      return new TitanicApiHandler(apiUrl);
    case "banchopy":
      return new BanchoPyApiHandler(apiUrl);
    case "ripple":
      return new RippleApiHandler(apiUrl);
    case "sunrise":
      return new SunriseApiHandler(apiUrl);
    default:
      throw new Error(`Unsupported server type: ${type}`);
  }
};
