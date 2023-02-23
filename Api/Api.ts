import axios from 'axios';
import store from '../store/userStore';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

abstract class Api {
  private static baseUrl = process.env.NEXT_PUBLIC_HOST;

  protected static async fetchApi (
    method: RequestMethod,
    endpoint: string,
    data?: any,
    headers?: any
  ): Promise<any> {
    const token = store.getState().token;
    return axios.request({
      url: this.baseUrl + endpoint,
      headers: !token ? headers : { ...headers, Authorization: `${token}` },
      data,
      method
    });
  }
}

export default Api;
