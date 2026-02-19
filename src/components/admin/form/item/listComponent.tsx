"use client";

import React, { Fragment, useMemo, useState } from "react";
import s from "@/components/admin/adminList.module.css";
import { Category, Item, Type } from "@/lib/type";
import RowListComponent from "@/components/admin/form/item/rowListComponent";
import useOnClickOutside from "@/components/hooks/useOnClickOutside.ts";
import FilterWorkListComponent from "@/components/admin/form/item/filterWorkListComponent.tsx";
import WorkForm from "@/components/admin/form/item/workForm.tsx";
import CategoryForm from "@/components/admin/form/item/categoryForm.tsx";
import PostForm from "@/components/admin/form/item/postForm.tsx";
import Modal from "@/components/admin/form/modal.tsx";
import useKeyboard from "@/components/hooks/useKeyboard.ts";
import useListSelection from "@/components/hooks/useListSelection.ts";
import { worksIsEmpty } from "@/lib/utils/commonUtils.ts";

interface Props {
  items: Item[];
  categories?: Category[];
}

export default function ListComponent({ items, categories }: Props) {
  const { ref, isOutside } = useOnClickOutside();
  const { selectedIndex, decrease, increase, setSelectedIndex } =
    useListSelection(items);
  useKeyboard("ArrowUp", decrease, !isOutside);
  useKeyboard("ArrowDown", increase, !isOutside);

  const type = items[0].type;
  const filter = !!categories;
  const isEmpty = worksIsEmpty(items);
  const [itemsToDisplay, setItemsToDisplay] = useState<Item[]>(
    isEmpty ? [] : items,
  );

  const [openedItem, setOpenedItem] = useState<Item>(null);

  const updateModal = useMemo(() => {
    return (
      <Modal isOpen={openedItem} title={`Modification de ${type}}`}>
        {type === Type.CATEGORY ? (
          <CategoryForm
            category={openedItem}
            onClose={() => setOpenedItem(null)}
          />
        ) : type === Type.POST ? (
          <PostForm post={openedItem} onClose={() => setOpenedItem(null)} />
        ) : (
          <WorkForm
            item={openedItem}
            categories={categories}
            onClose={() => setOpenedItem(null)}
          />
        )}
      </Modal>
    );
  }, [openedItem]);

  return (
    <>
      {!isEmpty && filter && (
        <>
          <FilterWorkListComponent
            items={items}
            categories={categories}
            onFilteredItems={setItemsToDisplay}
          />
          <br />
          <h4>{`Filtre : ${itemsToDisplay.length} ${type}s`}</h4>
        </>
      )}
      <div
        ref={ref}
        className={`${type === Type.CATEGORY ? s.categoryListWrapper : s.itemListWrapper} ${s.listWrapper} area`}
      >
        {itemsToDisplay.map((item, i) => {
          const noCategory =
            type === Type.CATEGORY && item.key === "no-category";
          return (
            <RowListComponent
              key={item.id}
              item={item}
              isSelected={selectedIndex === i}
              mouseOutside={isOutside}
              categories={categories}
              onClick={() => setSelectedIndex(i)}
              onDoubleClick={
                noCategory ? undefined : (item: Item) => setOpenedItem(item)
              }
            />
          );
        })}
      </div>
      {updateModal}
    </>
  );
}
