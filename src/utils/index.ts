import moment from 'moment';

export const formatDate = (date: any): string => moment(date).format('YYYY-MM-DD');

export const formatDateTime = (date: any): string => moment(date).format('YYYY-MM-DD HH:mm:ss');

export const sleep = (second: number): Promise<void> => {
    return new Promise((resolve: any) => {
        setTimeout(
            resolve,
            second * 1000
        );
    });
};
