let myContent = document.querySelector("#content");
myContent.append = document.createElement("table");

let myContentTable = document.querySelector("#table-content");

const ejeX = [];
const matriz = [];

let secure = 0;

/**
 * Generamos las coordenadas de las minas.
 */
while (matriz.length < 8) {
    let isCoorExist = false;
    let numX = Math.floor(Math.random() * 8 + 1);
    let numY = Math.floor(Math.random() * 8 + 1);
    console.log(`iteracion ${secure + 1} || coordenadas = ${numX}, ${numY}`);

    let matrizSize = matriz.length;
    if (matrizSize > 0) {
        for (let i = 0; i < matrizSize; i++) {
            if (matriz[i][0] === numX && matriz[i][1] === numY) {
                isCoorExist = true;
                console.log("repeat");
            }
        }
    }

    if (!isCoorExist) {
        let subMtrz = [numX, numY];
        matriz.push(subMtrz);
    }

    secure++;
    if (secure >= 30) {
        break;
    }
}

console.log(matriz);

function tableCell(x, y, type = null, value = null, number = 0) {
    this.x = x;
    this.y = y;
    this.type = type; //  0 vacio, 1 mina, 2 cercano?
    this.state = value; // 0 sin descubrir, 1 descubierto,  2 bandera
    this.number = number;
}

/**
 * Generar tablero.
 */
for (let i = 0; i < 8; i++) {
    let ejeY = [];
    for (let j = 0; j < 8; j++) {
        let cell = new tableCell(i, j, 0, 0);

        let matrizSize = matriz.length;
        if (matrizSize > 0) {
            for (let k = 0; k < matrizSize; k++) {
                if (
                    matriz[k][0] - 1 === cell.x &&
                    matriz[k][1] - 1 === cell.y
                ) {
                    cell.type = 1;
                }
            }
        }

        ejeY[j] = cell;
    }
    ejeX[i] = ejeY;
}

// const validateCell = (idx, idy, callback) => {
//     let validCell = [];

//     for (let iniX = -1; iniX <= 1; iniX++) {
//         for (let iniY = -1; iniY <= 1; iniY++) {
//             console.log(idx, idy);
//             console.log(idx - iniX, idy - iniY);

//             if (iniX === 0 && iniY === 0) {
//                 continue;
//             }

//             if (
//                 idx - iniX < 0 ||
//                 idy - iniY < 0 ||
//                 idx - iniX >= 8 ||
//                 idy - iniY >= 8
//             ) {
//                 continue;
//             }

//             console.log(`output : ${idx - iniX} ${idy - iniY}`);

//             console.log("for ite");
//             validCell.push([idx - iniX, idy - iniY]);
//         }
//     }

//     return callback(validCell);
// };

const getCountMine = (idx, idy) => {
    let countMin = 0;
    for (let iniX = -1; iniX <= 1; iniX++) {
        for (let iniY = -1; iniY <= 1; iniY++) {
            console.log(idx, idy);
            console.log(idx - iniX, idy - iniY);

            if (iniX === 0 && iniY === 0) {
                continue;
            }

            if (
                idx - iniX < 0 ||
                idy - iniY < 0 ||
                idx - iniX >= 8 ||
                idy - iniY >= 8
            ) {
                continue;
            }
            console.log(`output : ${idx - iniX} ${idy - iniY}`);

            let objEval = ejeX[idx - iniX][idy - iniY];

            if (objEval.type == 1) {
                countMin++;
            }
        }
    }
    console.log(countMin);
    return countMin;
};

let htmlDescription = "";
for (let i = 0; i < ejeX.length; i++) {
    let ejeY = ejeX[i];
    htmlDescription += `<tr>`;
    for (let j = 0; j < ejeY.length; j++) {
        console.log(`NEW CELL EVAL`);
        let cellMine = ejeY[j];
        htmlDescription += `<td class='block-content' id='celda-${i}-${j}' ejex='${i}' ejey='${j}'><div class='box-fade'><i ></i></div>`;

        if (cellMine.type === 1) {
            htmlDescription += `M`;
            htmlDescription += `</td>`;
            continue;
        }

        let miness = getCountMine(cellMine.x, cellMine.y);
        ejeX[i][j].number = miness;
        htmlDescription += `${miness==0 ? '' :miness}`;
        htmlDescription += `</td>`;
    }
    htmlDescription += `</tr>`;
}
myContentTable.innerHTML = htmlDescription;


console.log(ejeX);

getCountMine(1, 1);

function addEvents() {
    for (let i = 0; i < ejeX.length; i++) {
        let ejeY = ejeX[i];
        for (let j = 0; j < ejeY.length; j++) {
            let htmlCellAddEvent = document.getElementById(`celda-${i}-${j}`);
            htmlCellAddEvent.addEventListener("mouseup", function (me) {
                console.log(me);
                console.log(this);
                console.log(`celda-${i}-${j}`);
                let bandera = document.querySelector(`#celda-${i}-${j} i`);
                
                if (me.button == 0) {
                    if (ejeX[i][j].type == 1) {
                        document.querySelector(`#celda-${i}-${j}`).classList.add('danger')
                        alert("BOOM");
                    }
                    openArea( i, j);
                } else if (me.button == 2){
                    if (ejeX[i][j].state == 1) {
                        return;
                    }
                    if (ejeX[i][j].state == 2) {
                        bandera.innerHTML = ''
                        ejeX[i][j].state = 0
                        return;
                    }
                    ejeX[i][j].state = 2;
                    bandera.innerHTML = 'B'
                }
            });
        }
    }
}
addEvents()

function openArea( x, y){
    if (ejeX[x][y].state == 1 || ejeX[x][y].state == 2 ) {
        return;
    }
    let celda = document.getElementById(`celda-${x}-${y}`)
    celda.classList.add('fade');
    ejeX[x][y].state = 1;
    if (ejeX[x][y].number == 0 && ejeX[x][y].type != 1) {

        for (let iniX = -1; iniX <= 1; iniX++) {
            for (let iniY = -1; iniY <= 1; iniY++) {
                if (iniX === 0 && iniY === 0) {
                    continue;
                }
                if (
                    x - iniX < 0 ||
                    y - iniY < 0 ||
                    x - iniX >= 8 ||
                    y - iniY >= 8
                ) {
                    continue;
                }

                openArea(x - iniX, y - iniY);
            }
        }
    }
}