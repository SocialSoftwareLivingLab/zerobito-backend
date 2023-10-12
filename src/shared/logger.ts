import { createLogger, format, Logger, transport} from 'winston';
import { TransformableInfo } from 'logform';
import DailyRotateFile from 'winston-daily-rotate-file';
import moment from 'moment';
import {env} from '../config/configs';

const { combine, printf, label, colorize } = format; // usadas para formatar a mensagem do log

const transports = new DailyRotateFile({
    dirname: './logs',
    filename: 'application-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH-MM',
    zippedArchive: true,
    maxSize: '10m',
  
});

/*
Este evento é disparado quando o arquivo de log rotativo é girado.
O código neste evento imprime uma mensagem no console informando que o arquivo de log foi girado.
*/

transports.on('rotate', (oldFilename, newFilename) => { 

    console.log(
        `${moment
            .tz(moment(), env.general.TIMEZONE)
            .format()} [Info] Rotating log file ${oldFilename} into ${newFilename}`,      
    );
});


const msgTemplate = printf((info: TransformableInfo) => {
    const date = moment.tz(moment(), env.general.TIMEZONE).format();
    return `=> ${date} [${info.level}] ${info.label as string}: ${info.message}`;
  });


  type LoggerConfig = {
    context: string;
};

const logger = (config: LoggerConfig): Logger =>{
    return createLogger({
        level : 'info',
        format: combine(colorize(), label({label: config.context}), msgTemplate),
        transports: [transports, new transports.Console()],

    });
};

export default logger;
