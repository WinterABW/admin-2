export interface Solicitud {
  tipo: string | 'seller';
  fecha?: Date;
  aceptada?: boolean;
  estado?: 'pendiente' | 'aceptada' | 'denegada';
  id?: number;
  data: {
    name: string,
    nombre?: string,
    user?: any,
    email: string,
    address: string,
    ci: number,
    account: string,
    type_plattform: string;
  };
}
