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
    this.isGameOver = false;

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
        this.filas = intFilas;
        this.columnas = intColumnas;
        this.minas = intMinas;
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
    const intFilas = this.filas;
    const intColumnas = this.columnas;
    const intBanderas = this.minas;

    this.banderas = this.minas;
    this.isGameOver = false;

    this.genCoorMinas();
    this.genVirtualTable();

    for (let i = 0; i < intFilas; i++) {
        let elementRow = document.createElement("tr");

        for (let j = 0; j < intColumnas; j++) {
            let elementTDCell = document.createElement("td");
            let elementCell = document.createElement("div");
            elementCell.setAttribute("class", "cw_cell-xl block-size");
            elementCell.setAttribute("id", `celda-${i}-${j}`);
            elementCell.addEventListener("mouseup", (e) => {
                if (this.isGameOver) {
                    return;
                }

                let elementCelda = document.querySelector(`#celda-${i}-${j}`);
                let elementIconChild = document.querySelector(
                    `#celda-${i}-${j} i`
                );
                console.log(e.button);
                switch (e.button) {
                    case 0:
                        let MineOrFlag = document.getElementById('cw_checkOpen');
                        if (MineOrFlag.checked) {
                            this.putFlag(i, j);
                            return
                        }

                        if (
                            this.virtualTable[i][j].state == 1 ||
                            this.virtualTable[i][j].state == 2
                        ) {
                            return;
                        }

                        if (this.virtualTable[i][j].type === 1) {
                            this.perdida();
                            // ! LOSSE GAME
                        }

                        elementIconChild.classList.add("fade");

                        this.openArea(i, j);

                        break;

                    case 1:
                        if (this.virtualTable[i][j].state !== 1) {
                            return;
                        }
                        this.openNear(i, j);
                        break;

                    case 2:
                        this.putFlag(i, j);
                    default:
                        break;
                }
                this.victoria();
            });
            elementCell.addEventListener("dblclick", (e) => {
                if (this.isGameOver) {
                    return;
                }
                if (this.virtualTable[i][j].state !== 1) {
                    return;
                }
                this.openNear(i, j);
                this.victoria();
            });

            let elementDivBox = document.createElement("div");
            elementDivBox.setAttribute("class", "box-fade");

            let elementIcon = document.createElement("i");

            elementDivBox.appendChild(elementIcon);
            elementCell.appendChild(elementDivBox);
            elementTDCell.appendChild(elementCell);
            elementRow.appendChild(elementTDCell);

            // create numbers
            this.genNumberMines(i, j);
            if (this.virtualTable[i][j].type === 1) {
                this.virtualTable[i][j].number = -1;
            }
        }
        const tagContentTable = document.getElementById("table-content");
        const tagContadorMinas = document.getElementById("contador_minas");
        const tagModalResult = document.getElementById("cw_win_game");
        tagContentTable.appendChild(elementRow);
        tagContadorMinas.textContent = this.banderas
            .toString()
            .padStart(3, "0");
        tagModalResult.classList.add("hidden");
    }
};

buscaminasGame.prototype.putFlag = function (i, j) {
    const tagContadorMinas = document.getElementById("contador_minas");
    let elementIconChild = document.querySelector(`#celda-${i}-${j} i`);

    if (this.virtualTable[i][j].state == 1) {
        return;
    }
    if (this.virtualTable[i][j].state == 2) {
        elementIconChild.textContent = "";
        this.virtualTable[i][j].state = 0;
        this.banderas++;
        tagContadorMinas.textContent = this.banderas
            .toString()
            .padStart(3, "0");
        return;
    }
    if (this.banderas <= 0) {
        return;
    }
    this.virtualTable[i][j].state = 2;
    elementIconChild.innerHTML = "<i class='fa fa-flag'></i>";
    this.banderas--;

    tagContadorMinas.textContent = this.banderas.toString().padStart(3, "0");
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
    elementCelda.childNodes[0].innerHTML =
        this.virtualTable[x][y].number == 0
            ? ""
            : this.virtualTable[x][y].number == -1
            ? '<i class="fa fa-bomb" aria-hidden="true"></i>'
            : this.virtualTable[x][y].number;

    switch (this.virtualTable[x][y].number) {
        case 1:
            elementCelda.childNodes[0].style.color = "blue";
            break;
        case 2:
            elementCelda.childNodes[0].style.color = "green";
            break;
        case 3:
            elementCelda.childNodes[0].style.color = "red";
            break;
        case 4:
            elementCelda.childNodes[0].style.color = "purple";
            break;
        case 5:
            elementCelda.childNodes[0].style.color = "marron";
            break;
        case 6:
            elementCelda.childNodes[0].style.color = "lightblue";
            break;
        case 7:
            elementCelda.childNodes[0].style.color = "black";
            break;
        case 8:
            elementCelda.childNodes[0].style.color = "gray";
            break;
        default:
            break;
    }

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

buscaminasGame.prototype.openNear = function (x, y) {
    if (this.virtualTable[x][y].state !== 1) {
        return;
    }

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

            if (
                this.virtualTable[x - i][y - j].state === 1 ||
                this.virtualTable[x - i][y - j].state === 2
            ) {
                continue;
            }

            let elementCelda = document.getElementById(
                `celda-${x - i}-${y - j}`
            );
            elementCelda.classList.add("fade");

            if (this.virtualTable[x - i][y - j].number === 0) {
                elementCelda.childNodes[0].textContent = "";
                console.log("open AREA");
                this.openArea(x - i, y - j);
            } else {
                elementCelda.childNodes[0].textContent =
                    this.virtualTable[x - i][y - j].number;
                switch (this.virtualTable[x - i][y - j].number) {
                    case 1:
                        elementCelda.childNodes[0].style.color = "blue";
                        break;
                    case 2:
                        elementCelda.childNodes[0].style.color = "green";
                        break;
                    case 3:
                        elementCelda.childNodes[0].style.color = "red";
                        break;
                    case 4:
                        elementCelda.childNodes[0].style.color = "purple";
                        break;
                    case 5:
                        elementCelda.childNodes[0].style.color = "marron";
                        break;
                    case 6:
                        elementCelda.childNodes[0].style.color = "lightblue";
                        break;
                    case 7:
                        elementCelda.childNodes[0].style.color = "black";
                        break;
                    case 8:
                        elementCelda.childNodes[0].style.color = "gray";
                        break;
                    default:
                        break;
                }
            }

            this.virtualTable[x - i][y - j].state = 1;

            if (this.virtualTable[x - i][y - j].type === 1) {
                this.perdida();
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

    const tagModalResult = document.getElementById("cw_win_game");
    const tagIconResult = tagModalResult.querySelector("#cw_icon_game");
    const tagMessageResult = tagModalResult.querySelector("#cw_message_game");
    tagIconResult.innerHTML = `<i class="fa fa-trophy fa-4x text-sky-600" aria-hidden="true"</i>`;
    tagMessageResult.classList.add("text-sky-600");
    tagMessageResult.classList.add("font-bold");
    tagMessageResult.textContent = "VICTORIA";
    tagModalResult.classList.remove("hidden");
    // tagContentTable.style.backgroundColor = "green";
    // alert("victoria!");
};

buscaminasGame.prototype.perdida = function () {
    let arrMinas = this.ArrMinas;
    arrMinas.forEach((e) => {
        let i = e[0];
        let j = e[1];
        let elementCelda = document.getElementById(`celda-${i}-${j}`);
        elementCelda.classList.add("danger");
        elementCelda.classList.add("fade");
        elementCelda.childNodes[0].innerHTML =
            this.virtualTable[i][j].number == 0
                ? ""
                : '<i class="fa fa-bomb" aria-hidden="true"></i>';
    });
    this.isGameOver = true;

    const tagModalResult = document.getElementById("cw_win_game");
    const tagIconResult = tagModalResult.querySelector("#cw_icon_game");
    const tagMessageResult = tagModalResult.querySelector("#cw_message_game");
    tagIconResult.innerHTML = `<i class="fa fa-fire fa-4x text-rose-600" aria-hidden="true"></i>`;
    tagMessageResult.textContent = "DERROTA";
    tagMessageResult.classList.add("text-rose-600");
    tagMessageResult.classList.add("font-bold");
    tagModalResult.classList.remove("hidden");
};

let juego = null;
let salvarNivel = 0;
let salvarEjex = 0;
let salvarEjey = 0;
let salvarMinas = 0;

function nuevoJuego(a = 0, b = 0, c = 0, d = 0) {
    const tagContentTable = document.getElementById("table-content");
    tagContentTable.innerHTML = "";
    salvarNivel = a;

    if (a === 3) {
        juego = new buscaminasGame(a, b, c, d);
    } else {
        juego = new buscaminasGame(a);
    }
    juego.genHtmlTable();
}

function customNivel() {
    const tagRow = document.getElementById("cw_row");
    const tagColumn = document.getElementById("cw_column");
    const tagMinas = document.getElementById("cw_mina");
    salvarNivel = 3;
    salvarEjex = tagRow.value;
    salvarEjey = tagColumn.value;
    salvarMinas = tagMinas.value;
    nuevoJuego(salvarNivel, salvarEjex, salvarEjey, salvarMinas);
}

function nuevoJuegoNivel() {
    nuevoJuego(salvarNivel, salvarEjex, salvarEjey, salvarMinas);
}

function resetJuego() {
    const tagContentTable = document.getElementById("table-content");
    tagContentTable.innerHTML = "";
    juego.genHtmlTable();
}

nuevoJuego();

function sizeXL() {
    let tagCell = document.getElementsByClassName("block-size");
    for (let i = 0; i < tagCell.length; i++) {
        tagCell[i].classList.remove("cw_cell-md");
        tagCell[i].classList.remove("cw_cell-sm");
        tagCell[i].classList.add("cw_cell-xl");
    }
}

function sizeMD() {
    let tagCell = document.getElementsByClassName("block-size");
    for (let i = 0; i < tagCell.length; i++) {
        tagCell[i].classList.remove("cw_cell-xl");
        tagCell[i].classList.remove("cw_cell-sm");
        tagCell[i].classList.add("cw_cell-md");
    }
}

function sizeSM() {
    let tagCell = document.getElementsByClassName("block-size");
    for (let i = 0; i < tagCell.length; i++) {
        tagCell[i].classList.remove("cw_cell-xl");
        tagCell[i].classList.remove("cw_cell-md");
        tagCell[i].classList.add("cw_cell-sm");
    }
}

function changeState() {
    let label = document.getElementById("tag_checkOpen");
    let input = document.getElementById("cw_checkOpen");

    if (input.checked == false) {
        label.innerHTML =
            '<i class="fa fa-bomb text-2xl" aria-hidden="true"></i>';
    } else {
        label.innerHTML =
            '<i class="fa fa-flag text-2xl" aria-hidden="true"></i>';
    }
}
