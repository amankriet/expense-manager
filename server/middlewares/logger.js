import fs from 'fs'
import path from "path"
import { format } from "date-fns";
import { v4 as uuidV4 } from "uuid";

const logger = (message, logName = 'eventLogs.txt') => {
    const dateTime = `${format(new Date(), "yyyy-MM-dd hh:mm:ss")}`
    const logItem = `${dateTime}\t${uuidV4()}\t${message}\n`

    try {
        const logsPath = path.resolve(path.resolve(), '..', "logs");
        if (!fs.existsSync(logsPath)) {
            fs.mkdirSync(logsPath)
            console.log(logsPath)
        }

        fs.appendFileSync(path.join(logsPath, logName), logItem);
        console.log(logItem)
    } catch (error) {
        console.error(error);
    }
}

export default logger;