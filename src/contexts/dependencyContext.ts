import { createContext } from 'react';
import CodesRepository from "../repositories/codes.repository";
import StorageService from "../services/storage.service";
import FilesStorageService from "../services/files-storage.service";
import BackupService from "../services/backup.service";

const storageService = new StorageService()
const filesStorageService = new FilesStorageService()

const DependencyContext = createContext({
  storageService,
  codesRepository: new CodesRepository(storageService),
  filesStorageService,
  backupService: new BackupService(filesStorageService),
});

export default DependencyContext;
