"use client";

import React, { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { Admin, Type } from "@/lib/type.ts";
import s from "@/components/admin/adminList.module.css";
import useOnClickOutside from "@/components/hooks/useOnClickOutside.ts";
import useListSelection from "@/components/hooks/useListSelection.ts";
import useKeyboard from "@/components/hooks/useKeyboard.ts";
import Modal from "@/components/admin/common/modal.tsx";

interface SelectableListProps<T extends Admin> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  renderFilter?: (
    handleFilter: Dispatch<SetStateAction<T[]>>,
  ) => React.ReactNode;
  updateForm: (item: T, handleCloseAction: () => void) => React.ReactNode;
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

  const [openedItem, setOpenedItem] = useState<T | null>(null);
  const [itemsToDisplay, setItemsToDisplay] = useState<T[]>(
    items.length === 1 && items[0].id === 0 ? [] : items,
  );

  return (
    <>
      {renderFilter !== undefined && renderFilter(setItemsToDisplay)}
      <div
        ref={ref}
        className={`${items[0].type === Type.CATEGORY ? s.categoryListWrapper : s.itemListWrapper} ${s.listWrapper} area`}
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
                  item.modifiable ? setOpenedItem(item) : undefined
                }
                title={item.modifiable ? "Modifier" : undefined}
                role={item.modifiable ? "button" : undefined}
                onClick={() => setSelectedIndex(i)}
              >
                {renderItem(item, i)}
              </li>
            );
          })}
        </ul>
      </div>
      {openedItem !== null && (
        <Modal isOpen={true} title="Modification">
          {updateForm(openedItem, () => setOpenedItem(null))}
        </Modal>
      )}
    </>
  );
}
