import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Background, Feature, Given, Scenario} from "../../models/bdd";
import {FormControl, Validators} from "@angular/forms";
import {Control, Form} from "../editable-text/editable-text.component";
import {UtilityService} from "../../service/utility.service";
import {timeout} from "rxjs";
import {B} from "@angular/cdk/keycodes";

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss']
})
export class FeatureComponent implements OnInit {

  @Input("feature")
  feature!: Feature;
  @ViewChild("menu")
  menuRef!: ElementRef;

  controls: Form = new Form();
  menuVisible: boolean = false;
  private timeout: number | null = null;

  constructor(private utilityService: UtilityService) {
  }


  ngOnInit(): void {
    this.utilityService.documentClickedTarget
      .subscribe(target => this.documentClickListener(target));
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

  documentClickListener(target: any): void {
    if (this.menuVisible && !this.menuRef.nativeElement.contains(target)) {
      this.menuVisible = false;
    }
  }

  showMenu() {
    this.menuVisible = true;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  hideMenu() {
    this.timeout = setTimeout(() => {
      this.menuVisible = false;
    }, 1000);
  }

  addBackground() {
    this.feature.background = new Background();
    this.feature.background.addGiven(new Given("I added a background to a feature"));
  }

  addScenario() {
    this.feature.addScenario(new Scenario("I added a new scenario to my feature"));
  }
}
