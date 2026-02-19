"use client";
import React, { createContext, ReactNode, useContext, useState } from "react";
import AlertModal from "@/components/admin/alertModal/alertModal";

export type AlertContextType = (
  message: string,
  isError: boolean,
  time?: number,
) => void;

const AlertContext = createContext<AlertContextType>(() => {});

interface Props {
  children: ReactNode;
}

export function AlertProvider({ children }: Props) {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [time, setTime] = useState(2000);
  const [isOpen, setIsOpen] = useState(false);

  const alert = (message: string, isError: boolean, time: number = 2000) => {
    setMessage(message);
    setIsError(isError);
    setTime(time);
    setIsOpen(true);
  };

  return (
    <AlertContext.Provider value={alert}>
      {isOpen && (
        <AlertModal
          message={message}
          isError={isError}
          time={time}
          onClose={() => setIsOpen(false)}
        />
      )}
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}
