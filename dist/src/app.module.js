"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const email_module_1 = require("./email/email.module");
const contact_module_1 = require("./contact/contact.module");
const careers_module_1 = require("./careers/careers.module");
const news_module_1 = require("./news/news.module");
const partners_module_1 = require("./partners/partners.module");
const media_module_1 = require("./media/media.module");
const newsletter_module_1 = require("./newsletter/newsletter.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const users_module_1 = require("./users/users.module");
const settings_module_1 = require("./settings/settings.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            email_module_1.EmailModule,
            contact_module_1.ContactModule,
            careers_module_1.CareersModule,
            news_module_1.NewsModule,
            partners_module_1.PartnersModule,
            media_module_1.MediaModule,
            newsletter_module_1.NewsletterModule,
            dashboard_module_1.DashboardModule,
            users_module_1.UsersModule,
            settings_module_1.SettingsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map