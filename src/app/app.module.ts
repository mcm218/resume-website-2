import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import * as Sentry from '@sentry/angular-ivy';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ContactComponent } from './contact/contact.component';
import { SkillsListComponent } from './skills-list/skills-list.component';
import { ExperienceListComponent } from './experience-list/experience-list.component';
import { ExperienceCardComponent } from './experience-card/experience-card.component';
import { SkillCardComponent } from './skill-card/skill-card.component';
import { EducationCardComponent } from './education-card/education-card.component';
import { PhonePipePipe } from './phone-pipe.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WipAlertComponent } from './wip-alert/wip-alert.component';
import { SvgRendererComponent } from './svg-renderer/svg-renderer.component';
import { FilterToolbarComponent } from './filter-toolbar/filter-toolbar.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { AuthInterceptorProvider } from './interceptors/auth.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        ContactComponent,
        SkillsListComponent,
        ExperienceListComponent,
        ExperienceCardComponent,
        SkillCardComponent,
        EducationCardComponent,
        PhonePipePipe,
        WipAlertComponent,
        SvgRendererComponent,
        FilterToolbarComponent,
        HomeComponent,
        AdminComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FontAwesomeModule,
        BrowserAnimationsModule,
        HttpClientModule,
    ],
    providers: [
        {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler({
                showDialog: true,
            }),
        },
        {
            provide: Sentry.TraceService,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: () => () => {},
            deps: [Sentry.TraceService],
            multi: true,
        },
        AuthInterceptorProvider
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
