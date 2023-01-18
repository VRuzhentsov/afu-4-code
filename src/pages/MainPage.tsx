import {
  IonButtons, IonCol,
  IonContent, IonGrid,
  IonHeader,
  IonInput, IonItem,
  IonLabel, IonList,
  IonMenuButton,
  IonPage, IonRow,
  IonTitle,
  IonToolbar, useIonViewWillEnter
} from '@ionic/react';
import './MainPage.css';
import {useContext, useEffect, useState} from "react";
import DependencyContext from "../contexts/dependencyContext";
import {ICode} from "../interfaces/ICode";

const MainPage: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [items, setItems] = useState<ICode[]>([]);
  const {codesRepository} = useContext(DependencyContext);
  const [filteredItems, setFilteredItems] = useState<ICode[]>([]);

  useEffect(() => {
    const codes = items.filter(item => item.code.includes(code));
    setFilteredItems(codes);
  }, [code])

  const fetchData = async () => {
    const codes = await codesRepository.getCodes();
    setItems(codes);
    setFilteredItems(codes);
  }

  useIonViewWillEnter(() => {
    console.debug("[MainPage] useIonViewWillEnter");
    fetchData();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton/>
          </IonButtons>
          <IonTitle>Головна</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Головна</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonInput
          autofocus
          placeholder={"Код..."}
          maxlength={4}
          max={9999}
          type="number"
          class={"main-number-input"}
          onIonChange={e => setCode(e.detail.value!)}
        />

        <IonList>
          {filteredItems.map((item, index) => (
            <IonItem key={item.id}>
              <IonGrid fixed>
                <IonRow className="ion-align-items-center ion-text-wrap">
                  <IonCol size="3">
                    <IonLabel>{item.code}</IonLabel>
                  </IonCol>
                  <IonCol size="5">
                    <IonLabel>{item.description}</IonLabel>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MainPage;


