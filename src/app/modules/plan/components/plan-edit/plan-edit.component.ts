import { Component, OnInit } from '@angular/core';
import { PlanService } from "../../../../services/plan.service";
import { HotToastService } from "@ngneat/hot-toast";
import { ActivatedRoute, Router } from "@angular/router";
import { Plan } from "../../../../models/plan.model";

@Component({
  selector: 'app-plan-edit',
  templateUrl: './plan-edit.component.html',
  styleUrls: ['./plan-edit.component.scss']
})
export class PlanEditComponent implements OnInit {
  plan: Plan;
  constructor(
    private planService: PlanService,
    private toast: HotToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.plan = this.route.snapshot.data['plan'][0];
  }

  ngOnInit(): void {
  }

  save(plan) {

    this.planService.update(plan.id, plan).subscribe(created => {
      this.toast.success('Plan actualizado correctamente');
      this.router.navigateByUrl('/plan');
    });
  }
}
