import client from './axiosApi';

export interface IotStatus {
  online: boolean;
  lastSeen?: string;
  data?: any;
}

const base = '/iot';

export const iotService = {
  async status(): Promise<IotStatus> {
    const { data } = await client.get(`${base}/status`);
    return data;
  },
  async sendEvent(payload: Record<string, any>): Promise<any> {
    const { data } = await client.post(`${base}/event`, payload);
    return data;
  },
};
