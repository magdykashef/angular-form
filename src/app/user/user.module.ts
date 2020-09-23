import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditModule } from './edit/edit.module';
import { ProfileModule } from './profile/profile.module';
import { RegisterModule } from './register/register.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RegisterModule,
    ProfileModule,
    EditModule,
  ]
})
export class UserModule { }
