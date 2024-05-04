import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanComponent } from "./components/plan/plan.component";
import { PlanCreateComponent } from "./components/plan-create/plan-create.component";
import { PlanEditComponent } from "./components/plan-edit/plan-edit.component";
import { PlanResolverService } from "../../services/plan-resolver.service";

const routes: Routes = [
  { path: '', component: PlanComponent },
  { path: 'create', component: PlanCreateComponent },
  { path: 'edit/:id', component: PlanEditComponent, resolve: { plan: PlanResolverService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanRoutingModule { }
