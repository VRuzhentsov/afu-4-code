import {IonButtons, IonContent, IonHeader, IonInput, IonMenuButton, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import './MainPage.css';

const MainPage: React.FC = () => {
  let code = "";

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
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

        {/*<div className="container">*/}
          <IonInput
            autofocus
            placeholder={"Код..."}
            maxlength={4}
            max={9999}
            type="number"
            class={"main-number-input"}
            onIonChange={e => code = e.detail.value!}
          />
        {/*</div>*/}
      </IonContent>
    </IonPage>
  );
};

export default MainPage;


