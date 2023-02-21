import {
  IonButtons,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonPage,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  useIonToast
} from "@ionic/react";
import {FC, useContext} from "react";
import DependencyContext from "../contexts/dependencyContext";
import {IDownloadableCodes} from "../interfaces/IDownloadableData";
import projectPackage from "../../package.json"
import {ICode} from "../interfaces/ICode.js";
import {cloudDownloadOutline, cloudUploadOutline} from "ionicons/icons";

const BackupPage: FC = () => {
  const {codesRepository, backupService} = useContext(DependencyContext);
  const [present] = useIonToast();

  const prepareCodesToData = async (): Promise<IDownloadableCodes> => {
    return {
      version: projectPackage.version,
      codes: await codesRepository.getCodes()
    }
  }

  const getCodesDataFromSystem = (): Promise<ICode[]> => {
    return backupService.import();
  };

  const onImportReplaceClick = async () => {
    const codes: ICode[] = await getCodesDataFromSystem();
    await codesRepository.setCodes(codes);
    present({
      message: 'Успішно імпортовано',
      duration: 1500,
      position: "bottom",
      color: "success"
    });
    console.debug("[BackupPage] onImportReplaceClick", {codes});
  }

  const onImportAddClick = async () => {
    const codes: ICode[] = await getCodesDataFromSystem();
    await codesRepository.mergeCodes(codes);
    present({
      message: 'Успішно імпортовано',
      duration: 1500,
      position: "bottom",
      color: "success"
    });
    console.debug("[BackupPage] onImportAddClick", {codes});
  }

  const onExportClick = async () => {
    const codesData = await prepareCodesToData()
    await backupService.export(codesData)
    console.debug("[BackupPage] onExportClick")
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton/>
          </IonButtons>
          <IonTitle>Бекап</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Бекап</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="auto">
              <IonButton size="large" onClick={onImportAddClick}>
                <IonIcon icon={cloudDownloadOutline} />&nbsp;
                Імпорт
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size="auto">
              <IonButton size="large" onClick={onImportReplaceClick}>
                <IonIcon icon={cloudDownloadOutline} />&nbsp;
                Імпорт (замінити)
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size="auto">
              <IonButton size="large" onClick={onExportClick}>
                <IonIcon icon={cloudUploadOutline} />&nbsp;
                Експорт
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default BackupPage;
