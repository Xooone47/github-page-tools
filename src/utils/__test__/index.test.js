import {formatDate, formatDateTime} from '../index';

describe('formatDate', () => {
    test('basic', () => {
        expect(formatDate(1578154927628)).toBe('2020-01-05');
    });
});

describe('formatDateTime', () => {
    test('basic', () => {
        expect(formatDateTime(1578154927628)).toBe('2020-01-05 00:22:07');
    });
});
