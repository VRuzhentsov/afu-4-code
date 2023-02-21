import FilesStorageService from "./files-storage.service";
import {ICode} from "../interfaces/ICode.js";
import {IDownloadableCodes} from "../interfaces/IDownloadableData";

export default class BackupService {
  constructor(private filesStorageService: FilesStorageService) {}
  async import(): Promise<ICode[]> {
    const file: string = await this.filesStorageService.open("text/json");
    const {codes} = JSON.parse(file)
    return codes;
  }

  async export(codesData: IDownloadableCodes) {
    return this.filesStorageService.downloadFile(BackupService.generateFileName(), codesData);
  }

  share(codesData: IDownloadableCodes) {
    return this.filesStorageService.shareFile(BackupService.generateFileName(), codesData);
  }

  static generateFileName(): string {
    const date: Date = new Date();
    const formattedDate: string = "" + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes();
    return `afu-4-code-backup-${formattedDate}.json`;
  }
}
