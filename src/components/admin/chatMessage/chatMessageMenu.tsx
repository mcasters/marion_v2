import React from "react";
import s from "./chatMessage.module.css";
import useOnClickOutside from "@/components/hooks/useOnClickOutside.ts";

type Props = {
  onUpdate: () => void;
  onDelete: () => Promise<void>;
  onCloseMenu: () => void;
};

export default function ChatMessageMenu({
  onUpdate,
  onDelete,
  onCloseMenu,
}: Props) {
  const { ref } = useOnClickOutside(onCloseMenu);

  return (
    <div ref={ref} className={s.menu}>
      <button onClick={onUpdate} className={s.menuItemButton}>
        Modifier
      </button>
      <button onClick={onDelete} className={s.menuItemButton}>
        Supprimer
      </button>
    </div>
  );
}
