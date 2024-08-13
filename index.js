let myDataString;
let myDataHandle;
const resultCircleDiameter = "10px";
const resultDiagramWidth = 600;
let resultDiagramHeight = resultDiagramWidth * screen.availHeight/screen.availWidth; //change to = resultDiagramWidth for a square diagram

document.getElementById("parseButton").onclick = function(){
    myDataString = document.getElementById("myData").value;
    myDataHandle = JSON.parse(myDataString);
    console.log(myDataHandle);
    showDemoInfo();
    gridInfo();
    showTestedEye();
    showTestSequence();
    showUserScores();
    showBlindspotMsg();
    showBlindSpotInfo();
    cali3BSRecord();
    for (let i = 0; i< 5; i ++){
        showResultDiagram(i);
    }
    document.getElementById("resultsContainer").style.display = 'block';
}

function showBlindspotMsg() {
    document.getElementById("blindSpotMsg").textContent = myDataHandle[3][4];
}

function cali3BSRecord(){
    const bsArrayData = myDataHandle[3][3];
    const tableBody = document.querySelector("#bsArrayTable tbody");
    bsArrayData.forEach((row, rowIndex) => {
        const rowElement = document.createElement("tr");
        const rowIndexCell = document.createElement("td");
        rowIndexCell.textContent = rowIndex + 1;
        rowElement.appendChild(rowIndexCell);
        const valuesCell = document.createElement("td");
        valuesCell.textContent = row.join(", ");
        rowElement.appendChild(valuesCell);
        tableBody.appendChild(rowElement);
    });
}

function showDemoInfo(){
    document.getElementById("demoInfo").textContent = `Gender: ${myDataHandle[0][5][0]}, Age: ${myDataHandle[0][5][1]}, Ethnicity: ${myDataHandle[0][5][2]}`;
}

function showTestedEye(){
    if (myDataHandle[0][2] == -1) {
        document.getElementById("eye").textContent = 'Left eye was tested.';
    }else if(myDataHandle[0][2] == 1) {
        document.getElementById("eye").textContent = 'Right eye was tested.';
    }else{
        document.getElementById("eye").textContent = 'Unexpected results. Data possibly corrupted.';
    }
}

function showTestSequence(){
    document.getElementById("testSequence").textContent = `Test sequence: ${myDataHandle[1][3].slice(0, 4)}`;
}

function gridInfo(){
    document.getElementById("gridInfo").textContent = `Grid set to ${myDataHandle[0][3]}x${myDataHandle[0][4]}`;
}

function showUserScores(){
    for (let i=1; i<5; i++){
        let currentID = 'userScore' + i.toString();
        document.getElementById(currentID).textContent = `User score: ${myDataHandle[i][2]}`
    }
}

function showBlindSpotInfo(){
    
    for (let i=1; i<5; i++){
        let currentID = 'blindSpotX' + i.toString();
        document.getElementById(currentID).textContent = `Blind spot at ${myDataHandle[i][0] * myDataHandle[0][2]}px`
    }
}

function showResultDiagram(x){
    myParsedMatrix = myDataHandle[x][1];
    numRows = myDataHandle[0][3];
    numColumns = myDataHandle[0][4];
    let currentDiagram = 'resultDiagram' + x.toString();
    let resultDiagram = document.getElementById(currentDiagram);
    resultDiagram.style.width = resultDiagramWidth + 'px';
    resultDiagram.style.height = resultDiagramHeight + 'px';

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
          if (myParsedMatrix[i][j][0] === -1) {
            continue;
          }
          const section = document.createElement('div');
          section.classList.add('section');
          section.style.width = resultCircleDiameter; //sectionWidth - 1 + 'px';
          section.style.height = resultCircleDiameter; //sectionHeight - 1 + 'px';
          section.style.borderRadius = "50%";
          section.style.top = myParsedMatrix[i][j][1];
          section.style.left = myParsedMatrix[i][j][2];
          section.style.transform = "translate(-50%, -50%)";
          
          //color missed section black
          if (myParsedMatrix[i][j][0] === 0) {
              section.style.backgroundColor = 'black';
          }
          //overwrite center section with yellow color
          if ((numRows % 2 == 1 && numColumns % 2 == 1) && (i == Math.floor(numRows/2) && j == Math.floor(numColumns/2))){
              section.style.backgroundColor = 'yellow';
          }
          //bundle
          resultDiagram.appendChild(section);
        }
    }

    if (x != 0) {
        for (let i = 0; i < 9; i++) {
            const section = document.createElement('div');
            section.classList.add('section');
            section.style.width = resultCircleDiameter; //sectionWidth - 1 + 'px';
            section.style.height = resultCircleDiameter; //sectionHeight - 1 + 'px';
            section.style.borderRadius = "50%";
            section.style.top = myParsedMatrix[numRows][i][1];
            section.style.left = myParsedMatrix[numRows][i][2];
            section.style.transform = "translate(-50%, -50%)";
            
            //color missed section black
            if (myParsedMatrix[numRows][i][0] === 0) {
                section.style.backgroundColor = 'black';
            }
            //bundle
            resultDiagram.appendChild(section);
        }
    }

    if (numRows % 2 == 0 || numColumns % 2 == 0) {
        const midPoint = document.createElement('div');
        midPoint.classList.add('section');
        midPoint.style.width = resultCircleDiameter; //sectionWidth - 1 + 'px';
        midPoint.style.height = resultCircleDiameter; //sectionHeight - 1 + 'px';
        midPoint.style.borderRadius = "50%";
        midPoint.style.left = "50%";
        midPoint.style.top = "50%";
        midPoint.style.transform = "translate(-50%, -50%)";
        midPoint.style.backgroundColor = 'yellow';
        resultDiagram.appendChild(midPoint);
    }
}