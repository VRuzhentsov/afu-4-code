import React from 'react';
import { v4 } from 'uuid';
import { IonButton, IonCol, IonIcon, IonInput, IonRow } from '@ionic/react';
import { saveOutline } from 'ionicons/icons';

interface EditableItemProps {
  code: string;
  description: string;
  setCode: (code: string) => void;
  setDescription: (description: string) => void;
  handleUpdate: (id: string) => void;
}

const EditableItem: React.FC<EditableItemProps> = ({ code, description, setCode, setDescription, handleUpdate }) => (
    <IonRow className="ion-align-items-center ion-text-wrap">
      <IonCol size="3">
        <IonInput
          debounce={100}
          class="ion-no-padding"
          value={code}
          type="number"
          max={9999}
          min={0}
          placeholder={"код..."}
          onIonChange={e => setCode(e.detail.value!)}
        />
      </IonCol>
      <IonCol size="5">
        <IonInput
          debounce={100}
          class="ion-no-padding"
          value={description}
          maxlength={400}
          placeholder={"опис..."}
          onIonChange={e => setDescription(e.detail.value!)}
        />
      </IonCol>
      <IonCol size="4">
        <IonButton onClick={() => handleUpdate(v4())} disabled={code === "" || description === ""}>
          <IonIcon slot="icon-only" icon={saveOutline} />
        </IonButton>
      </IonCol>
    </IonRow>
  );

export default EditableItem;