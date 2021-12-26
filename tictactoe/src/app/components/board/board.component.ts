import { Component, OnInit } from '@angular/core';
import { range } from 'rxjs';
import { AI } from 'src/app/classes/ai/ai';
import { Board } from 'src/app/classes/game/board';
import { Space } from 'src/app/classes/game/space';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  boxes:Array<Space>;
  ai:AI;
  board:Board=new Board();
  humanPlayer:string="";

  constructor() {
    this.boxes=new Array<Space>();
    this.ai=new AI();
    this.ai.initTrainingAndTesting();
    // setInterval(() => {
    //   this.ai.initTrainingAndTesting;
    //   console.log("training called");
    // }, 10000);
    this.newGame();
    for(let i=0;i<9;i++)
    {
      this.boxes.push(new Space("block_"+i,"-"));
      console.log(this.boxes[i].className);
    }
  }

  ngOnInit(): void {
  }

  getRandomInt(max:number) {
    return Math.floor(Math.random() * max);
  }


  newGame(){
        //Create new game board.
        this.board = new Board();
        //Set x as human player and move first.
        this.humanPlayer = "x";
        this.board.currentTurn=this.humanPlayer;
        for(let i of this.boxes){
          i.value="-";
        }
  }
  /**
     * Plays game with AI.
     */
   playGameBrain(input:number) {
    this.ai.initTrainingAndTesting();
    //While no winner the game will keep executing.
    console.log("Current Perf",this.ai.currentPerformance);
    let result = "";
    if ((result = this.board.validateWinner()).length == 0) {
        //If AI turn else human turn.
        if (this.board.currentTurn!=this.humanPlayer) {
            //AI possible moves
            let moves = this.ai.predictBrain(this.board.getLineBoard());
            let choice=-1;
            //If more then one move is returned choose randomly
            let isValid= false;
            if (moves != null && moves.length>0) {
                choice = this.getRandomInt(moves.length);
                isValid = this.board.makeMove(this.board.currentTurn, moves[choice]);
                moves.splice(choice,1);
            } else {
                //If no moves are returned choose randomly
                isValid = this.board.makeMove(this.board.currentTurn, this.getRandomInt(9));
            }
            //Make sure move is valid if previous move invalid.
            while (!isValid) {
                if (moves != null && moves.length>0) {
                    choice = this.getRandomInt(moves.length);
                    isValid = this.board.makeMove(this.board.currentTurn, moves[choice]);
                    moves.splice(choice,1);
                } else {
                    //If no moves are returned choose randomly
                    isValid = this.board.makeMove(this.board.currentTurn, this.getRandomInt(9));
                }
            }
            if((result = this.board.validateWinner()).length != 0){
              this.checkWinner(result);
              this.newGame()
            }

        } else {
            //Ask player for a move
            //Make sure move is valid if input move invalid.
            if (!this.board.makeMove(this.board.currentTurn, input)) {
                alert("Invalid move make a new one");
            }else
            {
              this.playGameBrain(input);
            }
        }
        //Print board after moves
        //this.board.printBoard();
        this.updateBoard();
    }else{
        this.checkWinner(result);
        //Print final board
        this.newGame()

    }
    }
  checkWinner(result: string) {
     //Human won.
     if (result=="x") {
      alert("X won");
      //Train Loss.
      this.ai.trainBrainLoss(this.board.moveXHistory, this.board.boardHistory);
      if (this.ai.trainingCounter< 999999999) {
        this.ai.trainingCounter=this.ai.trainingCounter + 1;
      } else {
        this.ai.testLossCounter=0.0;
        this.ai.overlap=this.ai.overlap + 1;
      }
      //AI won.
    } else if (result=="o") {
      alert("O won");
      //Train Win.
      this.ai.trainBrain(this.board.moveOHistory, this.board.boardHistory, 0);
      if (this.ai.trainingCounter < 999999999) {
        this.ai.trainingCounter=this.ai.trainingCounter + 1;
      } else {
        this.ai.testLossCounter= 0.0;
        this.ai.overlap= this.ai.overlap+1;
      }
      //If draw
    } else if (result=="d") {
      //Train Draw.
      this.ai.trainBrain(this.board.moveOHistory, this.board.boardHistory, 0);
      if (this.ai.trainingCounter < 999999999) {
        this.ai.trainingCounter=this.ai.trainingCounter + 1;
      } else {
        this.ai.testLossCounter= 0.0;
        this.ai.overlap= this.ai.overlap+1;
      }
      alert("It's a draw");
    }
  }
  updateBoard() {
    for(let i=0 ;i< this.board.board.length;i++){
      this.boxes[i].value=this.board.board[i].value;
    }
  }

}
