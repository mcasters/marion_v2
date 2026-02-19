import React, { ReactNode, useRef, useState } from "react";
import s from "@/components/admin/admin.module.css";

type Props = {
  onFile: (file: File) => void;
  children?: ReactNode;
};

export default function DropFile({ onFile, children }: Props) {
  const dropRef = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState<boolean>(false);

  const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(true);
  };

  const drop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    let file = null;
    if (e.dataTransfer) {
      if (e.dataTransfer.items) {
        if (e.dataTransfer.items[0].kind === "file") {
          file = e.dataTransfer.items[0].getAsFile();
        }
      } else {
        file = e.dataTransfer.files[0];
      }
      if (file) onFile(file);
      setIsOver(false);
    }
  };
  const dragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
  };

  return (
    <div
      ref={dropRef}
      className={isOver ? `${s.dropZoneOver} ${s.dropZone}` : s.dropZone}
      onDragOver={dragOver}
      onDrop={drop}
      onDragLeave={dragLeave}
    >
      Glisser la photo ici (ou utiliser le bouton)
      {children}
    </div>
  );
}
