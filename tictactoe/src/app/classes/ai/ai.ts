import { Board } from "../game/board";
import { Brain } from "./brain";

export class AI {
     /**
     * AI memory.
     */
      brain:Brain;
      /**
       * Toggle Training mode.
       */
      isTraining:boolean;
      /**
       * Training iteration counter.
       */
      trainingCounter:number;
      /**
       * If training surpasses long size.
       */
      overlap:number;
      /**
       * AI best performance percentage.
       */
      bestPerformance:number;
      /**
       * AI performance current iteration.
       */
      currentPerformance:number;
      /**
       * Toggle number of tests per training session.
       */
      testCases:number;
      /**
       * Test batch losses.
       */
      testLossCounter:number;
      /**
       * Test batch wins.
       */
      testWinCounter:number;
      /**
       * Toggle number of training games per run.
       */
      trainingGames:number;
  
      /**
       * Initialize AI variables.
       */
      constructor() {
          this.brain = new Brain();
          this.isTraining = true;
          this.trainingCounter = 0;
          this.overlap = 0;
          this.bestPerformance = 0.0;
          this.currentPerformance = 0.0;
          this.testCases = 100.0;
          this.testLossCounter = 0.0;
          this.testWinCounter = 0.0;
          this.trainingGames = 1000000.0;
      }
  
      /**
       * Trains AI after a win or draw for every move made until it got to a victory.
       *
       * @param moves        Array representing moves in current game.
       * @param movesHistory Array representing the boards after each move in the game.
       * @param player       Current player training by default only 0 is used in current implementation since AI only plays o.
       */
      trainBrain(moves:Array<number> , movesHistory:Array<Board>, player:number) {
          let turn:number=0;
          let game:string="";
          for (let move of moves) {
              if (move >= 0) {
                  game = movesHistory[turn].getLineBoard();
                  this.brain.learn(game, move, true, player);
              }
              turn++;
          }
      }
  
      /**
       * Teaches AI how to block the move that caused it to lose. This introduces the concept of defensive and offensive play.
       *
       * @param moves        Array representing moves in current game.
       * @param movesHistory Array representing the boards after each move in the game.
       */
      trainBrainLoss(moves:Array<number>, movesHistory:Array<Board>) {
          let game = movesHistory[movesHistory.length - 3].getLineBoard();
          this.brain.learn(game, moves[moves.length - 1], false, 0);
      }
  
      /**
       * Tests ai simulating a defined number of games by the variable {@link andytech.ai.AI#testCases}
       */
      test() {
          for (let i = 0; i < this.testCases; i++) {
              this.simulateGameBrain(true,this);
          }
          this.currentPerformance = this.testWinCounter / this.testCases;
          this.testWinCounter = 0.0;
          this.testLossCounter = 0.0;
      }
  
      /**
       * Ask AI to move giving it a board in a string format:<br>
       * <b>Example:</b>xx-oo----
       *
       * @param game board in string format.
       * @return Array of possible moves, returns empty if none are available.
       */
      predictBrain(game:string):Array<number> {
          //Looks through memory if it does not remember the play returns empty array
          let hash = this.brain.remember(game);
          if (hash == null) {
              hash = new Set<number>();
          }
          return Array.from(hash);
      }

      getRandomInt(max:number) {
        return Math.floor(Math.random() * max);
      }
  
      /**
       * Simulates a game between AI and random plays.
       *
       * @param isTest Flag used to specify if simulated game is used for training or testing.
       * @param ai     AI to simulate game with.
       */
      simulateGameBrain(isTest:boolean, ai:AI) {
          //Create new Board.
          let board = new Board();
          //Set x as random moves and move first.
          let result = "";
          let humanPlayer = "x";
          board.currentTurn=humanPlayer;
          //While no winner the game will keep executing.
          while ((result = board.validateWinner()).length == 0) {
              //If AI turn else human turn.
              if (board.currentTurn!=humanPlayer) {
                  //AI possible moves
                  let moves = ai.predictBrain(board.getLineBoard());
                  let choice:number;
                  //If more then one move is returned choose randomly
                  let isValid:boolean;
                  if (moves != null && moves.length>0) {
                      choice =this.getRandomInt(moves.length);
                      isValid = board.makeMove(board.currentTurn, moves[choice]);
                      moves.splice(choice,1);
                  } else {
                      //If no moves are returned choose randomly
                      isValid = board.makeMove(board.currentTurn, this.getRandomInt(9));
                  }
                  //Make sure move is valid if previous move invalid.
                  while (!isValid) {
                      if (moves != null && moves.length>0) {
                          choice = this.getRandomInt(moves.length);
                          isValid = board.makeMove(board.currentTurn, moves[choice]);
                          moves.splice(choice,1);
                      } else {
                          //If no moves are returned choose randomly
                          isValid = board.makeMove(board.currentTurn, this.getRandomInt(9));
                      }
                  }
              } else {
                  //Random moves to help train AI.
                  let isValid = board.makeMove(board.currentTurn, this.getRandomInt(9));
                  while (!isValid) {
                      isValid = board.makeMove(board.currentTurn, this.getRandomInt(9));
                  }
              }
          }
          //Random moves won.
          if (result=="x") {
              if (this.isTraining && !isTest) {
                  //Train Loss.
                  this.trainBrainLoss(board.moveXHistory, board.boardHistory);
                  if (this.trainingCounter < 999999999) {
                      this.trainingCounter++;
                  } else {
                      this.trainingCounter = 0;
                      this.overlap++;
                  }
              }
  
              if (isTest) {
                this.testLossCounter++;
              }
              //AI won.
          } else if (result=="o") {
              if (this.isTraining && !isTest) {
                  //Train Win.
                  this.trainBrain(board.moveOHistory, board.boardHistory, 0);
                  if (this.trainingCounter < 999999999) {
                    this.trainingCounter++;
                  } else {
                    this.trainingCounter = 0;
                    this.overlap++;
                  }
              }
  
              if (isTest) {
                this.testWinCounter++;
              }
              //If draw
          } else if (result=="d") {
              //Train Draw.
              this.trainBrain(board.moveOHistory, board.boardHistory, 0);
              if (isTest) {
                this.testWinCounter++;
              }
          }
      }
  
      /**
       * Initializes tests and updates {@link andytech.ai.AI#bestPerformance} if new best is found.
       */
      initTest() {
        this.test();
          if (this.currentPerformance > this.bestPerformance) {
            this.bestPerformance = this.currentPerformance;
          }
      }
  
      /**
       * Trains AI with number of test cases defined by {@link andytech.ai.AI#testCases}.
       */
      initTraining() {
          while (this.trainingCounter < this.trainingGames) {
            this.simulateGameBrain(false, this);
          }
          this.trainingCounter = 0;
      }
  
      /**
       * Initializes training and testing simultaneously by calling {@link andytech.ai.AI#initTraining()},{@link andytech.ai.AI#initTest()}.
       */
      initTrainingAndTesting() {
        this.initTraining();
        this.initTest();
      }
  
    //   /**
    //    * Saves current brain in tictac.brain file in current working directory.
    //    *
    //    * @return Status of save operation.
    //    */
    //   saveBrain() {
    //       try {
    //           ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("tictac.brain"));
    //           oos.writeObject(brain);
    //           oos.flush();
    //           oos.close();
    //           System.out.println("Saved Brain");
    //           return true;
    //       } catch (IOException e) {
    //           System.out.println("Error Saving Brain : " + e.getMessage());
    //           return false;
    //       }
    //   }
  
    //   /**
    //    * Loads saved brain from tictac.brain file in current working directory.
    //    *
    //    * @return Status of load operation.
    //    */
    //   public boolean loadBrain() {
    //       try {
    //           ObjectInputStream ois = new ObjectInputStream(new FileInputStream("tictac.brain"));
    //           brain = (Brain) ois.readObject();
    //           ois.close();
    //           System.out.println("Loaded Brain");
    //           return true;
    //       } catch (IOException | ClassNotFoundException e) {
    //           System.out.println("Error Loading Brain : " + e.getMessage());
    //           return false;
    //       }
    //   }
  
      /**
       * Print current best performance.
       */
      printCurrentPerformance() {
          console.log("Current perf: " + this.bestPerformance);
      }
  
}
