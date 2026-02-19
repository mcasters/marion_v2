"use client";

import React, { useRef, useState } from "react";
import style from "@/components/admin/admin.module.css";
import s from "./chatMessage.module.css";
import {
  addMessage,
  deleteMessage,
  updateMessage,
} from "@/app/actions/messages";
import { useSession } from "@/app/context/sessionProvider";
import { useTheme } from "@/app/context/themeProvider";
import { Message } from "@/lib/type";
import ChatMessage from "@/components/admin/chatMessage/chatMessage";
import { getEmptyMessage } from "@/lib/utils/commonUtils.ts";
import useMenuManagement from "@/components/hooks/useMenuManagement.ts";

type Props = {
  dbMessages: Message[];
};

export default function ChatMessages({ dbMessages }: Props) {
  const session = useSession();
  const theme = useTheme();
  const textAreaRef = useRef<HTMLTextAreaElement>(null!);
  const [editMessage, setEditMessage] = useState<Message>(getEmptyMessage());
  const { indexOpen, toggle } = useMenuManagement();

  const onUpdate = (msg: Message) => {
    setEditMessage(msg);
    toggle(-1);
    textAreaRef.current.focus();
  };

  const onDelete = async (msg: Message) => {
    await deleteMessage(msg.id);
    setEditMessage(getEmptyMessage());
    toggle(-1);
  };

  const addUpdateAction = async (formData: FormData) => {
    if (editMessage.text !== "") {
      const action = editMessage?.id !== 0 ? updateMessage : addMessage;
      await action(formData);
      setEditMessage(getEmptyMessage());
    }
  };

  return (
    <section className={style.container}>
      <div className={s.messagesHeader}>
        <div className={s.shadow} />
      </div>
      <div className={`${s.messages} area`}>
        {dbMessages &&
          dbMessages.map((msg, index) => {
            const isOwner = msg.author.email === session?.user.email;

            return (
              <ChatMessage
                key={index}
                message={msg}
                editMessage={
                  isOwner
                    ? {
                        onUpdate: () => onUpdate(msg),
                        onDelete: () => onDelete(msg),
                        onOpenMenu: () => toggle(index),
                        onCloseMenu: () => toggle(-1),
                        isOpen: index === indexOpen,
                      }
                    : undefined
                }
              />
            );
          })}
      </div>
      <br />
      <form action={addUpdateAction}>
        <input type="hidden" name="userEmail" value={session?.user.email} />
        <input type="hidden" name="id" value={editMessage.id} />
        <textarea
          ref={textAreaRef}
          name="text"
          placeholder="Ton message"
          value={editMessage.text}
          onChange={(e) =>
            setEditMessage({ ...editMessage, text: e.target.value })
          }
          className={s.textArea}
          rows={5}
        />
        <br />
        <button
          type="submit"
          className={s.chatButton}
          style={{ backgroundColor: theme.other.main.text }}
        >
          {editMessage.id !== 0 ? "Mettre à jour" : "Envoyer"}
        </button>
        <button
          onClick={() => setEditMessage(getEmptyMessage())}
          className={s.chatButton}
          style={{ backgroundColor: theme.other.main.text }}
        >
          Annuler
        </button>
      </form>
    </section>
  );
}
