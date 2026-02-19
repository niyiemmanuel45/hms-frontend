export interface EmailNotification {
    id: number;
    name: string;
    smtpport: string;
    smtpServer: string;
    smtpUserName: string;
    smtpPassword: string;
    mailFromName: string;
    mailFromEmail: string;
}

export interface EmailNotificationDto {
    name: string;
    smtpport: string;
    smtpServer: string;
    smtpUserName: string;
    smtpPassword: string;
    mailFromName: string;
    mailFromEmail: string;
}