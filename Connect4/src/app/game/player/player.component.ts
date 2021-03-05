import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

//MatDialog
import { MatDialog } from '@angular/material/dialog'; 
import { ErrComponent } from '../err/err.component';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

import { ColorSchemeService } from 'src/app/services/color-scheme-service.service';

import { PlayerService } from 'src/app/services/player.service';
import { JeuInfos } from 'src/app/interface/jeu-infos';
import { PlayersInfos } from 'src/app/interface/players-infos';
import { GridComponent } from '../grid/grid.component';
import { RulesComponent } from 'src/app/rules/rules.component';



@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})

export class PlayerComponent implements OnInit {

  public playerForm: FormGroup; 

  //
  public infos: JeuInfos;

  constructor(private fb : FormBuilder, public dialog: MatDialog, public dialogR: MatDialog, private router : Router, playerService: PlayerService, private colorSchemeService: ColorSchemeService) {
    playerService.getGameDataObservable().subscribe(infos => this.infos = infos );
    this.colorSchemeService.load(); 
   }

  ngOnInit() { 
    this.initializeForm();
  }

  //ReactiveForm 
  /*initializeForm(): void { 
    this.playerForm = this.fb.group({
       pseudo1: '',
       color1: '',
       pseudo2: '',
       color2: ''
    });
  }*/
  //simplification
  initializeForm(): void {
    this.playerForm = this.fb.group(this.infos.players); 
  }

  submitForm() { 
   this.infos.players = this.playerForm.value;
  }

  //MatDialog 
  openDialog() {
    this.dialog.open(ErrComponent);
  
  } 

  openRules() {
    this.dialogR.open(RulesComponent);
   
  }

  //test
  /*goToGame() {
    this.router.navigate(['/grid']);
  } */

} 
