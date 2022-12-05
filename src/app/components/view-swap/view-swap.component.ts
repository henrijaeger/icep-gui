import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-view-swap',
  templateUrl: './view-swap.component.html',
  styleUrls: ['./view-swap.component.scss']
})
export class ViewSwapComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  open(fragment: string) {
    this.router.navigateByUrl(`#${ fragment }`);
  }

}
