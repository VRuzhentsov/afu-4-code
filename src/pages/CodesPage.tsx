import {
  IonButton,
  IonButtons, IonCol,
  IonContent, IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem, IonLabel,
  IonList,
  IonMenuButton,
  IonPage, IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import {useCallback, useEffect, useRef, useState} from "react";
import {ICode} from "../interfaces/ICode";
import {pencilOutline, saveOutline, addOutline} from 'ionicons/icons';

interface CodesPageProps {
  initialItems: ICode[];
}
const emptyCode: ICode = {
  code: "",
  description: ""
}

const CodesPage: React.FC<CodesPageProps> = ({initialItems= []}) => {
  const [addingMode, setAddingMode] = useState(false);
  const [editingMode, setEditingMode] = useState<number|null>(null);
  const [items, setItems] = useState<ICode[]>(initialItems);
  const [code, setCode] = useState<string>("");
  const [description, setDescription] = useState("");
  const inputRef = useRef<HTMLIonItemElement>(null);
  const addButtonRef = useRef<HTMLIonButtonElement>(null);
  // const [renderFlags, setRenderFlags] = useState({ });
  // const [showFlags, setShowFlags] = useState({ });

  const handleEdit = (index: number) => {
    setCode(items[index].code);
    setDescription(items[index].description);
    setEditingMode(index);
  }

  const cancelEdit = () => {
    setEditingMode(null);
  }

  const handleSave = (index: number) => {
    setItems(items.map((item, i) => {
      if (i === index) {
        return {...item, code, description};
      }
      return item;
    }));
    setEditingMode(null);
  }

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const elementPath = e.composedPath();
    const {current: inputEl} = inputRef;
    const {current: addButtonEl} = addButtonRef;
    if (editingMode !== null &&
      !addingMode &&
      inputEl && !elementPath.includes(inputEl) &&
      addButtonEl && !elementPath.includes(addButtonEl)) {
      console.debug("[CodesPage] handleClickOutside", {elementPath});

      cancelEdit();
    }
  }, [editingMode,inputRef,addButtonRef])

  const addItem = async () => {
    await setItems([...items, emptyCode]);
    setAddingMode(true);
    console.debug(`[CodesPage] addItem items.length=${items.length}`);
  }

  useEffect(() => {
    if (!addingMode) return;
    console.debug("[CodesPage] useEffect addingMode", {addingMode});
    // condition, which will enter edit mode for last item in the "items" array, if still not entered in it, and if it is still in the adding mode
    const lastItem = items[items.length-1];
    const lastItemIsEmpty = lastItem.code === "" || lastItem.description === "";
    const lastItemIsBeingEdited = editingMode === items.length-1;
    if(!lastItemIsBeingEdited && lastItemIsEmpty) {
      handleEdit(items.length-1);
    } else if(editingMode === null && !lastItemIsEmpty) {
      setAddingMode(false);
    }
  }, [items, addingMode, editingMode]);

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton/>
          </IonButtons>
          <IonTitle>Коди</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Коди</IonTitle>
          </IonToolbar>
        </IonHeader>


        <IonList>
          {items.map((item, index) => (
            <IonItem ref={inputRef} key={item.code}>
              <IonGrid fixed>
                <IonRow className="ion-align-items-center ion-text-wrap">
                  {editingMode === index ? (
                    <>
                      <IonCol size="4">
                        <IonInput
                          debounce={100}
                          value={code}
                          placeholder={"код..."}
                          onIonChange={e => setCode(e.detail.value!)}
                        />
                      </IonCol>
                      <IonCol size="6">
                        <IonInput
                          debounce={100}
                          value={description}
                          placeholder={"опис..."}
                          onIonChange={e => setDescription(e.detail.value!)}
                        />
                      </IonCol>
                      <IonCol size="2">
                        <IonButton onClick={() => handleSave(index)} disabled={code === "" || description === ""}>
                          <IonIcon slot="icon-only" icon={saveOutline}/>
                        </IonButton>
                      </IonCol>
                    </>
                  ) : (
                    <>
                      <IonCol size="4">
                        <IonLabel>{item.code}</IonLabel>
                      </IonCol>
                      <IonCol size="6">
                        <IonLabel>{item.description}</IonLabel>
                      </IonCol>
                      <IonCol size="2">
                        <IonButton onClick={() => handleEdit(index)}>
                          <IonIcon slot="icon-only" icon={pencilOutline}/>
                        </IonButton>
                      </IonCol>
                    </>
                  )}
                </IonRow>
              </IonGrid>
            </IonItem>
          ))}

          <IonItem>
            <IonGrid fixed>
              <IonRow className="ion-align-items-center ion-text-wrap">
                <IonCol size="12">
                  <IonButton expand="block" onClick={addItem} ref={addButtonRef} disabled={addingMode}>
                    <IonIcon slot="icon-only" icon={addOutline}/>
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default CodesPage;


