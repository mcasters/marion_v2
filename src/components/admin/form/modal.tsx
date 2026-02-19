"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";

import s from "../modal.module.css";

interface Props {
  children: ReactNode;
  isOpen: boolean;
  title: string;
  onClickOutside?: () => void;
  width?: number;
}

export default function Modal({
  children,
  isOpen,
  title,
  onClickOutside,
  width = 730,
}: Props) {
  const ref = useRef<HTMLDivElement>(null!);
  const [location, setLocation] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [styles, setStyles] = useState({});

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    document.body.style.userSelect = isOpen ? "none" : "unset";
  }, [isOpen]);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget) {
      const boundingRect = e.currentTarget.getBoundingClientRect();
      setLocation({
        x: e.screenX - boundingRect.left,
        y: e.screenY - boundingRect.top,
      });
    }
  };

  const onDrag = (e: React.DragEvent<HTMLDivElement>) => {
    setStyles({ left: e.screenX - location.x, top: e.screenY - location.y });
  };

  return (
    <>
      {isOpen && (
        <div
          className={s.modalOverlay}
          onClick={() => (onClickOutside ? onClickOutside() : undefined)}
        >
          <div
            ref={ref}
            className={s.modalBox}
            style={{ ...styles, width }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            draggable
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragOver={(e) => e.preventDefault()}
          >
            <h2 className={s.modalTitle}>{title}</h2>
            <div draggable onDragStart={(e) => e.preventDefault()}>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
