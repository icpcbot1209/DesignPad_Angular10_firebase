import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAuthComponent } from './admin-auth/admin-auth.component';
import { AdminRoutingModule } from './admin.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UploaderModule } from './uploader/uploader.module';

@NgModule({
  declarations: [AdminAuthComponent, DashboardComponent],
  imports: [CommonModule, AdminRoutingModule, UploaderModule],
})
export class AdminModule {}
