import Instrument from './instrument';
import ClassFormat from './classFormat';
import User from './user';

interface Student {
  id?: number;
  name: string;
  daysOfWeek?: string;
  instrument: Instrument;
  classFormat: ClassFormat;
  user: User; // professor
}

export default Student;
