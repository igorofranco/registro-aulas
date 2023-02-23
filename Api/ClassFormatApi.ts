import Api from './Api';
import ClassFormat from '../types/classFormat';

export interface ClassFormatForApi {
  modality: string,
  timeMinutes: string,
  price: number,
  user: { id: number }
}

abstract class ClassFormatApi extends Api {
  static async getAll (): Promise<ClassFormat[]> {
    return this.fetchApi('GET', '/formats').then(res => res.data.content);
  }

  static async create (format: ClassFormatForApi): Promise<ClassFormat> {
    return this.fetchApi('POST', '/formats/create', format).then(res => res.data);
  }

  static async update (id: number, format: ClassFormatForApi): Promise<ClassFormat> {
    return this.fetchApi('PUT', `/formats/${id}`, format);
  }

  static async delete (id: number): Promise<void> {
    return this.fetchApi('DELETE', `/formats/${id}`);
  }
}

export default ClassFormatApi;
