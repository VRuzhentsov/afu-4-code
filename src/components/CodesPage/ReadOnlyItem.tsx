import React from 'react';
import { IonButton, IonCol, IonIcon, IonLabel, IonRow } from '@ionic/react';
import { pencilOutline, trashBinOutline } from 'ionicons/icons';
import { ICode } from '../../interfaces/ICode';

interface ReadOnlyItemProps {
  item: ICode;
  handleEdit: () => void;
  handleDelete: () => void;
}

const ReadOnlyItem: React.FC<ReadOnlyItemProps> = ({ item, handleEdit, handleDelete }) => (
  <IonRow className="ion-align-items-center ion-text-wrap">
    <IonCol size="3">
      <IonLabel>{item.code}</IonLabel>
    </IonCol>
    <IonCol size="5">
      <IonLabel>{item.description}</IonLabel>
    </IonCol>
    <IonCol size="4">
      <IonButton onClick={handleEdit}>
        <IonIcon slot="icon-only" icon={pencilOutline} />
      </IonButton>
      <IonButton onClick={handleDelete}>
        <IonIcon slot="icon-only" icon={trashBinOutline} />
      </IonButton>
    </IonCol>
  </IonRow>
);

export default ReadOnlyItem;