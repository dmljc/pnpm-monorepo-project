import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, Transporter } from "nodemailer";

@Injectable()
export class EmailService {
    transporter: Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = createTransport({
            host: this.configService.get("EMAIL_HOST"),
            port: this.configService.get("EMAIL_PORT"),
            secure: false, // 这个boolean配置从 .env文件中读取的时候报错
            auth: {
                user: this.configService.get("EMAIL_USER"),
                pass: this.configService.get("EMAIL_PASS"),
            },
        });
    }

    async sendMail({ to, subject, html }) {
        await this.transporter.sendMail({
            from: {
                name: this.configService.get("EMAIL_NAME"),
                address: this.configService.get("EMAIL_USER"),
            },
            to,
            subject,
            html,
        });
    }
}
