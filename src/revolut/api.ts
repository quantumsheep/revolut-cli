import axios, { Method } from 'axios';
import * as config from '../config';

export const API_ENDPOINT = 'https://api.revolut.com';

export interface RequestConfig {
  disableAuth?: boolean;
  body?: Record<string, string | number>;
  queries?: string | Record<string, string> | string[][] | URLSearchParams;
}

export async function request<T>(method: Method, path: string, requestConfig?: RequestConfig) {
  const search = new URLSearchParams(requestConfig?.queries);

  const headers: Record<string, string> = {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:86.0) Gecko/20100101 Firefox/86.0',
    'x-browser-application': 'WEB_CLIENT',
    'x-client-version': '100.0',
    'x-device-id': await config.get('deviceId'),
  };

  if (!requestConfig?.disableAuth) {
    const accessToken = await config.get('accessToken');
    const user = await config.get('user');

    if (accessToken && user?.id) {
      headers['authorization'] = `Basic ${Buffer.from(`${user.id}:${accessToken}`).toString('base64')}`;
    }
  }

  try {
    const { data } = await axios.request<T>({
      method,
      url: `${API_ENDPOINT}${path}${search ? `?${search}` : ''}`,
      data: requestConfig?.body,
      headers,
    });

    return data;
  } catch (e) {
    throw e?.response?.data?.message ?? e;
  }
}
