import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  documentClickedTarget: Subject<HTMLElement> = new Subject<HTMLElement>()
}
