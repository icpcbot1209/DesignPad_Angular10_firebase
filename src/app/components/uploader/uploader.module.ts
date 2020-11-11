import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { DropzoneDirective } from './dropzone.directive';
import { UploaderComponent } from './uploader/uploader.component';
import { UploadTaskComponent } from './upload-task/upload-task.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [DropzoneDirective, UploaderComponent, UploadTaskComponent],
  imports: [
    CommonModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    PerfectScrollbarModule,
  ],
  exports: [UploaderComponent],
})
export class UploaderModule {}
