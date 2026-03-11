import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FashionListComponent } from './fashion-list/fashion-list.component';
import { FashionFormComponent } from './fashion-form/fashion-form.component';
import { FashionDetailComponent } from './fashion-detail/fashion-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: FashionListComponent },
  { path: 'form', component: FashionFormComponent },
  { path: 'form/:id', component: FashionFormComponent },
  { path: 'detail/:id', component: FashionDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
