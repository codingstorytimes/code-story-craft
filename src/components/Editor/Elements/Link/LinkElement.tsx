import React, { useState, useMemo, useEffect, useRef, MouseEvent } from "react";
import {
  Editor,
  Transforms,
  Element as SlateElement,
  Range,
  Path,
  Node,
  Descendant,
} from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";

import {
  ComponentType,
  CustomEditor,
  CustomElement,
  CustomText,
  RenderSlateElementProps,
} from "../../slate";

// -----------------------------

export type LinkElement = { type: "link"; url: string; children: Descendant[] };

export const LinkEvents = { OPEN: "slate.link.open" } as const;

// -----------------------------
// Render link element
// -----------------------------

export const RenderLinkElement = ({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: any;
  element: LinkElement;
}) => {
  return (
    <span
      {...attributes}
      contentEditable={false}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(
          new CustomEvent(LinkEvents.OPEN, { detail: { node: element } })
        );
      }}
    >
      <a
        href={element.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        {children}
      </a>
    </span>
  );
};
