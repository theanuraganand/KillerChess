'use strict';
let config = require('./config')

let ChessPlayer = class {
        constructor(config) {
            this.config = config
            this.fromString(this.config)
            this.whiteKingPos = this.findWhiteKing()
        }

        fromString(configString) {
            let linearConfig = configString.replace(/\r?\n|\r/g, ''),
                rows = linearConfig.split('=').slice(0, -1),
                chessBoard = new Array()

            for (let i = 0; i < rows.length; i++) {
                chessBoard[i] = rows[i].split('|').slice(1, -1)
            }

            this.board = chessBoard
        }

        findWhiteKing() {
            let pos
            this.board.forEach((element, index) => {
                if (element.indexOf('kl') > -1) {
                    pos = [index, element.indexOf('kl')]
                    return;
                }
            });
            return pos
        }

        WhiteKingIsInCheck() {
            let rowLen = this.board[0].length,
                colLen = this.board.length,
                check = false

            //check bottom right
            let row1 = this.whiteKingPos[0],
                col1 = this.whiteKingPos[1]
            while (row1 < rowLen && col1 < colLen) {
                if (this.board[row1][col1] === 'bl' || this.board[row1][col1] === 'kd') {
                        break
                }
                
                if (this.board[row1][col1] === 'bd') {
                    check = true
                    break
                }
                row1++;
                col1++;
            }
            //check top right
            let row2 = this.whiteKingPos[0],
                col2 = this.whiteKingPos[1]
            while (row2 < rowLen && col2 >= 0) {
                
                if (this.board[row2][col2] === 'bl' || this.board[row2][col2] === 'kd') {
                    break
                }
                
                if (this.board[row2][col2] === 'bd') {
                    check = true
                    break
                }
                row2++;
                col2--;
            }
            //check top left
            let row3 = this.whiteKingPos[0],
                col3 = this.whiteKingPos[1]
            while (row3 >= 0 && col3 >= 0) {
                 if (this.board[row2][col2] === 'bl' || this.board[row2][col2] === 'kd') {
                    break
                }
                if (this.board[row3][col3] === 'bd') {
                    check = true
                    break
                }
                row3--;
                col3--;
            }
            //check bottom left
            let row4 = this.whiteKingPos[0],
                col4 = this.whiteKingPos[1]
            while (row4 >= 0 && col4 < colLen) {
                if (this.board[row4][col4] === 'bl' || this.board[row4][col4] === 'kd') {
                     break
                }
                if (this.board[row4][col4] === 'bd') {
                    check = true
                    break
                }
                row4--;
                col4++;
            }

            // call adjacent check for king
            check = check || this.adjacentBlack()
            return (check)

        }

        adjacentBlack() {
            let moves = this.getMoves(),
                black = 0
            for (let i = 0; i < moves.length; i++) {
                let current = moves[i],
                    x_max = this.board[0].length,
                    y_max = this.board.length
                if (current[0] >= 0 && current[0] < x_max && current[1] >= 0 && current[1] < y_max) {
                    continue;
                }
                else{
                    moves.splice(i,1)
                }
            }
            
            moves.forEach(element => {
                if (this.board[element[0]][element[1]] === 'kd') {
                    black++
                }
            });
            return (black > 0) ? true : false;
        }

        WhiteKingIsInCheckMate() {
            let moves = this.getMoves(),
                emptySpaces = 0
            for (let i = 0; i < moves.length; i++) {
                let current = moves[i],
                    x_max = this.board[0].length,
                    y_max = this.board.length
                if (current[0] >= 0 && current[0] < x_max && current[1] >= 0 && current[1] < y_max) {
                    continue;
                }
                else{
                    moves.splice(i,1)
                }
            }
            
            moves.forEach(element => {
                if (this.board[element[0]][element[1]] === '  ') {
                    emptySpaces++
                }
            });
            let result = (emptySpaces > 0) ? false : true;
            return (result && this.WhiteKingIsInCheck())
        }

        getMoves() {
            let pos_x = this.whiteKingPos[0],
                pos_y = this.whiteKingPos[1],
                moves = [
                    [pos_x+1, pos_y],
                    [pos_x, pos_y+1],
                    [pos_x+1, pos_y+1],
                    [pos_x-1, pos_y],
                    [pos_x, pos_y-1],
                    [pos_x-1, pos_y-1],
                    [pos_x+1, pos_y-1],
                    [pos_x-1, pos_y+1]
                ]

            return moves
        }
    },
    player = new ChessPlayer(config)

let boardCur = config.replace(/=/g, '')

console.log('For current board : \n'+boardCur)
console.log('White King is in check : ', player.WhiteKingIsInCheck())
console.log('White King is in check mate : ', player.WhiteKingIsInCheckMate())