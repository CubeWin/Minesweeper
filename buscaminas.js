function objCelda(x, y, type = null, value = null, number = 0) {
    this.x = x;
    this.y = y;
    this.type = type; //  0 vacio, 1 mina, 2 cercano?
    this.state = value; // 0 sin descubrir, 1 descubierto,  2 bandera
    this.number = number;
}

function buscaminasGame(
    intNivel = 0,
    intFilas = 0,
    intColumnas = 0,
    intMinas = 0
) {
    this.nivel = intNivel;
    this.filas = intFilas;
    this.columnas = intColumnas;
    this.minas = intMinas;
    this.virtualTable = [];
    this.ArrMinas = [];

    if (intNivel == 0) {
        this.filas = 8;
        this.columnas = 8;
        this.minas = 8;
    }
}

buscaminasGame.prototype.genCoorMinas = function () {
    const intCant = this.minas;
    let secure = 0;

    while (this.ArrMinas.length < intCant) {
        let isCoorExist = false;
        let intCoorX = Math.floor(Math.random() * intCant);
        let intCoorY = Math.floor(Math.random() * intCant);

        let ArrMinasSize = this.ArrMinas.length;
        if (ArrMinasSize > 0) {
            for (let i = 0; i < ArrMinasSize; i++) {
                if (
                    this.ArrMinas[i][0] === intCoorX &&
                    this.ArrMinas[i][1] === intCoorY
                ) {
                    isCoorExist = true;
                }
            }
        }

        if (!isCoorExist) {
            let subMtrz = [intCoorX, intCoorY];
            this.ArrMinas.push(subMtrz);
        }

        secure++;
        if (secure >= 30) {
            break;
        }
    }
};

// const genCoorMinas = (intCant = 8) => {
//     const ArrMinas = [];
//     while (ArrMinas.length < intCant) {
//         let isCoorExist = false;
//         let intCoorX = Math.floor(Math.random() * intCant);
//         let intCoorY = Math.floor(Math.random() * intCant);

//         let ArrMinasSize = ArrMinas.length;
//         if (ArrMinasSize > 0) {
//             for (let i = 0; i < ArrMinasSize; i++) {
//                 if (
//                     ArrMinas[i][0] === intCoorX &&
//                     ArrMinas[i][1] === intCoorY
//                 ) {
//                     isCoorExist = true;
//                 }
//             }
//         }

//         if (!isCoorExist) {
//             let subMtrz = [intCoorX, intCoorY];
//             ArrMinas.push(subMtrz);
//         }
//     }
//     return ArrMinas;
// };

buscaminasGame.prototype.genVirtualTable = function () {
    const intCant = this.minas;

    for (let i = 0; i < intCant; i++) {
        let arrTableRow = [];

        for (let j = 0; j < intCant; j++) {
            let objCell = new objCelda(i, j, 0, 0);

            let arrMinas = this.ArrMinas;
            let arrMinasSize = arrMinas.length;
            if (arrMinasSize > 0) {
                for (let k = 0; k < arrMinasSize; k++) {
                    if (
                        arrMinas[k][0] === objCell.x &&
                        arrMinas[k][1] === objCell.y
                    ) {
                        objCell.type = 1;
                    }
                }
            }

            arrTableRow[j] = objCell;
        }
        this.virtualTable[i] = arrTableRow;
    }
};

// const genVirtualTable = (intCant = 8) => {
//     let arrVirtualTable = [];
//     for (let i = 0; i < intCant; i++) {
//         let arrTableRow = [];

//         for (let j = 0; j < intCant; j++) {
//             let objCell = new objCelda(i, j, 0, 0);

//             let arrMinas = genCoorMinas();
//             let arrMinasSize = arrMinas.length;
//             if (arrMinasSize > 0) {
//                 for (let k = 0; k < arrMinasSize; k++) {
//                     if (
//                         arrMinas[k][0] === objCell.x &&
//                         arrMinas[k][1] === objCell.y
//                     ) {
//                         objCell.type = 1;
//                     }
//                 }
//             }

//             arrTableRow[j] = objCell;
//         }
//         arrVirtualTable[i] = arrTableRow;
//     }
//     return arrVirtualTable;
// };

// function openArea(x, y) {}

buscaminasGame.prototype.genHtmlTable = function () {
    let tagContentTable = document.getElementById("table-content");

    this.genCoorMinas();
    this.genVirtualTable();
    let virtualTable = this.virtualTable;

    for (let i = 0; i < virtualTable.length; i++) {
        let virtualRow = virtualTable[i];
        let elementRow = document.createElement("tr");

        for (let j = 0; j < virtualRow.length; j++) {
            let elementCell = document.createElement("td");
            elementCell.setAttribute("class", "block-content");
            elementCell.setAttribute("id", `celda-${i}-${j}`);
            elementCell.addEventListener("mouseup", function (e) {
                console.log(e);
                console.log(this.id);
                console.log(this.childNodes[0].childNodes[0]);
                let elementIconChild = this.childNodes[0].childNodes[0];
                switch (e.button) {
                    case 0:
                        if (virtualTable[i][j].type === 1) {
                            this.classList.add("danger");
                            alert("MINA!");
                        }

                        if (
                            virtualTable[i][j].state == 1 ||
                            virtualTable[i][j].state == 2
                        ) {
                            return;
                        }

                        this.classList.add("fade");
                        // openArea(i,j)
                        // function openArea(x, y) {
                        //     console.log(
                        //         `Estado ${virtualTable[x][y].state} \n Ejex = ${x} | Ejey = ${y}`
                        //     );
                        //     if (
                        //         virtualTable[x][y].state == 1 ||
                        //         virtualTable[x][y].state == 2
                        //     ) {
                        //         return;
                        //     }

                        //     let celda = document.getElementById(
                        //         `celda-${x}-${y}`
                        //     );
                        //     celda.classList.add("fade");

                        //     virtualTable[x][y].state = 1;
                        //     if (
                        //         virtualTable[x][y].number == 0 &&
                        //         virtualTable[x][y].type != 1
                        //     ) {
                        //         for (let iniX = -1; iniX <= 1; iniX++) {
                        //             for (let iniY = -1; iniY <= 1; iniY++) {
                        //                 if (iniX === 0 && iniY === 0) {
                        //                     continue;
                        //                 }
                        //                 if (
                        //                     x - iniX < 0 ||
                        //                     y - iniY < 0 ||
                        //                     x - iniX >= 8 ||
                        //                     y - iniY >= 8
                        //                 ) {
                        //                     continue;
                        //                 }

                        //                 openArea(x - iniX, y - iniY);
                        //             }
                        //         }
                        //     }
                        // }
                        // openArea(i, j);
                        this.openArea(i,j);

                        break;
                    case 2:
                        if (virtualTable[i][j].state == 1) {
                            return;
                        }
                        if (virtualTable[i][j].state == 2) {
                            elementIconChild.textContent = "";
                            virtualTable[i][j].state == 0;
                            return;
                        }
                        virtualTable[i][j].state = 2;
                        elementIconChild.textContent = "B";
                        break;

                    default:
                        break;
                }
            });

            let elementDivBox = document.createElement("div");
            elementDivBox.setAttribute("class", "box-fade");

            let elementIcon = document.createElement("i");

            elementDivBox.appendChild(elementIcon);
            elementCell.appendChild(elementDivBox);
            elementRow.appendChild(elementCell);
        }
        tagContentTable.appendChild(elementRow);
    }
};

buscaminasGame.prototype.openArea = function (x, y) {
    if (
        this.virtualTable[x][y].state === 1 ||
        this.virtualTable[x][y.state === 2]
    ) {
        return;
    }

    let elementCelda = document.getElementById(`celda-${x}-${y}`);
    elementCelda.classList.add("fade");

    this.virtualTable[x][y].state = 1;

    if (
        this.virtualTable[x][y].number === 0 &&
        this.virtualTable[x][y].type !== 1
    ) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) {
                    continue;
                }
                if (x - i < 0 || y - j < 0 || x - i >= 8 || y - j >= 8) {
                    continue;
                }

            }
        }
    }
};

function openArea(x, y) {
    if (ejeX[x][y].state == 1 || ejeX[x][y].state == 2) {
        return;
    }
    let celda = document.getElementById(`celda-${x}-${y}`);
    celda.classList.add("fade");
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

// const genHtmlTable = () => {
//     let tagContentTable = document.getElementById("table-content");
//     let virtualTable = genVirtualTable(8);
//     for (let i = 0; i < virtualTable.length; i++) {
//         let virtualRow = virtualTable[i];
//         let elementRow = document.createElement("tr");

//         for (let j = 0; j < virtualRow.length; j++) {
//             let elementCell = document.createElement("td");
//             elementCell.setAttribute("class", "block-content");
//             elementCell.setAttribute("id", `celda-${i}-${j}`);
//             elementCell.addEventListener("mouseup", function (e) {
//                 console.log(e);
//                 console.log(this.id);
//                 console.log(this.childNodes[0].childNodes[0]);
//                 let elementIconChild = this.childNodes[0].childNodes[0];
//                 switch (e.button) {
//                     case 0:
//                         if (virtualTable[i][j].type === 1) {
//                             this.classList.add("danger");
//                         }

//                         if (
//                             virtualTable[i][j].state == 1 ||
//                             virtualTable[i][j].state == 2
//                         ) {
//                             return;
//                         }

//                         this.classList.add("fade");
//                         virtualTable[i][j].state = 1;
//                         if (
//                             virtualTable[i][j].number == 0 &&
//                             virtualTable[i][j].type != 1
//                         ) {
//                             for (let iniX = -1; iniX <= 1; iniX++) {
//                                 for (let iniY = -1; iniY <= 1; iniY++) {
//                                     if (iniX === 0 && iniY === 0) {
//                                         continue;
//                                     }
//                                     if (
//                                         i - iniX < 0 ||
//                                         j - iniY < 0 ||
//                                         i - iniX >= 8 ||
//                                         j - iniY >= 8
//                                     ) {
//                                         continue;
//                                     }
//                                 }
//                             }
//                         }
//                         break;
//                     case 2:
//                         if (virtualTable[i][j].state == 1) {
//                             return;
//                         }
//                         if (virtualTable[i][j].state == 2) {
//                             elementIconChild.textContent = "";
//                             virtualTable[i][j].state == 0;
//                             return;
//                         }
//                         virtualTable[i][j].state = 2;
//                         elementIconChild.textContent = "B";
//                         break;

//                     default:
//                         break;
//                 }
//             });

//             let elementDivBox = document.createElement("div");
//             elementDivBox.setAttribute("class", "box-fade");

//             let elementIcon = document.createElement("i");

//             elementDivBox.appendChild(elementIcon);
//             elementCell.appendChild(elementDivBox);
//             elementRow.appendChild(elementCell);
//         }
//         tagContentTable.appendChild(elementRow);
//     }
// };

// genHtmlTable();

let newGame = new buscaminasGame();
newGame.genHtmlTable();
console.log(newGame.ArrMinas);
console.log(newGame.virtualTable);
