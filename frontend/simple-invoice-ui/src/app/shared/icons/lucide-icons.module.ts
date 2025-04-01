import { NgModule } from '@angular/core';
import { LucideAngularModule, Home, FileText, Boxes, Users, User, Settings, Mail, Power } from 'lucide-angular';

const icons = {
  Home,
  FileText,
  Boxes,
  Users,
  User,
  Settings,
  Mail,
  Power
};

@NgModule({
  imports: [LucideAngularModule.pick(icons)],
  exports: [LucideAngularModule]
})
export class LucideIconsModule {}
