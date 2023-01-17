import { createContext } from 'react';
import CodesRepository from "../repositories/codes.repository";
import StorageService from "../services/storage.service";

const DependencyContext = createContext({
  codesRepository: new CodesRepository(new StorageService()),
});

export default DependencyContext;
