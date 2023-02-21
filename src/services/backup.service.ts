import FilesStorageService from "./files-storage.service";
import {ICode} from "../interfaces/ICode.js";
import {IDownloadableCodes} from "../interfaces/IDownloadableData";

export default class BackupService {
  constructor(private filesStorageService: FilesStorageService) {}
  async import(): Promise<ICode[]> {
    const file: string = await this.filesStorageService.open();
    const {codes} = JSON.parse(file)
    return codes;
  }

  async export(codesData: IDownloadableCodes) {
    const date: Date = new Date();
    // const formattedDate = date.getTime();
    const formattedDate: string = "" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes();
    const fileName: string = `afu-4-code-backup-${formattedDate}.json`
    this.filesStorageService.downloadDataJson(fileName, codesData);
  }
}
