import Api from './Api';
import Student from '../types/student';
import userStore from '../store/userStore';

export interface StudentForApi {
  name: string;
  daysOfWeek: string;
  instrument: {id: number;};
  user: {id: number;};
  classFormat: {id: number};
}

abstract class StudentApi extends Api {
  static async getAll (): Promise<Student[]> {
    return this.fetchApi(
      'GET', `/students/user?id=${userStore.getState().id}`)
      .then(res => res.data.content);
  }

  static async create (student: StudentForApi): Promise<Student> {
    return this.fetchApi('POST', '/students/create', student).then(res => res.data);
  }

  static async update (id: number, student: StudentForApi): Promise<Student> {
    return this.fetchApi('PUT', `/students/${id}`, student);
  }

  static async delete (id: number): Promise<void> {
    return this.fetchApi('DELETE', `/students/${id}`);
  }
}

export default StudentApi;
