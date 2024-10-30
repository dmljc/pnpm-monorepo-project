import { request } from '../../utils/request';

export const register = (data: any): Promise<any> => {
    return request.post('/user/register', data);
};
