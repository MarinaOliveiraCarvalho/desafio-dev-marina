import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './components/guards/auth.guard';

const routes: Routes = [
  {
		path:'', 
    loadChildren: () => import('./components/login/login.module').then((m) => m.LoginModule),
	},
	{
		path:'dashboard', 
    loadChildren: () => import('./components/dashboard/dashboard.module').then((m) => m.DashboardModule),
		canActivate:[AuthGuard]
	},
  {
    path: 'new/user',
    loadChildren: () => import('./components/new-user/new-user.module').then((m) => m.NewUserModule),
  },
  {
    path: 'upload',
    loadChildren: () => import('./components/upload-file/upload-file.module').then((m) => m.UploadFileModule),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
