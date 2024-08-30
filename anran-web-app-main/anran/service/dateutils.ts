import moment_cli from 'moment';
import moment from 'moment-timezone';

export const dateAsString = (date: any) => {
    if (date && date instanceof Date) {
        return moment_cli(date).format('YYYY-MM-DD HH:mm:ss');
    } else {
        return null;
    }
};

export const stringasUTC = (date: any) => {
    if (date) {
        return new Date(moment(date).utc().format('YYYY-MM-DD HH:mm:ss'));
    } else {
        return null;
    }
};