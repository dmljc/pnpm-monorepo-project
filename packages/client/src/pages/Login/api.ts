import { request } from '../../utils/request';

export const login = (data: any): Promise<any> => {
    return request.post('/user/login', data);
};
