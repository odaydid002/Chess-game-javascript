const playerPiece = document.querySelectorAll('.piece')
const squares = document.querySelectorAll('.board-squire')

playerTurn = 1

blackPieces = ['castle1b','horse1b','elephant1b','castle2b','horse2b','elephant2b','king1b','qween1b','solider1b','solider2b','solider3b','solider4b','solider5b','solider6b','solider7b','solider8b']
whitePieces = ['castle1w','horse1w','elephant1w','castle2w','horse2w','elephant2w','king1w','qween1w','solider1w','solider2w','solider3w','solider4w','solider5w','solider6w','solider7w','solider8w']

blackCastling = true
whiteCastling = true

start = true
let check = []
let checkK = []
let pieceMoves = []
let moves = []
let moves2 = []
let board = []
let lands = []
let tempArray0 = []
let cls
let currentPos
let currentPosB
let p
let cnp
let enp
let eno
let nextSquare
let canDrop
let fleftmoves = ['a8','b8','c8','d8','e8','f8','g8','h8']
let frightmoves = ['a1','b1','c1','d1','e1','f1','g1','h1']
let beingDragged
let beingDraggedE
let beingDraggedP
let soldPosB
let defeated
let bd = []
let opp = []
let ff2 = []
let tempff
let ffe
soliderToUpgrade = []
let cr
let op
let whiteTime = 0
let weTime = 0
let whiteTimeS = 0
let whiteTimeM = 0
let whiteTimeS2 = 0
let whiteTimeM2 = 0
let blackTime = 0
let bkTime = 0
let blackTimeS = 0
let blackTimeM = 0
let blackTimeS2 = 0
let blackTimeM2 = 0
let gameTime = 0
let geTime = 0
let gameTimeS = 0
let gameTimeM = 0
let gameTimeS2 = 0
let gameTimeM2 = 0
let p1times = ''
let p1timel = ''
let p2times = ''
let p2timel = ''
let leftp1 = 16
let leftp2 = 16
let eatedp1 = 0
let eatedp2 = 0
let movesp1 = 0
let movesp2 = 0
let checksp1 = 0
let checksp2 = 0
let winner = 0
let gamemoves = ['anything']

squares.forEach(square => {
    moves.push(square.id)
})

let canPlay = false
let canEat = false
let eated = false
let sold
let soldPos
let soldPosW
j=0
let checked = false

for (let i=0;i<=64;i++){
    moves2.push(moves[i])
    j++
    if (j === 8){
        board.push(moves2)
        moves2 = []
        j = 0
    }
}

playerPiece.forEach(piece => {
    piece.addEventListener('dragstart',dragStart)
});

squares.forEach(square => {
    square.addEventListener('dragover',dragOver)
    square.addEventListener('dragenter',dragEnter)
    square.addEventListener('drop',dragDrop)
    square.addEventListener('dragleave',dragLeave)
    // square.addEventListener('drag',dragged)
})

reloadBoard()

function dragStart(e){
    ff2 = []
    beingDragged = e.target
    bd.push(beingDragged)
    beingDraggedE = e
    beingDraggedP = searchBoard(e.toElement.parentElement.id,board)
    p = e.target.alt
    pieceColor = beingDragged.classList[1]
    currentPos = searchBoard(e.toElement.parentElement.id,board)
    currentPosB = e.toElement.parentElement.id
    sold = beingDragged.alt
    ff = filterLands(p,currentPos,lands,pieceColor)
    ffe = canE
    tempff = []
    let pu
    if (sold ==="solider" || sold ==="soliderl"){
        soldPos = currentPosB
        if ((sold ==="solider") && (soldPos[1] === '2') && (Number(soldPos[1]) + 2)<7){
            pu = searchBoard((String(soldPos[0]) + String(Number(soldPos[1]) + 2)),board)
            if(lands[pu[0]][pu[1]][1]) ff.push(pu)
        }
        if ((sold ==="soliderl") && (soldPos[1] === '7') && (Number(soldPos[1]) - 2)>0){
            pu = searchBoard((String(soldPos[0]) + String(Number(soldPos[1]) - 2)),board)
            if(lands[pu[0]][pu[1]][1]) ff.push(pu)
        }
    }
    ff.forEach(f=>{
        ff2.push(board[f[0]][f[1]])
    })
    if (gameCheck()){
        checked = true
        let rr = checkMoves()
        gamemoves = rr
        let gg = []
        gg = ff2
        ff2 = []
        gg.forEach(x=>{
            if(inArray(x,rr)) ff2.push(x)
        })
    }
    ff3 = []
    ff4 = []
    if (playerTurn === 1) who = 2                                                                                  
    else who = 1
    let allayMoves = opMoves(who)
    let oppMoves = opMoves(playerTurn)
    allayMoves.forEach(move=>{
        if(inArray(move,oppMoves)){
            ff3.push(move)
        }
    })

    ff4 = filterKLands()
    ff4.forEach(f=>{
        ff3.push(f)
    })

    if (sold === 'king'){
        ff2 = ff4
        if(checked) {
            if (gamemoves.length!=0) if(gamemoves[0]==='anything') gamemoves = []
            ff4.forEach(f=>{
                if (!inArray(f,gamemoves)) gamemoves.push(f)
            })
        }
    }

    if ((playerTurn === 1)&&(pieceColor === 'white')){
        canPlay = true
        if (start){
            document.addEventListener('animationiteration',dragged)
            start = false
        }
    }else if((playerTurn === 2)&&(pieceColor === 'black')){
        canPlay = true
    }else{
        canPlay = false
    }



    if(canPlay){
        ff2.forEach(f=>{
            document.getElementById(f).classList.add('canMove')
        })
        ffe.forEach(c=>{
            document.getElementById(c).classList.add('canEat')
        })
    }
    filterLands(p,currentPos,lands,pieceColor)
}

function dragOver(e){
    e.preventDefault()
}

function dragDrop(e){
    if((((playerTurn === 1)&&(pieceColor === 'white'))||((playerTurn === 2)&&(pieceColor === 'black')))){
        if(inArray(e.target.id,moves)){
        nextSquare = e.target.id
        cnp = ff2
        if (inArray(nextSquare,cnp)){
            canDrop = true
        }else{
            e.target.classList.add('cantMove')
            canDrop = false
        }
        }else if (inArray(nextSquare,ffe)){
            canEat = true
        }else{
            canEat = false
        }
        if(canEat === true){
            eatPiece(e)
            opneSelectorUp()
            if(sold==="king") if (playerTurn === 1) whiteCastling = false
            if(sold==="king") if (playerTurn === 2) blackCastling = false
            turnChange()
            if (checked){
                checked = false
                if (playerTurn===1) checksp1 +=1
                else checksp2 +=1
                if (gameOver()){
                    endGame()
                }
            }
        }else if((canDrop === true)){
            e.target.append(beingDragged)
            opneSelectorUp()
            canDrop = false
            if(sold==="king") if (playerTurn === 1) whiteCastling = false
            if(sold==="king") if (playerTurn === 2) blackCastling = false
            turnChange()
            if (checked){
                checked = false
                if (playerTurn===1) checksp1 +=1
                else checksp2 +=1
                if (gameOver()){
                    endGame()
                }
            }
        }     
        reloadBoard()        
    }
    console.log(gamemoves)
}

function dragEnter(e){
    if(canPlay){
        if(inArray(e.target.id,moves)){
            nextSquare = e.target.id
            cnp = ff2
            if (!inArray(nextSquare,cnp)){
                e.target.classList.add('cantMove')
            }
        }else{
            nextSquare = e.toElement.parentElement.id
            if (!inArray(nextSquare,canE)&&!inArray(nextSquare,ff2)){
                if (currentPosB!=nextSquare) document.getElementById(nextSquare).classList.add('cantMove')
            }
        }
        id = findKing()[2].id
        document.getElementById(id).classList.remove('check')
    } 
}

function dragLeave(e){
    if(inArray(e.target.id,moves)){
        e.target.classList.remove('cantMove')
    }else{
        e.toElement.parentElement.classList.remove('cantMove')
   }
    
    canDrop = false
    canEat = false
}

function turnChange(){
    const ptrd = document.getElementById('pTurnd')
    const ptrn = document.getElementById('pTurn')
    if (playerTurn === 1){
        playerTurn++
        ptrn.style.color = "#9c885c"
        ptrd.style.backgroundColor = 'rgba(36, 24, 0, 0.616)'
        ptrd.style.borderColor = "#beb07fd5"
    }else if(playerTurn === 2){
        playerTurn--
        ptrn.style.color = '#221700'
        ptrd.style.backgroundColor = 'rgba(236, 217, 176, 0.5)'
        ptrd.style.borderColor = "rgba(32, 18, 0, 0.603)"
    }
    if (playerTurn===1) movesp1 +=1
    else movesp2 +=1
}

function wherePiece(pp){
    let k=0
    board.forEach(m =>{
        for (let i=0;i<9;i++){
            if (m[i] === pp){
                return [k,i]
            }
        }
        k++
    })
}

function inArray(element,array){
    let res=false
    array.forEach(el=>{
        if (el === element){
            res= true
        }
    })
    return res
}

function isFirstPlay(test){
    if(test != 'board-squire'){
        return true
    }else{
        return false
    }
}

function searchBoard(element,array){
    for (let i=0;i<8;i++){
        for (let j=0;j<8;j++){
            if(element === array[i][j]){
                return [i,j]
            } 
        }
    }
}

function inBoard(element,array){
    for (let i=0;i<8;i++){
        for (let j=0;j<8;j++){
            if(element === array[i][j]){
                return true
            }
        }
    }
}

function stateLand(land,lands){
    let pos = []
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if (lands[i][j][0] === land){
                pos = [i,j]
            }
        }
    }
    if (pos === []){
        return [false,false]
    }else{
        return [true,pos]
    }
}

function filterLands(piece,piecePos,lands,pieceColor){
    let canM = []
    canE = []
    let d1,d2
    if(piece === "solider"){
        i = piecePos[0]
        j = piecePos[1]
        if(i-1>=0){
           if(lands[i-1][j][1]) canM.push([i-1,j])
            d1 =document.getElementById(board[i-1][j+1])
            d2 =document.getElementById(board[i-1][j-1])
            if((j+1<=7)&&(d1.firstChild != null)){
                if (d1.firstChild.classList[1] != pieceColor) canE.push(board[i-1][j+1])
            }
            if((j-1>=0)&&(d2.firstChild != null)){
                if (d2.firstChild.classList[1] != pieceColor) canE.push(board[i-1][j-1])
            }
        }
    }else if(piece === 'soliderl'){
        i = piecePos[0]
        j = piecePos[1]
        if(i+1<=7){
            if(lands[i+1][j][1])canM.push([i+1,j])
            d1 = document.getElementById(board[i+1][j+1])
            d2 = document.getElementById(board[i+1][j-1])
            if((j+1<=7)&&(d1.firstChild != null)){
                if (d1.firstChild.classList[1] != pieceColor) canE.push(board[i+1][j+1])
            }
            if((j-1>=0)&&(d2.firstChild != null)){
                if (d2.firstChild.classList[1] != pieceColor) canE.push(board[i+1][j-1])
            }
        }
    }else if(piece === 'castle'){
            i= piecePos[0]
            j= piecePos[1]
            while((i>0)){
                i--
                if(lands[i][j][1]){
                    canM.push([i,j])
                }else{
                    d1 = document.getElementById(board[i][j])
                    if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canE.push(board[i][j])
                    break
                }
            }
            i= piecePos[0]
            j= piecePos[1]
            while((i<7)){
                i++
                if(lands[i][j][1]){
                    canM.push([i,j])
                }else{
                    d1 = document.getElementById(board[i][j])
                    if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canE.push(board[i][j])
                    break
                }
            }
            j= piecePos[1]
            i= piecePos[0]
            while(j<7){
                j++
                if(lands[i][j][1]){
                    canM.push([i,j])
                }else{
                    d1 = document.getElementById(board[i][j])
                    if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canE.push(board[i][j])
                    break
                }
            }
            i= piecePos[0]
            j= piecePos[1]
            while(j>0){
                j--
                if(lands[i][j][1]){
                    canM.push([i,j])
                }else{
                    d1 = document.getElementById(board[i][j])
                    if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canE.push(board[i][j])
                    break
                }
            }
    }else if(piece === 'elephant'){
        i= piecePos[0]
        j= piecePos[1]
        while((j>0 && i>0)){
            j--
            i--
            if(lands[i][j][1]){
                canM.push([i,j])
            }else{
                d1 = document.getElementById(board[i][j])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canE.push(board[i][j])
                break
            }
        }
        i= piecePos[0]
        j= piecePos[1]
        while((i<7 && j<7)){
            i++
            j++
            if(lands[i][j][1]){
                canM.push([i,j])
            }else{
                d1 = document.getElementById(board[i][j])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canE.push(board[i][j])
                break
            }
        }
        i= piecePos[0]
        j= piecePos[1]
        while((j>0 && i<7)){
            j--
            i++
            if(lands[i][j][1]){
                canM.push([i,j])
            }else{
                d1 = document.getElementById(board[i][j])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canE.push(board[i][j])
                break
            }
        }
        i= piecePos[0]
        j= piecePos[1]
        while((i>0 && j<7)){
            i--
            j++
            if(lands[i][j][1]){
                canM.push([i,j])
            }else{
                d1 = document.getElementById(board[i][j])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canE.push(board[i][j])
                break
            }
        }
    }else if(piece === 'horse'){
        i = piecePos[0]
        j = piecePos[1]
        if (i+2<=7){
            i+=2
            if((j+1<=7)){   
                d1 = document.getElementById(board[i][j+1])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                    canE.push(board[i][j+1])
                }else{
                    if((lands[i][j+1][1])) canM.push([i,j+1])
                }
            }
            if((j-1>=0)){
                d1 = document.getElementById(board[i][j-1])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                    canE.push(board[i][j-1])
                }else{
                   if((lands[i][j-1][1])) canM.push([i,j-1])
                }
            }
        }
        i = piecePos[0]
        j = piecePos[1]
        if (i-2>=0){
            i-=2
            if(j+1<=7){   
                d1 = document.getElementById(board[i][j+1])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                    canE.push(board[i][j+1])
                }else{
                    if((lands[i][j+1][1])) canM.push([i,j+1])
                }
            }
            if((j-1>=0)){
                d1 = document.getElementById(board[i][j-1])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                    canE.push(board[i][j-1])
                }else{
                   if((lands[i][j-1][1])) canM.push([i,j-1])
                }
            }
        }
        i = piecePos[0]
        j = piecePos[1]
        if (j+2<=7){
            j+=2
            if((i+1<=7)){
                d1 = document.getElementById(board[i+1][j])
                if ((d1.firstChild != null)&&(d1.firstChild.classList[1] != pieceColor)){
                    canE.push(board[i+1][j])
                }else{
                    if(lands[i+1][j][1]) canM.push([i+1,j])
                }
            }
            if((i-1>=0)){
                d1 = document.getElementById(board[i-1][j])
                if ((d1.firstChild != null)&&(d1.firstChild.classList[1] != pieceColor)){
                    canE.push(board[i-1][j])
                }else{
                    if (lands[i-1][j][1]) canM.push([i-1,j])
                }
            }
        }
        i = piecePos[0]
        j = piecePos[1]
        if (j-2>=0){
            j-=2
            if((i+1<=7)){
                d1 = document.getElementById(board[i+1][j])
                if ((d1.firstChild != null)&&(d1.firstChild.classList[1] != pieceColor)){
                    canE.push(board[i+1][j])
                }else{
                    if ((lands[i+1][j][1])) canM.push([i+1,j])
                }
            }
            if((i-1>=0)){
                d1 = document.getElementById(board[i-1][j])
                if ((d1.firstChild != null)&&(d1.firstChild.classList[1] != pieceColor)){
                    canE.push(board[i-1][j])
                }else{
                    if((lands[i-1][j][1])) canM.push([i-1,j])
                }
            }
        }
    }else if(piece === 'king'){
        i = piecePos[0]
        j = piecePos[1]
        if(i+1<=7){
            d1 = document.getElementById(board[i+1][j])
            if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                canE.push(board[i+1][j])
            }else if (lands[i+1][j][1]) canM.push([i+1,j])
            if ((j+1<=7)){
                d1 = document.getElementById(board[i+1][j+1])
                if((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                    canE.push(board[i+1][j+1])
                }else if (lands[i+1][j+1][1]) canM.push([i+1,j+1])
            } 
            if((j-1>=0)){
                d1 = document.getElementById(board[i+1][j-1])
                if((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                    canE.push(board[i+1][j-1])
                }else if (lands[i+1][j-1][1]) canM.push([i+1,j-1])
            } 
        }
        i = piecePos[0]
        j = piecePos[1]
        if(i-1>=0){
            d1 = document.getElementById(board[i-1][j])
            if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                canE.push(board[i-1][j])
            }else if (lands[i-1][j][1]) canM.push([i-1,j])
            if ((j+1<=7)){
                d1 = document.getElementById(board[i-1][j+1])
                if((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                    canE.push(board[i-1][j+1])
                }else if (lands[i-1][j+1][1]) canM.push([i-1,j+1])
            }  
            if((j-1>=0)){
                d1 = document.getElementById(board[i-1][j-1])
                if((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                    canE.push(board[i-1][j-1])
                }else if (lands[i-1][j-1][1]) canM.push([i-1,j-1])
            } 
        }
        if((j+1<=7)){
            d1 = document.getElementById(board[i][j+1])
            if((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                canE.push(board[i][j+1])
            }else if (lands[i][j+1][1]) canM.push([i,j+1])   
        }
        if((j-1>=0)){
            d1 = document.getElementById(board[i][j-1])
            if((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                canE.push(board[i][j-1])
            }else if (lands[i][j-1][1]) canM.push([i,j-1])
        }
    }else if(piece === 'qween'){
        i= piecePos[0]
            j= piecePos[1]
            while((i>0)){
                i--
                if(lands[i][j][1]){
                    canM.push([i,j])
                }else{
                    d1 = document.getElementById(board[i][j])
                    if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canE.push(board[i][j])
                    break
                }
            }
            i= piecePos[0]
            j= piecePos[1]
            while((i<7)){
                i++
                if(lands[i][j][1]){
                    canM.push([i,j])
                }else{
                    d1 = document.getElementById(board[i][j])
                    if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canE.push(board[i][j])
                    break
                }
            }
            j= piecePos[1]
            i= piecePos[0]
            while(j<7){
                j++
                if(lands[i][j][1]){
                    canM.push([i,j])
                }else{
                    d1 = document.getElementById(board[i][j])
                    if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canE.push(board[i][j])
                    break
                }
            }
            i= piecePos[0]
            j= piecePos[1]
            while(j>0){
                j--
                if(lands[i][j][1]){
                    canM.push([i,j])
                }else{
                    d1 = document.getElementById(board[i][j])
                    if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canE.push(board[i][j])
                    break
                }
            }
        i= piecePos[0]
        j= piecePos[1]
        while((j>0 && i>0)){
            j--
            i--
            if(lands[i][j][1]){
                canM.push([i,j])
            }else{
                d1 = document.getElementById(board[i][j])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canE.push(board[i][j])
                break
            }
        }
        i= piecePos[0]
        j= piecePos[1]
        while((i<7 && j<7)){
            i++
            j++
            if(lands[i][j][1]){
                canM.push([i,j])
            }else{
                d1 = document.getElementById(board[i][j])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canE.push(board[i][j])
                break
            }
        }
        i= piecePos[0]
        j= piecePos[1]
        while((j>0 && i<7)){
            j--
            i++
            if(lands[i][j][1]){
                canM.push([i,j])
            }else{
                d1 = document.getElementById(board[i][j])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canE.push(board[i][j])
                break
            }
        }
        i= piecePos[0]
        j= piecePos[1]
        while((i>0 && j<7)){
            i--
            j++
            if(lands[i][j][1]){
                canM.push([i,j])
            }else{
                d1 = document.getElementById(board[i][j])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canE.push(board[i][j])
                break
            }
        }
    }
    return canM
}

function reloadBoard(){
    eated = false
    canDrop = false
    canEat = false
    canPlay = false
    bd = []
    opp = []
    let j = 0
    lands = []
    for (let i=0;i<=63;i++){
        if(document.getElementById(moves[i]).firstChild === null){
            tempArray0.push([moves[i],true])
        }else{
            tempArray0.push([moves[i],false])
        }
        j++
        if (j === 8){
            lands.push(tempArray0)
            tempArray0 = []
            j = 0
        }
    }
    moves.forEach(c=>{
        document.getElementById(c).classList.remove('canEat','canMove','cantMove','check')
    })
    opMoves(playerTurn)
    if (gameCheck()){
        if (gameOver()){
            endGame()
        }
    }
    filterKLands()
    checkCastling()
    leftp1 = 16 - (document.getElementById('outWhite').children.length-1)
    leftp2 = 16 - (document.getElementById('outBlack').children.length-1)
    eatedp1 = document.getElementById('outBlack').children.length-1
    eatedp2 = document.getElementById('outWhite').children.length-1
}

function eatPiece(e){
    piece1 =  beingDragged
    piece2 = e.target
    color1 = piece1.classList[1]
    color2 = piece2.classList[1]
    pos1 = currentPosB
    pos2 = e.toElement.parentElement.id
    if((color1 != color2) && (inArray(pos2,canE))){
        document.getElementById(pos1).firstChild.remove()
        document.getElementById(pos2).firstChild.remove()
        document.getElementById(pos2).appendChild(piece1)
        if (color2 === 'black'){
            piece2.classList.add('outB')
            document.getElementById('outBlack').appendChild(piece2)     
        } 
        if (color2 === 'white'){
            piece2.classList.add('outW')
            document.getElementById('outWhite').appendChild(piece2)
        } 
        eated = true
    }


    
    if (eated){
        let outWhite = document.getElementById('outWhite').childNodes.length
        let outBlack = document.getElementById('outBlack').childNodes.length
        if((outBlack > 10)&&(outBlack<13)){
            document.querySelectorAll('.outB').forEach(o=>{
                o.style.width = '8dvh'
                o.style.height = '8dvh'
            })
        }else if((outBlack > 13)){
            document.querySelectorAll('.outB').forEach(o=>{
                o.style.width = '6dvh'
                o.style.height = '6dvh'
            })
        }
        if((outWhite > 10)&&(outWhite<13)){
            document.querySelectorAll('.outW').forEach(o=>{
                o.style.width = '8dvh'
                o.style.height = '8dvh'
            })
        }else if((outWhite > 13)){
            document.querySelectorAll('.outW').forEach(o=>{
                o.style.width = '6dvh'
                o.style.height = '6dvh'
            })
        }
    }
}

function map_interval (x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}

function roundTo(number, digits) {
    var multiplier = Math.pow(10, digits);
    return Math.round(number * multiplier) / multiplier;
  }

function dragged(){
    const ptrn = document.getElementById('pTurn')
    if ((playerTurn === 1)){
        weTime += 1
        clkW = String('Player1: '+ whiteTimeM2+whiteTimeM+':'+whiteTimeS2+whiteTimeS)
        whiteTimeS += 1
        ptrn.innerText = clkW
        if (whiteTimeS === 10){
            whiteTimeS = 0
            whiteTimeS2 +=1
        }
        if (whiteTimeS2 === 6){
            whiteTimeS2 = 0
            whiteTimeM+=1
            p1timel = "00:00"
            p1times = '10:00'
        }
        if (whiteTimeM === 10){
            whiteTimeM = 0
            whiteTimeM2+=1
        }
        if (whiteTimeM2 === 6){
            whiteTimeM2 = 0
        }
        wTm = roundTo(map_interval(weTime,0,600,100,0),2)
        document.getElementById('whiteTime').style.height = String(wTm)+'dvh'
    }
    tW = String(whiteTimeM2+whiteTimeM+':'+whiteTimeS2+whiteTimeS)
    
    if ((playerTurn === 2)){
        bkTime += 1
        clkW = String('Player2: '+ blackTimeM2+blackTimeM+':'+blackTimeS2+blackTimeS)
        blackTimeS += 1
        ptrn.innerText = clkW
        if (blackTimeS === 10){
            blackTimeS = 0
            blackTimeS2 +=1
        }
        if (blackTimeS2 === 6){
            blackTimeS2 = 0
            blackTimeM+=1
        }
        if (blackTimeM === 10){
            blackTimeM = 0
            blackTimeM2+=1
            p2timel = "00:00"
            p2times = '10:00'
        }
        if (blackTimeM2 === 6){
            blackTimeM2 = 0
        }
        bTm = roundTo(map_interval(bkTime,0,600,100,0),2)
        document.getElementById('blackTime').style.height = String(bTm)+'dvh'
    }
    tB = String(blackTimeM2+blackTimeM+':'+blackTimeS2+blackTimeS)
    
    clGe = String('Chess ' + gameTimeM2+gameTimeM+':'+gameTimeS2+gameTimeS)
    gameTimeS += 1
    document.title = clGe
    if (gameTimeS === 10){
        gameTimeS = 0
        gameTimeS2 +=1
    }
    if (gameTimeS2 === 6){
        gameTimeS2 = 0
        gameTimeM+=1
    }
    if (gameTimeM === 10){
        gameTimeM = 0
        gameTimeM2+=1
    }
    if (gameTimeM2 === 6){
        gameTimeM2 = 0
    }
    
    if(p1timel!='00:00'){
        p1times = String(whiteTimeM2+whiteTimeM+':'+whiteTimeS2+whiteTimeS)
        p1timel = String((9-(whiteTimeM2*10+whiteTimeM))+':'+(59-(whiteTimeS2*10+whiteTimeS)))
    } 
    
    if(p2timel!='00:00'){
        p2times = String(blackTimeM2+blackTimeM+':'+blackTimeS2+blackTimeS)
        p2timel = String((9-(blackTimeM2*10+blackTimeM))+':'+(59-(blackTimeS2*10+blackTimeS)))
    } 

    if ((whiteTimeM2===1)||(blackTimeM2===1)){
        if (whiteTimeM2===1) winner = 2
        if (blackTimeM2===1) winner = 1
        endGame()
    }
}

function opneSelectorUp(){
    if ((sold ==="solider")&&(inArray(nextSquare,fleftmoves))){
        document.getElementById('soliderUp').style.display = 'flex'
        document.getElementById('main').style.filter = 'blur(5px)'
        soliderToUpgrade = ['white',beingDragged]
    }
    else if ((sold ==="soliderl")&&(inArray(nextSquare,frightmoves))){
        document.getElementById('soliderUp').style.display = 'flex'
        document.getElementById('main').style.filter = 'blur(5px)'
        soliderToUpgrade = ['black',beingDragged]
    }
}

function closeSelectorUp(){
    document.getElementById('soliderUp').style.display = 'none'
    document.getElementById('main').style.filter = 'none'
}

function upgradeSolider(alt){
    if (soliderToUpgrade[0] ==="white"){
        switch (alt) {
            case 'horse':
                soliderToUpgrade[1].setAttribute('src','assets/horse-w.png')
                break;
            case 'castle':
                soliderToUpgrade[1].setAttribute('src','assets/castle-w.png')
                break;
            case 'elephant':
                soliderToUpgrade[1].setAttribute('src','assets/elephant-w.png')
                break;
            case 'qween':
                soliderToUpgrade[1].setAttribute('src','assets/qween-w.png')
                break;
        }
        soliderToUpgrade[1].setAttribute('alt',alt)
        closeSelectorUp()
        gameCheck()
    }else{
        switch (alt) {
            case 'horse':
                soliderToUpgrade[1].setAttribute('src','assets/horse-b.png')
                break;
            case 'castle':
                soliderToUpgrade[1].setAttribute('src','assets/castle-b.png')
                break;
            case 'elephant':
                soliderToUpgrade[1].setAttribute('src','assets/elephant-b.png')
                break;
            case 'qween':
                soliderToUpgrade[1].setAttribute('src','assets/qween-b.png')
                break;
        }
        soliderToUpgrade[1].setAttribute('alt',alt)
        closeSelectorUp()
        gameCheck()
    }
}

function opMoves(who){
    let color = 'white'
    let p0
    let play = []
    let plays = []
    let eats = []
    if (who === 1) color = 'black'
    else color = 'white'
    moves.forEach(pos=>{
        if (document.getElementById(pos).children.length === 1){
            if (document.getElementById(pos).children[0].classList[1] === color){
                p0 = document.getElementById(pos).children[0]
                if (p0.alt!="king"){
                    plays = filterLands(p0.alt,searchBoard(pos,board),lands,color)
                    if (!inArray(p0.alt,["solider","soliderl"])){
                        plays.forEach(pp=>{            
                            if((pp != [])){
                                if(!inArray(board[pp[0]][pp[1]],play)) play.push(board[pp[0]][pp[1]])
                            }
                        })
                    }
                    eats = canE
                    eats.forEach(e=>{
                        if(!inArray(e,play)) play.push(e)
                    })
                }
                
            }
        }
    })
    return play
}

function opMoves2(who,landss){
    let color = 'white'
    let p0
    let play = []
    let plays = []
    if (who === 1) color = 'black'
    else color = 'white'
    moves.forEach(pos=>{
        if (document.getElementById(pos).children[0]!= null){
            if (document.getElementById(pos).children[0].classList[1] === color){
                p0 = document.getElementById(pos).children[0]
                    plays = filterLandsCheck(p0.alt,searchBoard(pos,board),landss,color)
                        plays.forEach(pp=>{            
                            if((pp != [])){
                                if (!inArray(pos,play)) play.push(pos)
                            }
                        })
            }
        }
    })
    return play
}

function findKing(){
    let kingCo
    let king0
    if (playerTurn==1) kingCo = 'white'
    if (playerTurn==2) kingCo = 'black'
    let pcs0
    let found = false
    let posistion
    board.forEach(x=>{
        x.forEach(x1=>{
            pcs0 = document.getElementById(x1)
            if (pcs0.firstChild != null){
                if ((pcs0.firstChild.alt === 'king')&&(pcs0.firstChild.classList[1]===kingCo)){
                    found = true
                    posistion = x1
                    king0 = pcs0.firstChild
                }
            }
        })
    })
    if (found){
        return [posistion,kingCo,king0]
    }else{
        return null
    }
}

function filterLandsCheck(piece,piecePos,lands,pieceColor){
    let canM = []
    let canEE = []
    let d1,d2
    if(piece === "solider"){
        i = piecePos[0]
        j = piecePos[1]
        if(i-1>=0){
           if(lands[i-1][j][1]) canM.push([i-1,j])
            d1 =document.getElementById(board[i-1][j+1])
            d2 =document.getElementById(board[i-1][j-1])
            if((j+1<=7)&&(d1.firstChild != null)){
                if (d1.firstChild.classList[1] != pieceColor) canEE.push(board[i-1][j+1])
            }
            if((j-1>=0)&&(d2.firstChild != null)){
                if (d2.firstChild.classList[1] != pieceColor) canEE.push(board[i-1][j-1])
            }
        }
    }if(piece === 'soliderl'){
        i = piecePos[0]
        j = piecePos[1]
        if(i+1<=7){
            if(lands[i+1][j][1])canM.push([i+1,j])
            d1 = document.getElementById(board[i+1][j+1])
            d2 = document.getElementById(board[i+1][j-1])
            if((j+1<=7)&&(d1.firstChild != null)){
                if (d1.firstChild.classList[1] != pieceColor) canEE.push(board[i+1][j+1])
            }
            if((j-1>=0)&&(d2.firstChild != null)){
                if (d2.firstChild.classList[1] != pieceColor) canEE.push(board[i+1][j-1])
            }
        }
    }if(piece === 'castle'){
            i= piecePos[0]
            j= piecePos[1]
            while((i>0)){
                i--
                if(lands[i][j][1]){
                    canM.push([i,j])
                }else{
                    d1 = document.getElementById(board[i][j])
                    if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canEE.push(board[i][j])
                    break
                }
            }
            i= piecePos[0]
            j= piecePos[1]
            while((i<7)){
                i++
                if(lands[i][j][1]){
                    canM.push([i,j])
                }else{
                    d1 = document.getElementById(board[i][j])
                    if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canEE.push(board[i][j])
                    break
                }
            }
            j= piecePos[1]
            i= piecePos[0]
            while(j<7){
                j++
                if(lands[i][j][1]){
                    canM.push([i,j])
                }else{
                    d1 = document.getElementById(board[i][j])
                    if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canEE.push(board[i][j])
                    break
                }
            }
            i= piecePos[0]
            j= piecePos[1]
            while(j>0){
                j--
                if(lands[i][j][1]){
                    canM.push([i,j])
                }else{
                    d1 = document.getElementById(board[i][j])
                    if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canEE.push(board[i][j])
                    break
                }
            }
    }if(piece === 'elephant'){
        i= piecePos[0]
        j= piecePos[1]
        while((j>0 && i>0)){
            j--
            i--
            if(lands[i][j][1]){
                canM.push([i,j])
            }else{
                d1 = document.getElementById(board[i][j])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canEE.push(board[i][j])
                break
            }
        }
        i= piecePos[0]
        j= piecePos[1]
        while((i<7 && j<7)){
            i++
            j++
            if(lands[i][j][1]){
                canM.push([i,j])
            }else{
                d1 = document.getElementById(board[i][j])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canEE.push(board[i][j])
                break
            }
        }
        i= piecePos[0]
        j= piecePos[1]
        while((j>0 && i<7)){
            j--
            i++
            if(lands[i][j][1]){
                canM.push([i,j])
            }else{
                d1 = document.getElementById(board[i][j])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canEE.push(board[i][j])
                break
            }
        }
        i= piecePos[0]
        j= piecePos[1]
        while((i>0 && j<7)){
            i--
            j++
            if(lands[i][j][1]){
                canM.push([i,j])
            }else{
                d1 = document.getElementById(board[i][j])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canEE.push(board[i][j])
                break
            }
        }
    }if(piece === 'horse'){
        i = piecePos[0]
        j = piecePos[1]
        if (i+2<=7){
            i+=2
            if((j+1<=7)){   
                d1 = document.getElementById(board[i][j+1])
                if ((d1.firstChild !=null)){
                    if (d1.firstChild.classList[1] != pieceColor) canEE.push(board[i][j+1])
                }else{
                    if((lands[i][j+1][1])) canM.push([i,j+1])
                }
            }
            if((j-1>=0)){
                d1 = document.getElementById(board[i][j-1])
                if ((d1.firstChild !=null)){
                    if (d1.firstChild.classList[1] != pieceColor) canEE.push(board[i][j-1])
                }else{
                   if((lands[i][j-1][1])) canM.push([i,j-1])
                }
            }
        }
        i = piecePos[0]
        j = piecePos[1]
        if (i-2>=0){
            i-=2
            if(j+1<=7){   
                d1 = document.getElementById(board[i][j+1])
                if ((d1.firstChild !=null)){
                    if (d1.firstChild.classList[1] != pieceColor) canEE.push(board[i][j+1])
                }else{
                    if((lands[i][j+1][1])) canM.push([i,j+1])
                }
            }
            if((j-1>=0)){
                d1 = document.getElementById(board[i][j-1])
                if ((d1.firstChild !=null)){
                   if (d1.firstChild.classList[1] != pieceColor)  canEE.push(board[i][j-1])
                }else{
                   if((lands[i][j-1][1])) canM.push([i,j-1])
                }
            }
        }
        i = piecePos[0]
        j = piecePos[1]
        if (j+2<=7){
            j+=2
            if((i+1<=7)){
                d1 = document.getElementById(board[i+1][j])
                if ((d1.firstChild != null)){
                    if (d1.firstChild.classList[1] != pieceColor) canEE.push(board[i+1][j])
                }else{
                    if(lands[i+1][j][1]) canM.push([i+1,j])
                }
            }
            if((i-1>=0)){
                d1 = document.getElementById(board[i-1][j])
                if ((d1.firstChild != null)){
                    if (d1.firstChild.classList[1] != pieceColor) canEE.push(board[i-1][j])
                }else{
                    if (lands[i-1][j][1]) canM.push([i-1,j])
                }
            }
        }
        i = piecePos[0]
        j = piecePos[1]
        if (j-2>=0){
            j-=2
            if((i+1<=7)){
                d1 = document.getElementById(board[i+1][j])
                if ((d1.firstChild != null)){
                    if (d1.firstChild.classList[1] != pieceColor) canEE.push(board[i+1][j])
                }else{
                    if ((lands[i+1][j][1])) canM.push([i+1,j])
                }
            }
            if((i-1>=0)){
                d1 = document.getElementById(board[i-1][j])
                if ((d1.firstChild != null)){
                    if (d1.firstChild.classList[1] != pieceColor) canEE.push(board[i-1][j])
                }else{
                    if((lands[i-1][j][1])) canM.push([i-1,j])
                }
            }
        }
    }if(piece === 'qween'){
        i= piecePos[0]
            j= piecePos[1]
            while((i>0)){
                i--
                if(lands[i][j][1]){
                    canM.push([i,j])
                }else{
                    d1 = document.getElementById(board[i][j])
                    if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canEE.push(board[i][j])
                    break
                }
            }
            i= piecePos[0]
            j= piecePos[1]
            while((i<7)){
                i++
                if(lands[i][j][1]){
                    canM.push([i,j])
                }else{
                    d1 = document.getElementById(board[i][j])
                    if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canEE.push(board[i][j])
                    break
                }
            }
            j= piecePos[1]
            i= piecePos[0]
            while(j<7){
                j++
                if(lands[i][j][1]){
                    canM.push([i,j])
                }else{
                    d1 = document.getElementById(board[i][j])
                    if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canEE.push(board[i][j])
                    break
                }
            }
            i= piecePos[0]
            j= piecePos[1]
            while(j>0){
                j--
                if(lands[i][j][1]){
                    canM.push([i,j])
                }else{
                    d1 = document.getElementById(board[i][j])
                    if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canEE.push(board[i][j])
                    break
                }
            }
        i= piecePos[0]
        j= piecePos[1]
        while((j>0 && i>0)){
            j--
            i--
            if(lands[i][j][1]){
                canM.push([i,j])
            }else{
                d1 = document.getElementById(board[i][j])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canEE.push(board[i][j])
                break
            }
        }
        i= piecePos[0]
        j= piecePos[1]
        while((i<7 && j<7)){
            i++
            j++
            if(lands[i][j][1]){
                canM.push([i,j])
            }else{
                d1 = document.getElementById(board[i][j])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canEE.push(board[i][j])
                break
            }
        }
        i= piecePos[0]
        j= piecePos[1]
        while((j>0 && i<7)){
            j--
            i++
            if(lands[i][j][1]){
                canM.push([i,j])
            }else{
                d1 = document.getElementById(board[i][j])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canEE.push(board[i][j])
                break
            }
        }
        i= piecePos[0]
        j= piecePos[1]
        while((i>0 && j<7)){
            i--
            j++
            if(lands[i][j][1]){
                canM.push([i,j])
            }else{
                d1 = document.getElementById(board[i][j])
                if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)) canEE.push(board[i][j])
                break
            }
        }
    }
    canEE.forEach(move=>{
        canM.push(searchBoard(move,board))
    })
    return canM
}

function gameCheck(){
    let opM = opMoves(playerTurn)
    let kingc = findKing()
    if (kingc != null) {
        if (inArray(kingc[0],opM)){
            kingc[2].classList.add('check')
            if (playerTurn === 1) whiteCastling = false
            if (playerTurn === 2) blackCastling = false
            return true
        }else{
            return false
        }
    }else{
        return false
    }
}

function filterKLands(){
    kingc = findKing()
    kingP = kingc[0]
    kingCr = kingc[1]
    pos = []
    posc = []
    npos = []
    posistion = searchBoard(kingP,board)
    i = posistion[0]
    j = posistion[1]
    npos = opMoves(playerTurn)
    posc = filterLands(kingc[2].alt,posistion,lands,kingCr)
    posc.forEach(p=>{
        if(!inArray(board[p[0]][p[1]],npos)) pos.push(board[p[0]][p[1]])
    })
    return pos
}

function closeCastling(){
    document.getElementById('castlingdv').style.display ='none'
    document.getElementById('main').style.filter = 'none'
}
function openCastling(){
    document.getElementById('castlingdv').style.display ='flex'
    document.getElementById('main').style.filter = 'blur(5px)'
    document.getElementById('turPl').innerText = String('Player '+ playerTurn + ' | Castling '+castlingSide)
}

let castlingSide
let castlingp

function checkCastling(){
    if (playerTurn === 1){
        let opM = opMoves(1)
        if((lands[7][2][1])&&(lands[7][1][1])&&(whiteCastling)&&(!inArray('b1',opM))){
            if(document.getElementById('a1').children[0]!=null){
                if (inArray(document.getElementById('a1').children[0].id,['castle2w','castle1w'])){
                    castlingSide = 'right'
                    castlingp = 'white'
                    openCastling()
                }
            } 
        }
        if((lands[7][5][1])&&(lands[7][4][1])&&(lands[7][6][1])&&(whiteCastling)&&(!inArray('f1',opM))){
            if(document.getElementById('h1').children[0]!=null){
                if (inArray(document.getElementById('h1').children[0].id,['castle2w','castle1w'])){
                    castlingSide = 'left'
                    castlingp = 'white'
                    openCastling()
                }
            } 
        }
    }
    if (playerTurn === 2){
        let opM = opMoves(2)
        if((lands[0][2][1])&&(lands[0][1][1])&&(blackCastling)&&(!inArray('b8',opM))){
            if(document.getElementById('a8').children[0]!=null){
                if (inArray(document.getElementById('a8').children[0].id,['castle2b','castle1b'])){
                    castlingSide = 'right'
                    castlingp = 'black'
                    openCastling()
                }
            } 
        }
        if((lands[0][5][1])&&(lands[0][4][1])&&(lands[0][6][1])&&(blackCastling)&&(!inArray('f8',opM))){
            if(document.getElementById('h8').children[0]!=null){
                if (inArray(document.getElementById('h8').children[0].id,['castle2b','castle1b'])){
                    castlingSide = 'left'
                    castlingp = 'black'
                    openCastling()
                }
            } 
        }
    }
}

function startCastling(){
    closeCastling()
    if (playerTurn === 1) whiteCastling = false
    if (playerTurn === 2) blackCastling = false
    if (castlingp === 'white'){
        if(castlingSide==='left'){
            kingel = document.getElementById('d1').children[0]
            castelel = document.getElementById('h1').children[0]
            document.getElementById('f1').appendChild(kingel)
            document.getElementById('e1').appendChild(castelel)
        }
        if(castlingSide==='right'){
            kingel = document.getElementById('d1').children[0]
            castelel = document.getElementById('a1').children[0]
            document.getElementById('b1').appendChild(kingel)
            document.getElementById('c1').appendChild(castelel)
        }
    }
    if (castlingp === "black"){
        if(castlingSide==='left'){
            kingel = document.getElementById('d8').children[0]
            castelel = document.getElementById('h8').children[0]
            document.getElementById('f8').appendChild(kingel)
            document.getElementById('e8').appendChild(castelel)
            }
        if(castlingSide==='right'){
            kingel = document.getElementById('d8').children[0]
            castelel = document.getElementById('a8').children[0]
            document.getElementById('b8').appendChild(kingel)
            document.getElementById('c8').appendChild(castelel)
        }
    }
    turnChange()
    reloadBoard()
}

function fakeGame (){
    let landBol = []
    let landBolTemp = []
    let j = 0
    for (let i=0;i<=63;i++){
        if(document.getElementById(moves[i]).firstChild === null){
            landBolTemp.push([moves[i],true])
        }else{
            landBolTemp.push([moves[i],false])
        }
        j++
        if (j === 8){
            landBol.push(landBolTemp)
            landBolTemp = []
            j = 0
        }
    }
    return landBol
}

function checkMoves(){
    // opponent moves | current piece | king position | tempboardLands
    let op = 2
    let tempLands = fakeGame()
    if (playerTurn === 1) op = 2
    if (playerTurn === 2) op = 1
    let playerPiecesPos = opMoves2(op,lands)
    let notMoves = []
    let finalPlay = []
    let king = findKing()
    let kingPos = king[0]
    playerPiecesPos.forEach(piecePos=>{
        let piecePosC = searchBoard(piecePos,board)
        let piece = document.getElementById(piecePos).children[0]
        let pieceType = piece.alt
        let pieceCr = piece.classList[1]
        let pieceLandsC = filterLandsCheck(pieceType,piecePosC,lands,pieceCr)
        pieceLandsC.forEach(x=>{
            let i = piecePosC
            let j = x
            tempLands = fakeGame()
            tempLands[i[0]][i[1]][1] = true
            tempLands[j[0]][j[1]][1] = false
            let opponentPiecesPos = opMoves2(playerTurn,tempLands)
            opponentPiecesPos.forEach(x0=>{
                let opponentPosC = searchBoard(x0,board)
                if((board[opponentPosC[0]][opponentPosC[1]] != board[x[0]][x[1]])){
                    let opponent = document.getElementById(x0).children[0]
                    let opponentType = opponent.alt
                    let opponentCr = opponent.classList[1]
                    let opponentLandsC = filterLandsCheck(opponentType,opponentPosC,tempLands,opponentCr)
                    opponentLandsC.forEach(x1=>{
                        if(!inArray(board[x1[0]][x1[1]],notMoves)) notMoves.push(board[x1[0]][x1[1]])
                    })
                }else{
                    if (!inArray(board[x[0]][x[1]],finalPlay)) finalPlay.push(board[x[0]][x[1]])
                }
            }) 
            if(!inArray(kingPos,notMoves)) if (!inArray(board[x[0]][x[1]],finalPlay)) finalPlay.push(board[x[0]][x[1]])
            notMoves = []
        })
    })
    return finalPlay
}

function restartGame(){
    location.reload();
}

function takeScreenshot() {
    document.getElementById('restart').style.display = "none"
    document.getElementById('screenshot').style.display = "none"
    document.getElementById('statics').style.display = "none"
    document.getElementById('winner').style.zIndex = "1"
    document.getElementById('soliderUp').style.zIndex = "0"
    document.getElementById('castlingdv').style.zIndex = "0"
    document.getElementById('main').style.zIndex = "1"
    document.getElementById('main').style.filter = "none"
    html2canvas(document.body).then(function(canvas) {
        // Convert canvas to an image
        var image = canvas.toDataURL();

        // Open the image in a new window/tab
        var newTab = window.open();
        newTab.document.body.innerHTML = '<img src="' + image + '">';

        // Download the image
        var link = document.createElement('a');
        link.download = 'screenshot.png';
        link.href = image;
        link.click();
    });
    setTimeout(restartGame,5000)
}

function gameOver(){
    if (gamemoves.length === 0){
        if (playerTurn === 1) winner = 2
        else winner = 1
        return true
    }else{
        return false
    }
}

function endGame(){
    document.removeEventListener('animationiteration',dragged)
    if ((winner === 1)&&(p1timel!='00:00'||p2timel!='00:00')) checksp1+= 1
    if ((winner === 2)&&(p1timel!='00:00'||p2timel!='00:00')) checksp2+= 1
    document.getElementById('main').style.filter = 'blur(5px)'
    document.getElementById('winner').style.display = 'flex'
    document.getElementById('winningp').innerText = winner
    document.getElementById('p1times').innerText = String(p1times)
    document.getElementById('p1timel').innerText = String(p1timel)
    document.getElementById('eatedp1').innerText = String(eatedp1)
    document.getElementById('leftp1').innerText = String(leftp1)
    document.getElementById('movesp1').innerText = String(movesp1)
    document.getElementById('checksp1').innerText = String(checksp1)
    document.getElementById('p2times').innerText = String(p2times)
    document.getElementById('p2timel').innerText = String(p2timel)
    document.getElementById('eatedp2').innerText = String(eatedp2)
    document.getElementById('leftp2').innerText = String(leftp2)
    document.getElementById('movesp2').innerText = String(movesp2)
    document.getElementById('checksp2').innerText = String(checksp2)
}

let boardR = 'landscape'

function rotateTable(){
    if (boardR === 'landscape'){
        boardR = 'portrait'
        document.documentElement.style.setProperty("--Degris","0deg")
        document.documentElement.style.setProperty("--Degriss","0deg")
    }else{
        boardR = 'landscape'
        document.documentElement.style.setProperty("--Degris","-90deg")
        document.documentElement.style.setProperty("--Degriss","90deg")
    }
}
