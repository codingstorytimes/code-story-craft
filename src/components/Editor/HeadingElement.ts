import { Descendant } from "slate";
import { ComponentType } from "./slate";

export type HeadingElement = {
  type: ComponentType.Heading;
  slug: string;
  children: Descendant[];
};

export type HeadingOneElement = {
  type: ComponentType.HeadingOne;
  children: Descendant[];
};

export type HeadingTwoElement = {
  type: ComponentType.HeadingTwo;
  children: Descendant[];
};

export type HeadingThreeElement = {
  type: ComponentType.HeadingThree;
  children: Descendant[];
};

export type HeadingFourElement = {
  type: ComponentType.HeadingFour;
  children: Descendant[];
};

export type HeadingFiveElement = {
  type: ComponentType.HeadingFive;
  children: Descendant[];
};
export type HeadingSixElement = {
  type: ComponentType.HeadingSix;
  children: Descendant[];
};
