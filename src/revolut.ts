import axios, { Method } from 'axios';
import * as config from './config';

export const API_ENDPOINT = 'https://api.revolut.com';

interface RequestConfig {
  body?: Record<string, string | number>;
  queries?: string | Record<string, string> | string[][] | URLSearchParams;
}

async function request<T>(method: Method, path: string, requestConfig?: RequestConfig) {
  const search = new URLSearchParams(requestConfig?.queries);

  try {
    const { data } = await axios.request<T>({
      method,
      url: `${API_ENDPOINT}${path}${search ? `?${search}` : ''}`,
      data: requestConfig?.body,
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:86.0) Gecko/20100101 Firefox/86.0',
        'x-browser-application': 'WEB_CLIENT',
        'x-client-version': '100.0',
        'x-device-id': await config.get('deviceId'),
      },
    });

    return data;
  } catch (e) {
    throw e?.response?.data?.message ?? e;
  }
}

export interface SignInDTO {
  tokenId: string;
}

export async function signin(phone: string, password: string) {
  return await request<SignInDTO>('POST', '/signin', {
    body: {
      channel: 'APP',
      phone,
      password,
    },
  });
}

export interface TokenDTO {
  accessToken: string;
  tokenExpiryDate: number;
  user: {
    id: string;
    state: string;
  };
}

export async function token(phone: string, password: string, tokenId: string) {
  return await request<TokenDTO>('POST', '/token', {
    body: {
      phone,
      password,
      tokenId,
    },
  });
}
