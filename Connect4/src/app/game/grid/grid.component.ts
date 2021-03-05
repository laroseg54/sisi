import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
//import EventEmitter = require('events');
import { ColorCaseComponent } from '../color-case/color-case.component';

import { ColorSchemeService } from 'src/app/services/color-scheme-service.service';

import { PlayerService } from 'src/app/services/player.service';
import { CaseData } from 'src/app/interface/case-data';
import { JeuInfos } from 'src/app/interface/jeu-infos';
import { TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  //template: ' <h2>{{"Hello " + parentData }}</h2>',
  styleUrls: ['./grid.component.scss']
})


export class GridComponent implements OnInit {

  public infos: JeuInfos;
  private gameSubject = new BehaviorSubject<JeuInfos>({
    gagnant: "", fin: false, players: {
      pseudo1: '',
      color1: '',
      pseudo2: '',
      color2: ''
    }
  });

  turn: boolean = true; //True = tour du player rouge
  status: boolean = false;

  compteTest = 0; //placer 1 seul pion

  //test récup coordonnées 
  colonneP: number;
  ligneP: number;
  colorP: number;
  redP1: number;

  //hide play button when col is full
  isButtonVisible1 = true;
  isButtonVisible2 = true;
  isButtonVisible3 = true;
  isButtonVisible4 = true;
  isButtonVisible5 = true;
  isButtonVisible6 = true;
  isButtonVisible7 = true;


  public col = 7;
  public row = 6;
  redPawns: number = 21;
  yellowPawns: number = 21;

  //service
  grille3: number[][];

  public case: CaseData;


  //constructor(public boardservice: BoardService) { }
  constructor(public boardservice: BoardService, playerService: PlayerService, private colorSchemeService: ColorSchemeService) {
    playerService.getGameDataObservable().subscribe(infos => this.infos = infos);
    this.colorSchemeService.load();
    // playerService.initializeBoard(this.row, this.col);
    this.pawn = 0;
  }

  public pawn: 0 | 1 | 2;

  ngOnInit(): void {
    this.grille3 = this.boardservice.emptyGrid; //initialise la grille à 0 (white) dans chaque case depuis le service
    console.log("My board looks like this : " + this.grille3);
    console.table(this.grille3);
  }

  //bouton play again à la fin d'une partie
  restart() {
    this.infos.fin = false;
    this.infos.gagnant = "";
    this.grille3 = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ];
    this.redPawns = 21;
    this.yellowPawns = 21;
    console.log("GRILLE RENOUVELÉE : " + this.grille3);
    this.isButtonVisible1 = true;
    this.isButtonVisible2 = true;
    this.isButtonVisible3 = true;
    this.isButtonVisible4 = true;
    this.isButtonVisible5 = true;
    this.isButtonVisible6 = true;
    this.isButtonVisible7 = true;
  }

  //fonction qui vérifie si il y a un gagnant rouge en vertical (7 colonnes)
  /* on entre dans cette fonction si le dernier pion rouge placé
   * est au minimum sur la 4ème ligne en partant du bas ou plus haut
   */
  verticale(couleur: number) {
    let colonne = this.colonneP;
    let ligne = this.ligneP;
    if (ligne <= 2) {
      if (this.grille3[ligne][colonne] === couleur) { //always TRUE 
        ligne++;
        if (this.grille3[ligne][colonne] === couleur) {
          ligne++;
          if (this.grille3[ligne][colonne] === couleur) {
            ligne++;
            if (this.grille3[ligne][colonne] === couleur) {
              //4 pions alignés à la verticale
              this.infos.fin = true;
              let couleurJoueur: string = couleur === 1 ? "red" : "yellow";
              if (this.infos.players.color1 === couleurJoueur) {
                this.infos.gagnant = this.infos.players.pseudo1;
              }
              else {
                this.infos.gagnant = this.infos.players.pseudo2;
              }

              alert("GameOver by vertical !");
            }
          }
        }
      }
    }
  }



  //fonction qui vérifie si il y a un gagnant rouge à l'horizontal 
  horizontale(couleur: number) {
    let count = 0;
    let ligne: number = this.ligneP;
    for (let j = 0; j <= this.col; j++) {
      if (this.grille3[ligne][j] === couleur) {
        count++;
      }
      else count = 0;
      if (count >= 4) {
        alert("GameOver by horizontal !");
        this.infos.fin = true;
        let couleurJoueur: string = couleur === 1 ? "red" : "yellow";
        if (this.infos.players.color1 === couleurJoueur) {
          this.infos.gagnant = this.infos.players.pseudo1;
        }
        else {
          this.infos.gagnant = this.infos.players.pseudo2;
        }
      }
    }
  }



  diagonale(couleur: number) {
    let align: number = 0;
    let debC: number = this.colonneP - 3;
    let finC: number = this.colonneP + 3;
    let debL: number = this.ligneP + 3;
    let finL: number = this.ligneP - 3;


    while (debL >= this.grille3.length || debC < 0) {
      debL--;
      debC++;
    }
    while (finL < 0 || finC >= this.grille3[0].length) {
      finL++;
      finC--;
    }

    console.log("debC : " + debC + "finC : " + finC + "debL : " + debL + "finL : " + finL);

    while (debL >= finL && debC <= finC && align < 4) {
      if (this.grille3[debL][debC] === couleur) {
        align++;
      }
      else {
        align = 0;
      }

      debC++;
      debL--;
    }
    console.log("diagonale alignement " + align);
    if (align >= 4) {

      this.infos.fin = true;
      let couleurJoueur: string = couleur === 1 ? "red" : "yellow";
      if (this.infos.players.color1 === couleurJoueur) {
        this.infos.gagnant = this.infos.players.pseudo1;
      }
      else {
        this.infos.gagnant = this.infos.players.pseudo2;
      }
      alert("GameOver by " + couleurJoueur + " DIAGONAL");
    }
  }
    
  













    /*for (let j = 3 ; j >= 0 ; j--) {
      for (let i = 0; i < this.row ; i++) {
        if (this.grille3[i][j] == 1) {
          align++;
          console.log("ALIGN = " + align);
          if (align >= 4) {
            alert(("GameOver by red diagonal on 3 3"));
          }
        }
      }
    }*/
    /*if (this.colonneP == 3 && this.ligneP <= 2) {
      if (this.grille3[this.ligneP][this.colonneP] == 1) {
        align++;
        console.log("ALIGN = " + align);
        console.log("PREMIÈRE BOUCLE");
        this.ligneP++;
        this.colonneP--; 
        if (this.grille3[this.ligneP][this.colonneP] == 1) {
          align++;
          console.log("ALIGN = " + align);
          this.ligneP++;
          this.colonneP--;
          if (this.grille3[this.ligneP][this.colonneP] == 1) {
            align++;
            console.log("ALIGN = " + align);
            this.ligneP++;
            this.colonneP--;
            if (this.grille3[this.ligneP][this.colonneP] == 1) {
              //4 pions alignés diagonale
              this.infos.fin = true; 
              if (this.infos.players.color1 === "red") {
                this.infos.gagnant = this.infos.players.pseudo1;
              }
              else {
                this.infos.gagnant = this.infos.players.pseudo2;
              }
              alert("GameOver RED DIAGONAL");
            }
          }
        }
      }
    }*/

  

  diagonale2(couleur : Number) {
    // on parcourt la diagonale des septs cases d'alignement possible en partant du bas de la grille et en remontant vers la gauche
    let align: number = 0;
    let debC : number = this.colonneP + 3;
    let finC : number = this.colonneP - 3;
    let debL : number = this.ligneP + 3;
    let finL : number = this.ligneP - 3;
    // on cherche un début et une fin pour la diagonale qui ne soient pas en dehors de la grille 
    while(debL>= this.grille3.length || debC >= this.grille3[0].length){
      debL--;
      debC--;
    }
    while(finL<0 || finC < 0){
      finL++;
      finC++;
    }
    
   
    console.log(debC,finC,debL,finL);
    
    while (debL >= finL && debC>=finC && align < 4) {

      if (this.grille3[debL][debC] === couleur) {
        align++;
      }
      else {
        align = 0
      }

      debC--;
      debL--;

    }

    

    if (align >= 4) {

      this.infos.fin = true;
      let couleurJoueur: string = couleur === 1 ? "red" : "yellow";
      if (this.infos.players.color1 === couleurJoueur) {
        this.infos.gagnant = this.infos.players.pseudo1;
      }
      else {
        this.infos.gagnant = this.infos.players.pseudo2;
      }
      alert("GameOver by " + couleurJoueur + " DIAGONAL");
    }


  }

  draw() { //finit le jeu quand tous les pions rouges ont été posés
    if (this.redPawns == 0 || this.yellowPawns == 0) {
      this.infos.fin = true;
      alert("Game ended in a tie");
      this.infos.gagnant = "No one";
    }
  }

  verifGagnant(couleur: number) {
    this.verticale(couleur);
    this.horizontale(couleur);
    this.diagonale(couleur);
    this.diagonale2(couleur);
    this.draw();
  }





  //--------------------- FONCTIONS POUR PLACER LES PIONS DANS GRILLE3 -----------------------------------------
  colonne(this: GridComponent, couleur: number, colonne: number) {

    for (let i = 5; i >= 0; i--) {
      if (this.grille3[i][colonne] === 1 || this.grille3[i][colonne] === 2) {
      }
      else {
        this.grille3[i][colonne] = couleur; //1 vaut 1 pion rouge
        this.ligneP = i;
        this.colonneP = colonne;
        if (couleur === 1) {
          this.redPawns--; //to determine if there is a draw
        }
        else {
          this.yellowPawns--;
        }

        this.verifGagnant(couleur);

        //changer couleur case 
        //this.status=!this.status; 
        //console.log("STATUS : " +this.status);
        //
        this.compteTest = 1; //var prend 1 au lieu de 0  
        if (this.compteTest === 1) {
          break; //permet de ne placer qu'UN SEUL pion
        }
      }
    }
    //------------------- CHANGER COULEUR CASE -------------------
    //for (let j = 0 ; ;) {
    // for (let i = this.ligneP ; ;) {
    // this.pawn = 1;
    //console.log("EMPLACEMENENT I J = " + j + " ; " + i);
    //}
    //}
    //---------------------------------------------------------

    //Fait disparaître le bouton si la colonne est remplie 
    if (this.grille3[0][0] === 1 || this.grille3[0][0] === 2) {
      this.isButtonVisible1 = false;
    }

    this.turn = !this.turn; //passer au tour des jaunes 


    console.log("1 PION PLACÉ !");
    console.log("New board : " + this.grille3);
    console.table(this.grille3);
  }
}




//-----------------------------------------------------------------------

  //ngOnInit(): void {
    //console.log("TEST onInit ok");
    ////this.initializeTable()
    //this.grille3 = this.boardservice.emptyGrid; //initialise la grille depuis le service 
    //console.log("My board looks like this : " + this.grille3); 
    //console.log("OnInit variable TURN = " + this.turn);

    ////this.case.played = false; 
    ////this.couleur = "white"; 
    ////for (let i = 0 ; i < this.col ; i++) {
     //// this.case.played = false; 
    ////}
  ////this.gameState(); 
  //}
//---------------------- EN COURS ------------------------------------

  /*playAgain(grille3:number [][]) {
    //this.boardservice.playAgain();
    //this.grille3 = this.boardservice.emptyGrid;
    //console.table(this.grille3); 
    console.log("hey");
    this.grille3 = this.boardservice.emptyGrid;
    console.table("REMISE à 0 : " + this.grille3);
    //this.infos.fin = false;
    //this.infos.gagnant = "";
    //this.infos.players

    const inf = this.gameSubject.getValue();
    this.gameSubject.next({ gagnant: "", fin: false, players: inf.players });

  } */

  /*reset(this:GridComponent) {
    for (let i = 0 ; i < this.col ; i++) {
      for (let j = 0 ; j < this.row ; j++) {
        this.grille3[i][j] = 0; 
      }
    }
  } */



//------------------------------FIN EN COURS -----------------------------






//------------------------------------------------------------------

  //TEST POUR PLACER UN PION 
  ////////Jouer1R(this:GridComponent) {
   //////// console.log("J'ai appuyé sur 'Jouer1R'");
    //Pour changer l'état 0 1 2 
    //this.grille2[0] = this.red; 
    //console.log("New board is : " + this.grille2); 

    //Pour changer l'état visuel MARCHE !!! 
   //////// this.status1 = !this.status1;
   //////// this.turn = !this.turn;

   /* if (this.turn) {
      console.log("Tour des rouges");
      this.status1 != this.status1; 
      this.turn = !this.turn;
    }
    else {
      console.log("Tour des jaunes");
      this.status1B != this.status1B; 
      this.turn = !this.turn;
    }*/
   //////// console.log("MAJ variable TURN = " + this.turn);
 //////// }

 /* test(this:GridComponent) {
    console.log("1 pion placé");
    this.turn = !this.turn; 
    console.log("MAJ variable TURN = " + this.turn);
  } */

  /*test2(this:GridComponent) {
    console.log("TEST2");
    if (this.turn) {
      this.color = "red"; 
      this.turn = !this.turn;
    }
    else this.color = "yellow"; 
    this.turn = !this.turn;
  }

  test3(this:GridComponent) {
    console.log("TEST3");
    if (this.turn) {
      this.color = "red"; 
      this.turn = !this.turn;
    }
    else this.color = "yellow";
    this.turn = !this.turn; 
  }*/
//----------------------------------------------------------------

//Initialise board ligne 0 
  /*initializeTable(this:GridComponent) {
    for (let i = 0 ; i < this.col ; i++) {
      //this.grille2[i] = "0"; 
      this.grille2[i] = this.white;
    }
    console.log("My board looks like this : " + this.grille2);
  }*/

  //-----------------Test cliquer sur case----------------------
/*ngOnInit(): void {
  this.initializeTable();
  console.log("My grille looks like this : " + this.grille); 
}*/

/*initializeTable(this:GridComponent){
  for(let i=0;i<this.hauteur;i++){
    this.grille.push(new Array<String>(7))
    for(let j=0;j<this.taille;j++){
      this.grille[i][j] = "white";
    }
  }
} */

//Initialise board ligne 0 
 /* initializeTable(this:GridComponent) {
    for (let i = 0 ; i < 6 ; i++) {
      this.grille.push(new Array<String>(7))
      for (let j = 0 ; j < 7 ; j++) {
        this.grille[i][j] = 'white';
        
      }
    }
  }*/
//---------------------------------------------------
