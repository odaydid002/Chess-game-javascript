const playerPiece = document.querySelectorAll('.piece')
const squares = document.querySelectorAll('.board-squire')

playerTurn = 1

blackPieces = ['castle1b','horse1b','elephant1b','castle2b','horse2b','elephant2b','king1b','qween1b','solider1b','solider2b','solider3b','solider4b','solider5b','solider6b','solider7b','solider8b']
whitePieces = ['castle1w','horse1w','elephant1w','castle2w','horse2w','elephant2w','king1w','qween1w','solider1w','solider2w','solider3w','solider4w','solider5w','solider6w','solider7w','solider8w']

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

let beingDragged
let beingDraggedE
let beingDraggedP
let soldPosB
let defeated
let bd = []
let opp = []
let ff2 = []
let tempff

reloadBoard()

function dragStart(e){
    // console.log(allMoves(e.target.classList[1]))
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
    ff = filterLands(p,currentPos,lands,pieceColor)[0]
    tempff = []
    if (sold ==='king'){
        tempff = ff
        ff = []
        tempff.forEach(x=>{
            if(kingCheck(pieceColor,currentPosB)[0]){
                if(!inArray(board[x[0]][x[1]],kingCheck(pieceColor,currentPosB)[1])) ff.push(x)
            }
        })
    }
    let pu
    if (sold ==="solider" || sold ==="soliderl"){
        soldPos = currentPosB
        if ((sold ==="solider") && (soldPos[1] === '2') && (Number(soldPos[1]) + 2)<=7){
            pu = searchBoard((soldPos[0] + String(Number(soldPos[1]) + 2)),board)
            if(lands[pu[0]+1][pu[1]][1]) ff.push(pu)
        }
        if ((sold ==="soliderl") && (soldPos[1] === '7') && (Number(soldPos[1]) - 2)>=0){
            pu = searchBoard((soldPos[0] + String(Number(soldPos[1]) - 2)),board)
            if(lands[pu[0]-1][pu[1]][1]) ff.push(pu)
        }
    }
    ff.forEach(f=>{
        ff2.push(board[f[0]][f[1]])
    })
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
        if(p!='king'){
            canE.forEach(c=>{
            document.getElementById(c).classList.add('canEat')
        })
        }else{
            canKE = filterKLands('king',beingDraggedP,lands,beingDragged.classList[1])[1]
            canKE.forEach(c=>{
                document.getElementById(c).classList.add('canEat')
            })
        }
        
    }

}

function dragOver(e){
    e.preventDefault()
}

function dragDrop(e){
    if((((playerTurn === 1)&&(pieceColor === 'white'))||((playerTurn === 2)&&(pieceColor === 'black')))){
        if(beingDragged.alt!='king'){
            if(inArray(e.target.id,moves)){
                nextSquare = e.target.id
                cnp = ff2
                if (inArray(nextSquare,cnp)){
                    canDrop = true
                }else{
                    e.target.classList.add('cantMove')
                    canDrop = false
                }
            }else if (inArray(nextSquare,canE)){
                canEat = true
            }else{
                canEat = false
            }
            if(canEat === true){
                eatPiece(e)
                turnChange()
            }else if((canDrop === true)){
                e.target.append(beingDragged)
                canDrop = false
                turnChange()
            }     
            reloadBoard()
        }else{
            canKE = filterKLands('king',beingDraggedP,lands,beingDragged.classList[1])[1]
            canDrop = false
            canEat = false
            if(inArray(e.target.id,moves)){
                nextSquare = e.target.id
                cnp = ff2
                if (cnp!=[] && inArray(nextSquare,cnp)){
                    canDrop = true
                }else{
                    e.target.classList.add('cantMove')
                    canDrop = false
                }
            }else{
                nextSquare = e.toElement.parentElement.id
                if (inArray(nextSquare,canKE)){
                    canEat = true
                }else{
                    canEat = false
                }
            }
            if(canEat === true){
                eatPiece(e)
                turnChange()
            }else if(canDrop === true){
                e.target.append(beingDragged)
                canDrop = false
                turnChange()
            }     
            reloadBoard()
        }
        
    }
}

let cr
let op

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
        }
    } 
}

function dragLeave(e){
    e.target.classList.remove('cantMove')
    canDrop = false
    canEat = false
}

let tB = '0:0'
let tW = '0:0'

function turnChange(){
    const ptrd = document.getElementById('pTurnd')
    const ptrn = document.getElementById('pTurn')
    if (playerTurn === 1){
        playerTurn++
        ptrn.innerText = "Black "+tB
        ptrn.style.color = "#9c885c"
        ptrd.style.backgroundColor = 'rgba(36, 24, 0, 0.616)'
        ptrd.style.borderColor = "#beb07fd5"
    }else if(playerTurn === 2){
        playerTurn--
        ptrn.innerText = "White "+tW
        ptrn.style.color = '#221700'
        ptrd.style.backgroundColor = 'rgba(236, 217, 176, 0.5)'
        ptrd.style.borderColor = "rgba(32, 18, 0, 0.603)"
    }
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
    return [canM,canE]
}

function filterKLands(piece,piecePos,lands,pieceColor){
    let canKM = []
    canKE = []
    let d1,d2
if(piece === 'king'){
        i = piecePos[0]
        j = piecePos[1]
        if(i+1<=7){
            d1 = document.getElementById(board[i+1][j])
            if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                canKE.push(board[i+1][j])
            }else if (lands[i+1][j][1]) canKM.push([i+1,j])
            if ((j+1<=7)){
                d1 = document.getElementById(board[i+1][j+1])
                if((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                    canKE.push(board[i+1][j+1])
                }else if (lands[i+1][j+1][1]) canKM.push([i+1,j+1])
            } 
            if((j-1>=0)){
                d1 = document.getElementById(board[i+1][j-1])
                if((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                    canKE.push(board[i+1][j-1])
                }else if (lands[i+1][j-1][1]) canKM.push([i+1,j-1])
            } 
        }
        i = piecePos[0]
        j = piecePos[1]
        if(i-1>=0){
            d1 = document.getElementById(board[i-1][j])
            if ((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                canKE.push(board[i-1][j])
            }else if (lands[i-1][j][1]) canKM.push([i-1,j])
            if ((j+1<=7)){
                d1 = document.getElementById(board[i-1][j+1])
                if((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                    canKE.push(board[i-1][j+1])
                }else if (lands[i-1][j+1][1]) canKM.push([i-1,j+1])
            }  
            if((j-1>=0)){
                d1 = document.getElementById(board[i-1][j-1])
                if((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                    canKE.push(board[i-1][j-1])
                }else if (lands[i-1][j-1][1]) canKM.push([i-1,j-1])
            } 
        }
        if((j+1<=7)){
            d1 = document.getElementById(board[i][j+1])
            if((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                canKE.push(board[i][j+1])
            }else if (lands[i][j+1][1]) canKM.push([i,j+1])   
        }
        if((j-1>=0)){
            d1 = document.getElementById(board[i][j-1])
            if((d1.firstChild !=null)&&(d1.firstChild.classList[1] != pieceColor)){
                canKE.push(board[i][j-1])
            }else if (lands[i][j-1][1]) canKM.push([i,j-1])
        }

    return [canKM,canKE]
}}

function reloadBoard(){
    let j = 0
    lands = []
    eated = false
    canDrop = false
    canEat = false
    canPlay = false
    bd = []
    opp = []
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
    if (findKing()[0]){
        if (kingCheck(findKing()[2],findKing()[1])[0]){
            document.getElementById(findKing()[1]).classList.add('check')
        }
    }

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

let whiteTime = 0
let weTime = 0
let whiteTimeS = 0
let whiteTimeM = 0
let blackTime = 0
let bkTime = 0
let blackTimeS = 0
let blackTimeM = 0

const map_interval = (x, in_min, in_max, out_min, out_max) => {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}

function roundTo(number, digits) {
    var multiplier = Math.pow(10, digits);
    return Math.round(number * multiplier) / multiplier;
  }

function dragged(){
    const ptrn = document.getElementById('pTurn')
    if ((playerTurn === 1)){
        whiteTime += 60
        if (whiteTime >= 60){
            whiteTimeS += 1
            weTime +=1
            whiteTime = 0
            clkW = String('White '+whiteTimeM+':'+whiteTimeS)
            ptrn.innerText = clkW
        }
        if (whiteTimeS >= 59){
            whiteTimeM +=1
            whiteTimeS = 0
        }
        wTm = roundTo(map_interval(weTime,0,600,100,0),2)
        document.getElementById('whiteTime').style.height = String(wTm)+'dvh'
    }
    if ((playerTurn === 2)){
        blackTime += 60
        if (blackTime >= 60){
            blackTimeS += 1
            bkTime +=1
            blackTime = 0
            clkB = String('Black '+blackTimeM+':'+blackTimeS)
            ptrn.innerText = clkB
        }
        if (blackTimeS >= 59){
            blackTimeM +=1
            blackTimeS = 0
        }
        bTm = roundTo(map_interval(bkTime,0,600,100,0),2)
        document.getElementById('blackTime').style.height = String(bTm)+'dvh'
    }
    tB = String(blackTimeM+':'+blackTimeS)
    tW = String(whiteTimeM+':'+whiteTimeS)
}

function kingCheck(kingColor,kingPos){
    checkK = []
    check = []
    let tCheck
    let pCr,t
    let fdc = false
    let fdp = []
    let X
    if (kingColor === 'black') pCr = 'white'
    else pCr = 'Black'
    for (let i=0;i<=63;i++){
        let pcs = document.getElementById(moves[i])
        if((pcs.firstChild != null)&&(kingColor!=pcs.firstChild.classList[1])){
            t = filterLands(pcs.firstChild.alt,searchBoard(moves[i],board),lands,pCr)[0]
            canE = filterKLands('king',searchBoard(kingPos,board),lands,kingColor)[1]
            canE.forEach(c=>{
                if (c === kingPos){
                    check.push(t)
                    tCheck = true
                }
                t2 = filterKLands('king',searchBoard(kingPos,board),lands,kingColor)[0]
                canKE = filterKLands('king',searchBoard(kingPos,board),lands,kingColor)[1]
                canKE.forEach(x=>{
                    if (inArray(x,canE)) {
                        fdc = true
                        X = x
                    }
                })
            })
            if(fdc){
                fdp.push(X)
                fdc = false
            }
        }
    }
    check.forEach(o=>{
        if(o.length>0){
            o.forEach(s=>{
                checkK.push(board[s[0]][s[1]])
            })  
        }
    })
    fdp.forEach(x=>{
        if(X.length>0) checkK.push(x)
    })
    if (tCheck){return [true,checkK]
    }else{return [false,checkK]}
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
        return [true,posistion,kingCo,king0]
    }else{
        return [false,null,kingCo,king0]
    }
}

function allMoves(color){
    let Mvg = []
    moves.forEach(x=>{
        const child0 = document.getElementById(x)
        if(child0.firstChild!=null){
            pic = child0.firstChild
            if (child0.firstChild.classList[1]===color){
                if(pic.alt === 'king'){
                    Mv = filterKLands('king',searchBoard(x,board),lands,color)[0]
                    Mv.forEach(x0=>{
                        if((x0!=[])&&!inArray(board[x0[0]][x0[1]],Mvg)) Mvg.push(board[x0[0]][x0[1]])
                    })
                }else{
                    Mv = filterLands(pic.alt,searchBoard(x,board),lands,color)[0]
                    Mv.forEach(x0=>{
                        if((x0!=[])&&!inArray(board[x0[0]][x0[1]],Mvg)) Mvg.push(board[x0[0]][x0[1]])
                    })
                }
            }
        }
    })
    return Mvg
}

//1000