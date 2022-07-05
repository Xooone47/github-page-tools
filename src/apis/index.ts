import {get} from './request';

export const apiGetTest = params => get('/rest/v1/demo', params);
