export interface SendRequestAttributes {
    to:string,
    subject:string,
    html:string
}

export interface EmailService {
    send(params:SendRequestAttributes):Promise<void>
}