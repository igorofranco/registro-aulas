import Api from './Api';
import Instrument from '../types/instrument';

abstract class InstrumentApi extends Api {
  static async getAll (): Promise<Instrument[]> {
    return this.fetchApi('GET', '/instruments').then(res => res.data.content);
  }

  static async create (instrument: string): Promise<Instrument> {
    return this.fetchApi('PUT', '/instruments/create', { instrument });
  }

  static async update (id: number, instrument: string): Promise<Instrument> {
    return this.fetchApi('POST', `/instruments/${id}`, { instrument });
  }
}

export default InstrumentApi;
