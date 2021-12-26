import { Player } from "./player";
import { Space } from "./space";

export class Board {
      /**
     * Represents game board.
     */
       board:Array<Space>;
       /**
        * Used to track players in the game.
        */
       players:Array<Player>;
       /**
        * Used to track whose turn it is.
        */
       currentTurn:string;
       /**
        * Used to track how many turns have passed.
        */
       turnCount:number=0;
       /**
        * History of boards after each move.
        */
       boardHistory:Array<Board>;
       /**
        * History of moves player X made.
        */
       moveXHistory:Array<number>;
       /**
        * History of moves player Y made.
        */
       moveOHistory:Array<number>;
       
       getRandomInt(max:number) {
        return Math.floor(Math.random() * max);
    }
   
       /**
        * Initializes the game board,players and class variables.
        */
       constructor() {
           this.board = new Array<Space>();
           for (let i = 0; i < 9; i++) {
               this.board.push(new Space("block_"+i,"-"));
           }
           this.players = new Array<Player>();
           this.players.push(new Player("x"));
           this.players.push(new Player("o"));
           this.currentTurn = this.players[this.getRandomInt(this.players.length)].name;
           this.boardHistory = new Array<Board>();
           this.moveXHistory = new Array<number>();
           this.moveOHistory = new Array<number>();
       }
   
       /**
        * Changes turn from one player to another.
        */
       nextTurn() {
           if (this.currentTurn=="x") {
               this.currentTurn = "o";
           } else {
               this.currentTurn = "x";
           }
           this.turnCount++;
       }
   
       /**
        * Determines weather a move is valid or not.
        *
        * @param position represents position on board where player wants to place a piece this value ranges from 0-8 inclusive.
        * @return If move is valid.
        */
       validMove(position:number) {
           return this.board[position].value=="-";
       }
   
       /**
        * Updates board with valid move. Also adds previous board to board history and changes turn by calling {@link andytech.game.Board#nextTurn()}.
        *
        * @param value    Player value to put on board: x or o.
        * @param position Position chosen by player.
        * @return If player made move successfully.
        */
       makeMove(value:string, position:number) {
           if (this.validMove(position)) {
               if (this.moveXHistory.length==0 && this.moveOHistory.length==0) {
                   this.boardHistory.push(this.copyBoard());
               }
               this.board[position]=new Space("",value);
               this.boardHistory.push(this.copyBoard());
               if (value=="x") {
                   this.moveXHistory.push(position);
                   this.moveOHistory.push(-1);
               }
               if (value=="o") {
                   this.moveOHistory.push(position);
                   this.moveXHistory.push(-1);
               }
               this.nextTurn();
               return true;
           }
           return false;
       }
   
       /**
        * Makes a copy of the current board.
        *
        * @return Copy of the current board.
        */
       copyBoard() {
           let temp = new Board();
           for (let i = 0; i < this.board.length; i++) {
               temp.board[i].value=this.board[i].value;
           }
           return temp;
       }
   
       /**
        * Validates win conditions.
        *
        * @return Game winner as string.
        */
       validateWinner() {
           let b = this.getLineBoard();
           //validate x
           if (b.charAt(0) == 'x' && b.charAt(1) == 'x' && b.charAt(2) == 'x') {
               return "x";
           }
           if (b.charAt(3) == 'x' && b.charAt(4) == 'x' && b.charAt(5) == 'x') {
               return "x";
           }
           if (b.charAt(6) == 'x' && b.charAt(7) == 'x' && b.charAt(8) == 'x') {
               return "x";
           }
   
           if (b.charAt(0) == 'x' && b.charAt(3) == 'x' && b.charAt(6) == 'x') {
               return "x";
           }
           if (b.charAt(1) == 'x' && b.charAt(4) == 'x' && b.charAt(7) == 'x') {
               return "x";
           }
           if (b.charAt(2) == 'x' && b.charAt(5) == 'x' && b.charAt(8) == 'x') {
               return "x";
           }
   
           if (b.charAt(0) == 'x' && b.charAt(4) == 'x' && b.charAt(8) == 'x') {
               return "x";
           }
           if (b.charAt(2) == 'x' && b.charAt(4) == 'x' && b.charAt(6) == 'x') {
               return "x";
           }
   
           //Validate o
           if (b.charAt(0) == 'o' && b.charAt(1) == 'o' && b.charAt(2) == 'o') {
               return "o";
           }
           if (b.charAt(3) == 'o' && b.charAt(4) == 'o' && b.charAt(5) == 'o') {
               return "o";
           }
           if (b.charAt(6) == 'o' && b.charAt(7) == 'o' && b.charAt(8) == 'o') {
               return "o";
           }
   
           if (b.charAt(0) == 'o' && b.charAt(3) == 'o' && b.charAt(6) == 'o') {
               return "o";
           }
           if (b.charAt(1) == 'o' && b.charAt(4) == 'o' && b.charAt(7) == 'o') {
               return "o";
           }
           if (b.charAt(2) == 'o' && b.charAt(5) == 'o' && b.charAt(8) == 'o') {
               return "o";
           }
   
           if (b.charAt(0) == 'o' && b.charAt(4) == 'o' && b.charAt(8) == 'o') {
               return "o";
           }
           if (b.charAt(2) == 'o' && b.charAt(4) == 'o' && b.charAt(6) == 'o') {
               return "o";
           }
   
           if (!this.getLineBoard().includes("-")) {
               return "d";
           }
           return "";
       }
   
       /**
        * Returns current board in a single line.<br>
        * Example:<br>
        * ["-","-","-"]<br>
        * ["-","-","-"]<br>
        * ["-","-","-"]<br>
        * is returned as:<br>
        * "--------"
        *
        * @return Board represented as a string.
        */
       getLineBoard() {
           let lineBoard = "";
           for (let space of this.board) {
               lineBoard += space.value;
           }
           return lineBoard;
       }
   
       /**
        * Prints current Board to console.
        */
       printBoard() {
           let counter = 0;
           for (let space of this.board) {
               if (counter % 3 == 0) {
                   console.log("\n");
               }
               console.log(space.value);
               counter++;
           }
           console.log("\n");
       }
}
