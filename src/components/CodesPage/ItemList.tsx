import React from 'react';
import { IonGrid, IonItem, IonList } from '@ionic/react';
import EditableItem from './EditableItem';
import ReadOnlyItem from './ReadOnlyItem';
import { ICode } from '../../interfaces/ICode';

interface ItemListProps {
  items: ICode[];
  addingMode: boolean;
  editingMode: number | null;
  code: string;
  description: string;
  setCode: (code: string) => void;
  setDescription: (description: string) => void;
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
  handleUpdate: (id: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({
  items,
  editingMode,
  addingMode,
  code,
  description,
  setCode,
  setDescription,
  handleEdit,
  handleDelete,
  handleUpdate
}) => (
  <IonList>
    {items.map((item, index) => (
      <IonItem key={item.id}>
        <IonGrid fixed>
          {editingMode === index ? (
            <EditableItem
              code={code}
              description={description}
              setCode={setCode}
              setDescription={setDescription}
              handleUpdate={() => handleUpdate(item.id)}
            />
          ) : (
            <ReadOnlyItem
              item={item}
              handleEdit={() => handleEdit(index)}
              handleDelete={() => handleDelete(index)}
            />
          )}
        </IonGrid>
      </IonItem>
    ))}
    {addingMode && (
      <IonItem>
        <IonGrid fixed>
          <EditableItem
            code={code}
            description={description}
            setCode={setCode}
            setDescription={setDescription}
            handleUpdate={handleUpdate}
          />
        </IonGrid>
      </IonItem>
    )}
  </IonList>
);

export default ItemList;