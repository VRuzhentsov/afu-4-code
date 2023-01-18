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
  IonToolbar, useIonViewWillEnter
} from '@ionic/react';
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {ICode} from "../interfaces/ICode";
import {pencilOutline, saveOutline, addOutline, trashBinOutline} from 'ionicons/icons';
import DependencyContext from '../contexts/dependencyContext';
import {v4} from 'uuid';

interface CodesPageProps {
  initialItems: ICode[];
}

const CodesPage: React.FC<CodesPageProps> = () => {
  const {codesRepository} = useContext(DependencyContext);
  const [addingMode, setAddingMode] = useState<boolean>(false);
  const [editingMode, setEditingMode] = useState<number | null>(null);
  const [items, setItems] = useState<ICode[]>([]);
  const [itemsInit, setItemsInit] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const inputRef = useRef<HTMLIonItemElement>(null);
  const addButtonRef = useRef<HTMLIonButtonElement>(null);
  // const [renderFlags, setRenderFlags] = useState({ });
  // const [showFlags, setShowFlags] = useState({ });

  const handleEdit = (index: number) => {
    console.debug("[CodesPage] handleEdit", index);
    setCode(items[index].code);
    setDescription(items[index].description);
    if (editingMode !== index) {
      setEditingMode(index);
    }
  }

  const handleDelete = (index: number) => {
    console.debug("[CodesPage] handleDelete", index);
    codesRepository.deleteCode(items[index].id);
    setItems(items.filter((_, i) => i !== index));
  }

  const cancelEdit = () => {
    setEditingMode(null);
  }

  const handleUpdate = (id: string) => {
    const newItem = {id, code, description};
    console.debug("[CodesPage] handleUpdate", {id, newItem});

    // Find the index of the item with the matching id
    const index = items.findIndex(item => item.id === id);

    // Update the item at that index
    const updatedItems = [...items];
    updatedItems[index] = newItem;

    setItems(updatedItems);
    codesRepository.updateCode(newItem)
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
  }, [editingMode, inputRef, addButtonRef])

  const createItem = async () => {
    const newCode: ICode = {id: v4(), code: '', description: ''};
    await setItems([...items, newCode]);
    codesRepository.createCode(newCode);
    setAddingMode(true);
    console.debug(`[CodesPage] createItem items.length=${items.length}`);
  }

  useEffect(() => {
    if (!addingMode) return;
    console.debug("[CodesPage] useEffect addingMode", {addingMode, editingMode, items});
    // condition, which will enter edit mode for last item in the "items" array, if still not entered in it, and if it is still in the adding mode
    const lastItem = items[items.length - 1];
    if (!lastItem) return;
    const lastItemIsEmpty = lastItem.code === "" || lastItem.description === "";
    const lastItemIsBeingEdited = editingMode === items.length - 1;
    if (editingMode === null && !lastItemIsBeingEdited && lastItemIsEmpty) {
      handleEdit(items.length - 1);
    } else if (editingMode === null && !lastItemIsEmpty) {
      setAddingMode(false);
    }
  }, [items, addingMode, editingMode]);

  const fetchData = async () => {
    const codes = await codesRepository.getCodes();
    setItems(codes);
  }

  useIonViewWillEnter(() => {
    console.debug("[CodesPage] useIonViewWillEnter");
    fetchData();
  });

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
            <IonItem ref={inputRef} key={item.id}>
              <IonGrid fixed>
                <IonRow className="ion-align-items-center ion-text-wrap">
                  {editingMode === index ? (
                    <>
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
                        <IonButton onClick={() => handleUpdate(item.id)} disabled={code === "" || description === ""}>
                          <IonIcon slot="icon-only" icon={saveOutline}/>
                        </IonButton>
                      </IonCol>
                    </>
                  ) : (
                    <>
                      <IonCol size="3">
                        <IonLabel>{item.code}</IonLabel>
                      </IonCol>
                      <IonCol size="5">
                        <IonLabel>{item.description}</IonLabel>
                      </IonCol>
                      <IonCol size="4">
                        <IonButton onClick={() => handleEdit(index)}>
                          <IonIcon slot="icon-only" icon={pencilOutline}/>
                        </IonButton>
                        <IonButton onClick={() => handleDelete(index)}>
                          <IonIcon slot="icon-only" icon={trashBinOutline}/>
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
                  <IonButton expand="block" onClick={createItem} ref={addButtonRef} disabled={addingMode}>
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


