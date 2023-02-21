import {ICode} from "./ICode";

export interface IDownloadableData {
  version: string;

  [x: string | number]: unknown;
}

export interface IDownloadableCodes extends IDownloadableData{
  codes: ICode[]
}

export interface IDownloadableButton {
  href: string;
  download: string;
}
