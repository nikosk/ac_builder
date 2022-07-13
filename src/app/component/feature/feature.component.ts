import {Component, Input, OnInit} from '@angular/core';
import {Feature} from "../../models/bdd";
import {FormControl, Validators} from "@angular/forms";
import {Control, Form} from "../editable-text/editable-text.component";

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss']
})
export class FeatureComponent implements OnInit {

  @Input("feature")
  feature!: Feature;
  controls: Form = new Form();
  menuVisible: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
    this.controls["title"] = new Control(
      new FormControl(this.feature.title, Validators.required),
      (val: string) => {
        console.log(val);
        this.feature.title = val;
      }
    );
    this.controls["description"] = new Control(
      new FormControl(this.feature.description),
      (val: string) => {
        console.log(val);
        this.feature.description = val;
      }
    );
  }

  getControl(field: string): Control {
    return this.controls[field];
  }

}
