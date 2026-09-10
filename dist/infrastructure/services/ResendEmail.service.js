import { Resend } from "resend";
const { RESEND_API_KEY } = process.env;
export class ResendEmailService {
    resend;
    constructor() {
        this.resend = new Resend(RESEND_API_KEY);
    }
    async send(params) {
        await this.resend.emails.send({
            from: "onboarding@resend.dev",
            ...params
        });
    }
}
