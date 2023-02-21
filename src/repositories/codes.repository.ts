import StorageService from "../services/storage.service";
import {ICode} from "../interfaces/ICode.js";

export default class CodesRepository {
  private storageService: StorageService;
  private codesKey = 'codes';

  constructor(storageService: StorageService) {
    this.storageService = storageService;
  }

  async getCodes(): Promise<ICode[]> {
    const codes = await this.storageService.get(this.codesKey);
    return codes || [];
  }

  async setCodes(codes: ICode[]) {
    await this.storageService.set(this.codesKey, codes);
  }

  async mergeCodes(codes: ICode[]) {
    const oldCodes = await this.storageService.get(this.codesKey);
    const newCodes = [...oldCodes, ...codes];
    await this.storageService.set(this.codesKey, newCodes);
  }

  async createCode(code: ICode): Promise<void> {
    const codes = await this.getCodes();
    codes.push(code);
    await this.storageService.set(this.codesKey, codes);
  }

  async updateCode(code: ICode): Promise<ICode> {
    const codes = await this.getCodes();
    const codeIndex = codes.findIndex(c => c.id === code.id);
    console.debug("[CodesRepository] updateCode", {code,codeIndex,codes});
    if(codeIndex === -1) {
      throw new Error("Code not found");
    }
    codes[codeIndex] = code;
    return await this.storageService.set(this.codesKey, codes);
  }

  async deleteCode(codeId: string): Promise<Boolean> {
    const codes = await this.getCodes();
    const updatedCodes = codes.filter(code => code.id !== codeId);
    await this.storageService.set(this.codesKey, updatedCodes);
    return true;
  }
}
