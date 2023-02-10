import Api from './Api';
import Student from '../../../types/student';
import { AxiosResponse } from 'axios';

interface StudentForApi {
  name: string;
  instrument: {id: number;};
  user: {id: number;};
  classFormat: {id: number};
}

abstract class StudentApi extends Api {
  static async getAll (): Promise<AxiosResponse<Student[]> | void> {
    return this.fetchApi('GET', '/students');
  }

  static async create (student: StudentForApi): Promise<AxiosResponse<Student> | void> {
    return this.fetchApi('POST', '/students/create', student);
  }

  static async update (id: number, student: StudentForApi): Promise<AxiosResponse<Student> | void> {
    return this.fetchApi('PUT', `/students/${id}`, student);
  }

  static async delete (id: number): Promise<AxiosResponse<void> | void> {
    return this.fetchApi('DELETE', `/students/${id}`);
  }
}

export default StudentApi;
