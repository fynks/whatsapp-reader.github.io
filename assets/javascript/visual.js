
function switchNi(){
    console.log("night");
    let buttonNi = document.getElementById("night");
    if(buttonNi.style.backgroundColor == "rgb(24, 44, 57)")
        return;

    let buttonDay = document.getElementById("day");

    buttonDay.style.backgroundColor = "#030c12";
    buttonNi.style.backgroundColor = "#182c39";

}

function switchDay(){
    console.log("day");
    let buttonDay = document.getElementById("day");
    if(buttonDay.style.backgroundColor == "rgb(24, 44, 57)")
        return;

    let buttonNi = document.getElementById("night");

    buttonNi.style.backgroundColor = "#030c12";
    buttonDay.style.backgroundColor = "#182c39";

}