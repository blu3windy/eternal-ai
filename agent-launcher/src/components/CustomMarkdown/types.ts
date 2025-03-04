import { ReactNode } from "react";

export type Child = ReactNode | string | null | undefined;

export interface CustomComponentProps {
  children?: Array<Child> | Child;
  node?: Element | undefined;
}
