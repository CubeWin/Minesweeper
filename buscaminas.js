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
    this.banderas = intMinas;

    if (intNivel == 0) {
        this.filas = 8;
        this.columnas = 8;
        this.minas = 8;
    } else if (intNivel == 1) {
        this.filas = 16;
        this.columnas = 16;
        this.minas = 40;
    } else if (intNivel == 2) {
        this.filas = 16;
        this.columnas = 30;
        this.minas = 99;
    } else {
        this.filas = 9;
        this.columnas = 9;
        this.minas = 12;
    }
}

buscaminasGame.prototype.genCoorMinas = function () {
    const intCant = this.minas;
    const intFilas = this.filas;
    const intColumnas = this.columnas;
    let secure = 0;

    while (this.ArrMinas.length < intCant) {
        let isCoorExist = false;
        let intCoorX = Math.floor(Math.random() * intFilas);
        let intCoorY = Math.floor(Math.random() * intColumnas);

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
        if (secure >= 180) {
            break;
        }
    }
};

buscaminasGame.prototype.genVirtualTable = function () {
    const intFilas = this.filas;
    const intColumnas = this.columnas;

    for (let i = 0; i < intFilas; i++) {
        let arrTableRow = [];

        for (let j = 0; j < intColumnas; j++) {
            let objCell = new objCelda(i, j, 0, 0);
            let arrMinas = this.ArrMinas;
            arrMinas.forEach((e) => {
                if (e[0] === objCell.x && e[1] === objCell.y) {
                    objCell.type = 1;
                }
            });

            arrTableRow[j] = objCell;
        }
        this.virtualTable[i] = arrTableRow;
    }
};

buscaminasGame.prototype.genHtmlTable = function () {
    const tagContentTable = document.getElementById("table-content");
    const intFilas = this.filas;
    const intColumnas = this.columnas;

    this.genCoorMinas();
    this.genVirtualTable();

    for (let i = 0; i < intFilas; i++) {
        let elementRow = document.createElement("tr");

        for (let j = 0; j < intColumnas; j++) {
            let elementCell = document.createElement("td");
            elementCell.setAttribute("class", "block-content");
            elementCell.setAttribute("id", `celda-${i}-${j}`);
            elementCell.addEventListener("mouseup", (e) => {
                let elementCelda = document.querySelector(`#celda-${i}-${j}`);
                let elementIconChild = document.querySelector(
                    `#celda-${i}-${j} i`
                );
                console.log(e.button);
                switch (e.button) {
                    case 0:
                        if (
                            this.virtualTable[i][j].state == 1 ||
                            this.virtualTable[i][j].state == 2
                        ) {
                            return;
                        }

                        if (this.virtualTable[i][j].type === 1) {
                            alert("MINA!");
                            this.perdida();
                            // ! LOSSE GAME
                        }

                        elementIconChild.classList.add("fade");

                        this.openArea(i, j);

                        break;
                    case 1:
                        if (this.virtualTable[i][j].state !== 1) {
                            console.log("scroll return");
                            return;
                        }
                        console.log("scroll clic");
                        break;
                    case 2:
                        if (this.virtualTable[i][j].state == 1) {
                            return;
                        }
                        if (this.virtualTable[i][j].state == 2) {
                            elementIconChild.textContent = "";
                            this.virtualTable[i][j].state = 0;
                            this.banderas++;
                            return;
                        }
                        this.virtualTable[i][j].state = 2;
                        elementIconChild.textContent = "B";
                        this.banderas--;
                        break;

                    default:
                        break;
                }
                this.victoria();
            });

            let elementDivBox = document.createElement("div");
            elementDivBox.setAttribute("class", "box-fade");

            let elementIcon = document.createElement("i");

            elementDivBox.appendChild(elementIcon);
            elementCell.appendChild(elementDivBox);
            elementRow.appendChild(elementCell);

            // create numbers
            this.genNumberMines(i, j);
            if (this.virtualTable[i][j].type === 1) {
                this.virtualTable[i][j].number = -1;
            }
        }
        tagContentTable.appendChild(elementRow);
    }
};

buscaminasGame.prototype.genNumberMines = function (x, y) {
    let intCountMinas = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            if (
                x - i < 0 ||
                y - j < 0 ||
                x - i >= this.filas ||
                y - j >= this.columnas
            ) {
                continue;
            }

            if (this.virtualTable[x - i][y - j].type === 1) {
                intCountMinas++;
            }
        }
    }
    this.virtualTable[x][y].number = intCountMinas;
    console.log(`eje [${x}, ${y}] minas = ${intCountMinas}`);
};

buscaminasGame.prototype.openArea = function (x, y) {
    if (
        this.virtualTable[x][y].state === 1 ||
        this.virtualTable[x][y].state === 2
    ) {
        return;
    }

    let elementCelda = document.getElementById(`celda-${x}-${y}`);
    elementCelda.classList.add("fade");
    elementCelda.childNodes[0].textContent =
        this.virtualTable[x][y].number == 0
            ? ""
            : this.virtualTable[x][y].number;

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
                if (
                    x - i < 0 ||
                    y - j < 0 ||
                    x - i >= this.filas ||
                    y - j >= this.columnas
                ) {
                    continue;
                }

                this.openArea(x - i, y - j);
            }
        }
    }
};

buscaminasGame.prototype.victoria = function () {
    for (let i = 0; i < this.filas; i++) {
        for (let j = 0; j < this.columnas; j++) {
            if (this.virtualTable[i][j].state !== 1) {
                if (this.virtualTable[i][j].type === 1) {
                    continue;
                } else {
                    return;
                }
            }
        }
    }

    let tagContentTable = document.getElementById("table-content");
    tagContentTable.style.backgroundColor = "green";
    alert("victoria!");
};

buscaminasGame.prototype.perdida = function () {
    let arrMinas = this.ArrMinas;
    arrMinas.forEach(e=>{
        let i = e[0];
        let j = e[1];
        let elementCelda = document.getElementById(`celda-${i}-${j}`);
        elementCelda.classList.add("danger");
        elementCelda.classList.add("fade");
        elementCelda.childNodes[0].textContent =
            this.virtualTable[i][j].number == 0
                ? ""
                : this.virtualTable[i][j].number;
    })
};

let juego = null;

function nuevoJuego(a = 0, b = 0, c = 0) {
    const tagContentTable = document.getElementById("table-content");
    tagContentTable.innerHTML = "";
    juego = new buscaminasGame(a);
    juego.genHtmlTable();
    // console.log(newGame.ArrMinas);
    // console.log(newGame.virtualTable);
}

function resetJuego() {
    const tagContentTable = document.getElementById("table-content");
    tagContentTable.innerHTML = "";
    juego.genHtmlTable();
}

nuevoJuego();
