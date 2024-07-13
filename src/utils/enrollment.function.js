import moment from "moment";
import { ApiError } from "./ApiError.js";

const calculateEndDate = (startDate, courseDuration) => {
    let durationInMonth;
    switch (courseDuration) {
        case 'ONE_MONTH':
            durationInMonth = 1;
            break;
        case 'THREE_MONTHS':
            durationInMonth = 3;
            break;
        case 'SIX_MONTHS':
            durationInMonth = 6;
            break;
        case 'TWELVE_MONTHS':
            durationInMonth = 12;
            break;
        default:
            throw new ApiError(400,"Invalid course duration")
    }

    const endDate = moment(startDate).add(durationInMonth, 'months').toDate();
    return endDate;
}

export { calculateEndDate };

