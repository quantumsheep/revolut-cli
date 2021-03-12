import * as api from '../api';

export interface TokenDTO {
  accessToken: string;
  tokenExpiryDate: number;
  user: {
    id: string;
    state: string;
  };
}

export async function token(phone: string, password: string, tokenId: string) {
  return await api.request<TokenDTO>('POST', '/token', {
    disableAuth: true,
    body: {
      phone,
      password,
      tokenId,
    },
  });
}
