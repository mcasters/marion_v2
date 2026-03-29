import React from "react";
import s from "./chatMessage.module.css";
import { useTheme } from "@/app/context/themeProvider";
import { Message } from "@/lib/type";
import MoreIcon from "@/components/icons/moreIcon";
import useOnClickOutside from "@/components/hooks/useOnClickOutside.ts";
import { deleteMessage } from "@/app/actions/messages";

type Props = {
  message: Message;
  editableMessage?: {
    onUpdate: () => void;
    openMenu: (arg0: boolean) => void;
    isOpen: boolean;
  };
};

export default function ChatMessage({ message, editableMessage }: Props) {
  const theme = useTheme();
  const { ref } = useOnClickOutside(
    editableMessage ? () => editableMessage.openMenu(false) : undefined,
  );

  return (
    <div className={editableMessage ? s.textLeft : s.textRight}>
      <p
        className={s.authorName}
        style={{
          color: editableMessage
            ? theme.other.main.text
            : theme.other.main.link,
        }}
      >
        {`${message.author.email} - ${new Date(message.date).toLocaleDateString("fr-FR")}${
          message.dateUpdated
            ? " -" +
              ` Mis à jour le ${new Date(message.dateUpdated).toLocaleDateString("fr-FR")}`
            : ""
        }`}
      </p>
      <div
        className={s.message}
        style={{
          backgroundColor: editableMessage
            ? theme.other.main.text
            : theme.other.main.link,
        }}
      >
        {editableMessage && (
          <>
            <button
              className={s.moreButton}
              onClick={() => editableMessage.openMenu(true)}
            >
              <MoreIcon />
            </button>
            {editableMessage.isOpen && (
              <div ref={ref} className={s.menu}>
                <button
                  onClick={editableMessage.onUpdate}
                  className={s.menuItemButton}
                >
                  Modifier
                </button>
                <button
                  onClick={async () => {
                    await deleteMessage(message.id);
                    editableMessage.openMenu(false);
                  }}
                  className={s.menuItemButton}
                >
                  Supprimer
                </button>
              </div>
            )}
          </>
        )}
        {message.text}
      </div>
    </div>
  );
}
