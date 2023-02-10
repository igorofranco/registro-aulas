import Api from './Api';
import ClassFormat from '../../../types/classFormat';

interface ClassFormatForApi {
  modality: string,
  timeMinutes: number,
  price: number,
  user: { id: number }
}

abstract class ClassFormatApi extends Api {
  static async getAll (): Promise<ClassFormat[]> {
    return this.fetchApi('GET', '/formats');
  }

  static async create (student: ClassFormatForApi): Promise<ClassFormat> {
    return this.fetchApi('POST', '/formats/create', student);
  }

  static async update (id: number, student: ClassFormatForApi): Promise<ClassFormat> {
    return this.fetchApi('PUT', `/formats/${id}`, student);
  }

  static async delete (id: number): Promise<void> {
    return this.fetchApi('DELETE', `/formats/${id}`);
  }
}

export default ClassFormatApi;
