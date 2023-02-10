import Api from './Api';
import User from '../../../types/user';

interface UserForApi {
  name: string;
  email: string;
  password: string;
}

type Token = string;

interface Credentials {
  email: string;
  password: string;
}

abstract class UserApi extends Api {
  static async create (user: UserForApi): Promise<User> {
    return this.fetchApi('POST', '/users/create', user);
  }

  static async attemptLogin (credentials: Credentials): Promise<Token> {
    return this.fetchApi('POST', '/login', credentials).then(res => res.token);
  }
}

export default UserApi;
