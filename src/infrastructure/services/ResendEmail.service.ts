import type { EmailService, SendRequestAttributes } from "@domain/services/EmailService.js";
import { Resend } from "resend";

const { RESEND_API_KEY } = process.env;

export class ResendEmailService implements EmailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(RESEND_API_KEY);
    }
    async send(params: SendRequestAttributes): Promise<void> {
        await this.resend.emails.send({
            from:"onboarding@resend.dev",
            ...params
        });
    }
}