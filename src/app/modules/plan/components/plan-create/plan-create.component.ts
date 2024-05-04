import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { PlanService } from '../../../../services/plan.service';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl

@Component({
  selector: 'app-plan-create',
  templateUrl: './plan-create.component.html',
  styleUrls: ['./plan-create.component.scss']
})
export class PlanCreateComponent implements OnInit {

  constructor(
    private planService: PlanService,
    private toast: HotToastService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  save(plan) {

    this.planService.add(plan, {
      url: baseUrl + '/plan/',

    }).subscribe(created => {
      this.toast.success('Plan creado correctamente');
      this.router.navigateByUrl('/plan');
    });
  }
}
