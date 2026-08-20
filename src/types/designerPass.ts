export type DesignerPassVariant = 'brown' | 'gold' | 'ivory' | 'navy';

export interface DesignerPass {
  no: string;
  variant: DesignerPassVariant;
  designerName: string;
  issueDate: string;
}
