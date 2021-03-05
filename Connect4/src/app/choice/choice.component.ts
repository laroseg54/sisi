import { Component, OnInit } from '@angular/core';
import { RulesComponent } from 'src/app/rules/rules.component';
import { MatDialog } from '@angular/material/dialog'; 
import { Router } from '@angular/router';
import { ColorSchemeService } from 'src/app/services/color-scheme-service.service';


@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.scss']
})
export class ChoiceComponent implements OnInit {

  constructor(public dialogR: MatDialog, private router : Router, private colorSchemeService: ColorSchemeService) { 
    this.colorSchemeService.load();
  }

  ngOnInit(): void {
  }

  openRules() {
    this.dialogR.open(RulesComponent);
    

  }

}
