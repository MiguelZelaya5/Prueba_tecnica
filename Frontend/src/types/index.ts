export interface Requisition {
  id: number;
  code: string;
  title: string;
  estimatedAmount: number;
  priority: number; // 0: Baja, 1: Media, 2: Alta
  status: number;   // 0: Pendiente, 1: Aprobado, 2: Rechazado
  createdAt: string;
  creator: string;  // Modificado: Ahora recibe el nombre del usuario en texto
  adminComments?: string;
}