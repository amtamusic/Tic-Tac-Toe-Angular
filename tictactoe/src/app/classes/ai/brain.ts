export class Brain {
      /**
     * Used to store offensive plays.
     */
       memoryOffensive:Map<string, Set<number>> ;
       /**
        * Used to store defensive plays.
        */
       memoryDefensive:Map<string, Set<number>>;
   
       /**
        * Initializes class variables.
        */
       constructor(){
           this.memoryOffensive = new Map<string, Set<number>>();
           this.memoryDefensive = new Map<string, Set<number>>();
       }
   
       /**
        * Remembers plays passed in from games played by {@link andytech.ai.AI} class
        *
        * @param game      Game board as string.
        * @param move      Proper move to make.
        * @param isOffense Tag play as offensive or defensive.
        * @param player    0 or 1 mapped to x or y.
        */
        learn(game:string, move:number, isOffense:boolean, player:number) {
           if (isOffense) {
               this.learnAI(game, move, this.memoryOffensive);
           } else {
               this.learnAI(game, move, this.memoryDefensive);
           }
       }
   
       /**
        * Remembers plays based on weather they are offensive or defensive.
        *
        * @param game   Game board as string.
        * @param move   Proper move to make.
        * @param memory {@link java.util.HashMap} representing {@link andytech.ai.Brain#memoryOffensive} or {@link andytech.ai.Brain#memoryDefensive}
        */
       learnAI(game:string, move:number,memory:Map<String, Set<number>>) {
           let moves:Set<number>|undefined;
           if (!memory.has(game)) {
               moves = new Set<number>();
           } else {
               moves = memory.get(game);
           }
           if (moves != undefined){
            moves.add(move);
            memory.set(game, moves);
           }
       }
   
       /**
        * Remember play based on status of a board.
        *
        * @param game Game board as string.
        * @return Possible moves to make.
        */
       remember(game:string) {
           let memoryDefensive = this.memoryDefensive.get(game);
           if (memoryDefensive == null || memoryDefensive.size==0) {
               return this.memoryOffensive.get(game);
           }
           return memoryDefensive;
       }
}
