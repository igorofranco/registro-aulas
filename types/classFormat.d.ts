import User from './user';

interface ClassFormat {
  id?: number;
  modality: string;
  timeMinutes: string;
  price: number;
  user: User;
}

export default ClassFormat;
