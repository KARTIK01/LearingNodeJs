
import config from '../config'

export class CustomMailer{
    constructor(mailConfig){
        mailConfig = mailConfig || config.get('mail');
    }
}