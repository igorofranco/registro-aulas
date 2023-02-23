import User from './user';

interface ClassFormat {
  id?: number;
  modality: string;
  timeMinutes: number;
  price: number;
  user: User;
}

export default ClassFormat;
