import { Descendant } from "slate";
import { ComponentType } from "../../slate";

export type BlockQuoteElement = {
  type: ComponentType.BlockQuote;
  children: Descendant[];
};
