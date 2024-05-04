import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-handle-server-status',
  templateUrl: './handle-server-status.component.html',
  styleUrls: ['./handle-server-status.component.scss']
})
export class HandleServerStatusComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.body.addEventListener('mousemove', (event) => {
      const eyes = document.querySelectorAll('.eye');
      eyes.forEach(eye => {
        const e = eye as HTMLElement;
        const x = (e.offsetLeft) + (e.offsetWidth / 2);
        const y = (e.offsetTop) + (e.offsetHeight / 2);
        const rad = Math.atan2(event.pageX - x, event.pageY - y);
        const rot = (rad * (180 / Math.PI) * -1) + 180;
        e.style.transform = `rotate(${rot}deg)`;
      });
    });
  }

}
