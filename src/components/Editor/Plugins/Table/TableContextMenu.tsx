import React, { useState, useRef, useEffect } from "react";

import { Trash2, Rows, Columns, Minus } from "lucide-react";

// -----------------------------
// MenuItemView Component
function MenuItemView({
  onClick,
  icon,
  children,
  danger,
}: {
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        padding: "8px 10px",
        borderRadius: 8,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: danger ? "#c91f37" : "inherit",
        textAlign: "left",
      }}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

// -----------------------------
// TableContextMenu Component
export function TableContextMenu({ element, editor, children }: any) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement | null>(null);

  const onContext = (e: React.MouseEvent) => {
    e.preventDefault();
    setPos({ x: e.clientX + 4, y: e.clientY + 4 });
    setVisible(true);
  };

  const close = () => setVisible(false);

  useEffect(() => {
    if (!visible) return;

    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) close();
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [visible]);

  return (
    <div onContextMenu={onContext} style={{ position: "relative" }}>
      {children}

      {visible && (
        <div
          ref={ref}
          style={{
            position: "fixed",
            left: pos.x,
            top: pos.y,
            zIndex: 9999,
            background: "white",
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            borderRadius: 10,
            padding: 8,
            minWidth: 160,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
          role="menu"
          aria-hidden={!visible}
        >
          <MenuItemView
            onClick={editor.table.tableUtils.addRow}
            icon={<Rows size={16} />}
          >
            Add row
          </MenuItemView>
          <MenuItemView
            onClick={editor.table.tableUtils.deleteRow}
            icon={<Minus size={16} />}
          >
            Delete row
          </MenuItemView>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #eee",
              margin: "6px 0",
            }}
          />
          <MenuItemView
            onClick={editor.table.tableUtils.addColumn}
            icon={<Columns size={16} />}
          >
            Add column
          </MenuItemView>
          <MenuItemView
            onClick={editor.table.tableUtils.deleteColumn}
            icon={<Minus size={16} />}
          >
            Delete column
          </MenuItemView>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #eee",
              margin: "6px 0",
            }}
          />
          <MenuItemView
            onClick={editor.table.tableUtils.deleteTable}
            icon={<Trash2 size={16} />}
            danger
          >
            Delete table
          </MenuItemView>
        </div>
      )}
    </div>
  );
}
