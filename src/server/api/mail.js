import _ from "lodash";
import error from "../errors";


function sendMail(object, options) {

};


let apiMail = {

    /**
     * Send Mail
     * @param object
     * @param options
     * @return {Promise.<{message}>}
     */
    async sendMail(object, options){
        let { mail: mailData }=  object;
        if (_.isEmpty(mailData)) throw new error.ValidationError({ message:'Mail body is required.' });

        let { message } =  mailData;
        if (_.isEmpty(message)) throw new error.ValidationError({ message:'Mail Message info os missing.' });

        let result = await sendMail(object, options);

        return {
            "message":result.message
        };
    },

    async sendTestMail(object, options){

        let content = mail.utils.generateContent({ template:'test' });
        let payload = {
            mail:{
                message:{
                    to:'kartikagarwal01@gmail.com',
                    subject:'Test Mail',
                    html:content.html,
                    text:content.text
                }
            }
        };

        await sendMail(payload);
    }
};

export  default  apiMail ;