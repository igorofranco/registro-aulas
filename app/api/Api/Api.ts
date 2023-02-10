import axios from 'axios';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

abstract class Api {
  private static baseUrl = 'http://localhost:8081';

  protected static async fetchApi (
    method: RequestMethod,
    endpoint: string,
    data?: any,
    headers?: any
  ): Promise<any> {
    return axios.request({
      url: this.baseUrl + endpoint,
      headers,
      data,
      method
    });
  }
}

export default Api;
