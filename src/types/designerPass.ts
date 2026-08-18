export type DesignerPassVariant = 'brown' | 'gold' | 'ivory' | 'navy';

export interface DesignerPass {
  no: string;
  tier: string;
  colorway: string;
  variant: DesignerPassVariant;
  designerName: string;
  track: string;
  issueDate: string;
}
