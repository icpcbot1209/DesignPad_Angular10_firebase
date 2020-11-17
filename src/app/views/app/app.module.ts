import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { UploaderModule } from 'src/app/components/uploader/uploader.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DesignPanelComponent } from './design-panel/design-panel.component';
import { PageComponent } from './page/page.component';

@NgModule({
  declarations: [AppComponent, SidebarComponent, DesignPanelComponent, PageComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    LayoutContainersModule,
    UploaderModule,
  ],
})
export class AppModule {}
