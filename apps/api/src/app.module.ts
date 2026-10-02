import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { RootController } from './root.controller';
import { SharedModule } from './common/shared.module';
import { AuthModule } from './auth/auth.module';
import { ChildrenModule } from './children/children.module';
import { ConsentModule } from './consent/consent.module';
import { GdprModule } from './gdpr/gdpr.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Terminus fournit le healthcheck (Lot A.4).
    TerminusModule,
    // Repository global (instance unique partagée entre modules métier).
    SharedModule,
    // Modules du Lot C (auth & consentement RGPD/COPPA).
    AuthModule,
    ChildrenModule,
    ConsentModule,
    GdprModule,
  ],
  controllers: [HealthController, RootController],
})
export class AppModule {}
