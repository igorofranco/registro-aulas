import Api from './Api';
import ClassFormat from '../types/classFormat';
import userStore from '../store/userStore';

export interface ClassFormatForApi {
  modality: string;
  timeMinutes: number;
  price: number;
  userId: number;
}

abstract class ClassFormatApi extends Api {
  static async getAll (): Promise<ClassFormat[]> {
    return this.fetchApi(
      'GET', `/formats/user?id=${userStore.getState().id}`)
      .then(res => res.data.content);
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
