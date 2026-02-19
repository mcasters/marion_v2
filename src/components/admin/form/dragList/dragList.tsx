import { Fragment, useMemo, useState } from "react";
import s from "./dragList.module.css";
import useOnClickOutside from "@/components/hooks/useOnClickOutside.ts";
import { DragListElement } from "@/lib/type.ts";
import { sortDragList } from "@/lib/utils/commonUtils.ts";
import { sortList } from "@/lib/utils/themeUtils.ts";

interface Props {
  list: DragListElement[];
  onChangeOrder: (map: Map<number, number>) => void;
}

export default function DragList({ list, onChangeOrder }: Props) {
  const { ref } = useOnClickOutside(() => setSelectedIndex(-1));
  const _list = useMemo(() => sortDragList(list), [list]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropZoneIndex, setDropZoneIndex] = useState(-1);

  function handleSort() {
    if (dropZoneIndex !== -1 && selectedIndex !== dropZoneIndex) {
      const { map, newIndex } = sortList(_list, selectedIndex, dropZoneIndex);
      setSelectedIndex(newIndex);
      onChangeOrder(map);
    }
    setDropZoneIndex(-1);
  }

  return (
    <div ref={ref} className={s.list}>
      {_list.map((item, index) => (
        <Fragment key={index}>
          <div
            className={`${s.item} ${selectedIndex === index ? s.focus : undefined}`}
            draggable
            onClick={() => setSelectedIndex(index)}
            onDragStart={() => setSelectedIndex(index)}
          >
            {item.element}
          </div>
          <div
            className={`${s.dropZone} ${dropZoneIndex === index + 1 ? s.hover : undefined}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDropZoneIndex(index + 1);
            }}
            onDragLeave={() => setDropZoneIndex(-1)}
            onDrop={handleSort}
          >
            <div className={s.line} />
          </div>
        </Fragment>
      ))}
    </div>
  );
}
