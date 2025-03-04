export type Child = Element | string | null | undefined;

export interface CustomComponentProps {
  children?: Array<Child> | Child;
  node?: Element | undefined;
}
