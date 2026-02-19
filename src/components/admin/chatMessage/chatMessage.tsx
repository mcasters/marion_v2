import React from "react";
import s from "./chatMessage.module.css";
import { useTheme } from "@/app/context/themeProvider";
import { Message } from "@/lib/type";
import MoreIcon from "@/components/icons/moreIcon";
import ChatMessageMenu from "@/components/admin/chatMessage/chatMessageMenu.tsx";

type Props = {
  message: Message;
  editMessage?: {
    onUpdate: () => void;
    onDelete: () => Promise<void>;
    onOpenMenu: () => void;
    onCloseMenu: () => void;
    isOpen: boolean;
  };
};

export default function ChatMessage({ message, editMessage }: Props) {
  const theme = useTheme();

  return (
    <div className={editMessage ? s.textLeft : s.textRight}>
      <p
        className={s.authorName}
        style={{
          color: editMessage ? theme.other.main.text : theme.other.main.link,
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
          backgroundColor: editMessage
            ? theme.other.main.text
            : theme.other.main.link,
        }}
      >
        {editMessage && (
          <>
            <button className={s.moreButton} onClick={editMessage?.onOpenMenu}>
              <MoreIcon />
            </button>
            {editMessage?.isOpen && (
              <ChatMessageMenu
                onUpdate={editMessage?.onUpdate}
                onDelete={async () => editMessage?.onDelete()}
                onCloseMenu={editMessage?.onCloseMenu}
              />
            )}
          </>
        )}
        {message.text}
      </div>
    </div>
  );
}
