import {Component, Input, OnInit} from '@angular/core';
import {Feature} from "../../models/bdd";

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  @Input()
  feature!: Feature

  constructor() { }

  ngOnInit(): void {

  }

}
