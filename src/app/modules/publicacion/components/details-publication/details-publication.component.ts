import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-details-publication',
  templateUrl: './details-publication.component.html',
  styleUrls: ['./details-publication.component.scss']
})
export class DetailsPublicationComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

}
