"use client";

import React, { ReactElement, useEffect, useState } from "react";
import { Admin, Type } from "@/lib/type.ts";
import s from "@/components/admin/common/selectableList/adminList.module.css";
import useOnClickOutside from "@/components/hooks/useOnClickOutside.ts";
import useListSelection from "@/components/hooks/useListSelection.ts";
import useKeyboard from "@/components/hooks/useKeyboard.ts";
import Modal from "@/components/admin/common/modal.tsx";
import { MESSAGE } from "@/constants/admin.ts";

interface SelectableListProps<T extends Admin> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  renderFilter?: (
    getFilteredItems: (filteredItems: T[]) => void,
  ) => React.ReactNode;
  updateForm: (item: T, handleClose: () => void) => React.ReactNode;
}

export default function SelectableList<T extends Admin>({
  items,
  renderItem,
  renderFilter,
  updateForm,
}: SelectableListProps<T>): ReactElement {
  const { ref, isOutside } = useOnClickOutside();
  const { selectedIndex, decrease, increase, setSelectedIndex } =
    useListSelection(items);
  useKeyboard("ArrowUp", decrease, !isOutside);
  useKeyboard("ArrowDown", increase, !isOutside);
  const [editedItem, setEditedItem] = useState<T | null>(null);
  const [itemsToDisplay, setItemsToDisplay] = useState<T[]>(items);
  const isCategory = items[0]?.type === Type.CATEGORY;

  useEffect(() => {
    if (!renderFilter) setItemsToDisplay(items);
  }, [items]);

  return (
    <div className="inputContainer">
      {renderFilter && renderFilter(setItemsToDisplay)}
      <div
        ref={ref}
        className={`${isCategory ? s.categoryListWrapper : s.itemListWrapper} ${s.listWrapper} list`}
      >
        <ul>
          {itemsToDisplay.map((item, i) => {
            return (
              <li
                key={item.id}
                className={`${i === selectedIndex ? "selected" : ""} ${s.itemList}`}
                style={{
                  opacity: isOutside && i === selectedIndex ? "60%" : undefined,
                  cursor: item.modifiable ? "pointer" : undefined,
                }}
                onDoubleClick={() =>
                  item.modifiable ? setEditedItem(item) : undefined
                }
                title={
                  item.modifiable
                    ? "Double-click pour modifier"
                    : "Ne peut pas être modifié"
                }
                role={item.modifiable ? "button" : undefined}
                onClick={() => setSelectedIndex(i)}
              >
                {renderItem(item, i)}
              </li>
            );
          })}
        </ul>
      </div>
      {isCategory && <h5>{MESSAGE.category}</h5>}
      <Modal
        isOpen={editedItem !== null}
        title="Modification"
        width={isCategory ? 700 : 900}
      >
        {editedItem && updateForm(editedItem, () => setEditedItem(null))}
      </Modal>
    </div>
  );
}
