import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom'; // Import useHistory
import DependencyContext from '../contexts/dependencyContext';
import { ICode } from '../interfaces/ICode';
import ItemList from '../components/CodesPage/ItemList';

const CodesPage: React.FC = () => {
  const { codesRepository } = useContext(DependencyContext);
  const [addingMode, setAddingMode] = useState<boolean>(false);
  const [editingMode, setEditingMode] = useState<number | null>(null);
  const [items, setItems] = useState<ICode[]>([]);
  const [code, setCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const inputRef = useRef<HTMLIonItemElement>(null);
  const addButtonRef = useRef<HTMLIonButtonElement>(null);
  const history = useHistory(); // Initialize useHistory

  const handleEdit = (index: number) => {
    setCode(items[index].code);
    setDescription(items[index].description);
    setEditingMode(index);
  };

  const handleDelete = (index: number) => {
    codesRepository.deleteCode(items[index].id);
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdate = (id: string) => {
    const newItem = { id, code, description };
    const index = items.findIndex(item => item.id === id);
  
    if (index === -1) {
      // Add new item
      setItems([...items, newItem]);
      codesRepository.createCode(newItem);
    } else {
      // Update existing item
      const updatedItems = [...items];
      updatedItems[index] = newItem;
      setItems(updatedItems);
      codesRepository.updateCode(newItem);
    }
  
    setEditingMode(null);
    setAddingMode(false);
  };

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const elementPath = e.composedPath();
    const { current: inputEl } = inputRef;
    const { current: addButtonEl } = addButtonRef;
    if (editingMode !== null && !addingMode && inputEl && !elementPath.includes(inputEl) && addButtonEl && !elementPath.includes(addButtonEl)) {
      setEditingMode(null);
    }
  }, [editingMode, inputRef, addButtonRef]);

  const createItem = () => {
    setCode("");
    setDescription("");
    setEditingMode(items.length); // Set editing mode to the new item's index
    setAddingMode(true);
  };

  useEffect(() => {
    if (!addingMode) return;
    const lastItem = items[items.length - 1];
    if (!lastItem) return;
    const lastItemIsEmpty = lastItem.code === "" || lastItem.description === "";
  
    if (editingMode === null && lastItemIsEmpty) {
      handleEdit(items.length - 1);
    } else if (editingMode === null && !lastItemIsEmpty) {
      setAddingMode(false);
    }
  }, [items, addingMode, editingMode]);

  const fetchData = async () => {
    const codes = await codesRepository.getCodes();
    setItems(codes);
  };

  useIonViewWillEnter(() => {
    fetchData();
  });

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Add useEffect to listen for route changes
  useEffect(() => {
    const unlisten = history.listen(() => {
      setEditingMode(null);
      setAddingMode(false);
      setCode("");
      setDescription("");
    });
    return () => {
      unlisten();
    };
  }, [history]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
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

        <ItemList
          items={items}
          editingMode={editingMode}
          addingMode={addingMode}
          code={code}
          description={description}
          setCode={setCode}
          setDescription={setDescription}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
        />

        <IonItem>
          <IonGrid fixed>
            <IonRow className="ion-align-items-center ion-text-wrap">
              <IonCol size="12">
                <IonButton expand="block" onClick={createItem} ref={addButtonRef} disabled={addingMode}>
                  <IonIcon slot="icon-only" icon={addOutline} />
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default CodesPage;