import * as api from '../api';

export interface SignInDTO {
  tokenId: string;
}

export async function signin(phone: string, password: string) {
  return await api.request<SignInDTO>('POST', '/signin', {
    disableAuth: true,
    body: {
      channel: 'APP',
      phone,
      password,
    },
  });
}
