export interface Plan {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
}

export function createPlan(params: Partial<Plan>) {
  return {

  } as Plan;
}
