import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";

export class Form {
  [name: string]: Control
}

export class Control {

  input: FormControl;
  edited: boolean;
  saveFn: (val:string) => void;

  constructor(input: FormControl, saveFn: (val:string) => void, edited: boolean = false) {
    this.input = input;
    this.edited = edited;
    this.saveFn = saveFn;
  }
}

@Component({
  selector: 'app-editable-text',
  templateUrl: './editable-text.component.html',
  styleUrls: ['./editable-text.component.scss']
})
export class EditableTextComponent implements OnInit {

  @Input()
  control!: Control;
  val: any;

  @ViewChild("inputElement")
  inputEl!: ElementRef;

  @Input()
  onSave!: (val:string) => void

  constructor() { }

  ngOnInit(): void {
    this.val = this.control.input.value;
  }

  save(control: Control) {
    control.saveFn(control.input.value);
    this.control.edited = false;
    this.val = control.input.value;
    this.inputEl.nativeElement.blur();
  }

  cancel() {
    this.control.input.setValue(this.val);
    this.control.edited = false;
    this.inputEl.nativeElement.blur();
  }
}
