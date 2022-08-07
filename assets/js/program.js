

window.addEventListener('load',() =>{
    document.getElementById('archivo').addEventListener('change',abrirArchivo)
})
var lineas = [];
let fechaAnt;
let msgAnt;
let usuarios =  [];
let userColor = [];
var eng = true;
var nmode = true;
var msgChar = 0;
const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const months = ["January", "February", "March", "April", "May", "June", "July","August","September","Octuber","November","December"];
let advertencias = ["Los mensajes y","Cambió tu código","creó el grupo", "añadió a", "cambió el ícono", 
                    "salió del grupo", "Eliminaste a", "Añadiste a", "Se añadió a", "cambió la descripción",
                    "inició una llamada", "Cambiaste el", "admin. del grupo", "cambió los ajustes",
                    "se unió usando el enlace", "cambió el asunto", "cambió a","eliminó a","Creaste el grupo",
                    "te añadió.","Iniciaste una llamada","El código de seguridad"];
let warnings = ["Messages and calls are","left","You're no longer","changed to", "You removed","Your security code with",
                "added","changed this group's","created group","Your'e now an admin","You created group","was added",
                "changed the group description","joined using this group's","changed the subject","changed the group",
                "You're now an admin","started a call"];

var activeUser = document.getElementById("optionpov");

activeUser.addEventListener("change",function(){
    var user = usuarios[activeUser.selectedIndex].substring(0,usuarios[activeUser.selectedIndex].length - 1).split(' ').join('');
    elegirUsr(user);

});

function abrirArchivo(evento){
    let archivo = evento.target.files[0];
    let reader = new FileReader();

    if(archivo){
        if(archivo.name.substring(archivo.name.length - 3,archivo.name.length) != "txt"){
            document.getElementById("subtitulo").textContent = "Seleccione un archivo con la extensión .txt";
            return;
        }
        document.getElementById("subtitulo").textContent = archivo.name;
        document.getElementById("dia").remove();
        document.getElementById("containall").remove();
        document.getElementById("containmsg").remove();
        document.getElementById("labArch").remove();
        document.getElementById("configs").style.display = "block";


        reader.onload = function(e){
            let contenido = e.target.result;
            lineas = contenido.split('\n');
            var textFinal = "";
            internationalNumberFormat = new Intl.NumberFormat('es-US')
            document.getElementById("reload").style.display = "flex";
            msgChar = internationalNumberFormat.format(parseInt(lineas.length));
            if(!eng)
                textFinal = "Se han cargado " + msgChar + " mensajes";
            else
                textFinal = "Has been loaded " + msgChar + " messages";

            lineas.forEach(function(linea){
                DividirMensaje(linea);
            })
            document.getElementById("parraf").textContent = textFinal;
            elegirUsr(usuarios[0].substring(0,usuarios[0].length - 1).split(' ').join(''));
  
        };
        reader.readAsText(archivo);
    } else {
        if(!eng)
            document.getElementById("subtitulo").textContent = "No se pudo cargar el archivo";
        else
            document.getElementById("subtitulo").textContent = "Fail to charge the file";
    };
}

function DividirMensaje(linea){
    let brecha =  0;
    let originLin = linea;
    linea = linea.split(' ');
    let usuario = linea[4];
    let cuerpoMensaje = "";
    let fecha = linea[0];
    let hora = linea[1] + " " + linea[2];
    var posiciones = 0;
    var validRegex = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
    try{
        originLin = originLin.replace(">","&gt;");
        originLin = originLin.replace("<","&lt;");

        if(checks(linea,fecha))
            return;

        if(eng) fecha = fecha.substring(0,fecha.length - 1);

        if(!validRegex.test(fecha)){
            separateLine(cuerpoMensaje,originLin)
            return;
        }

        if(usuario[usuario.length - 1] == ":"){
            brecha = 5;
            for(var i = 0 ; i < brecha ; i++){
                posiciones += linea[i].length;
            }
        } else{
            for(var i = 4; i < linea.length ; i++){
                if(linea[i].indexOf(':') != -1){
                    brecha = i + 1;
                    for(var i = 0 ; i < brecha ; i++){
                        if(i >= 5)
                            usuario += " " + linea[i];
                        posiciones += linea[i].length;
                    }
                    break;
                }
            }
        }

        cuerpoMensaje = originLin.substring((posiciones+brecha),originLin.length).replace(/ /g,"&nbsp");

        if(!usuarios.includes(usuario)){
            usuarios.push(usuario);
            userColor.push("hsl(" + Math.round((Math.random() * 359)) + ", 64%, 64%)");
            listUsers();
            createUserOption(usuario.substring(0,usuario.length - 1));
        }

        AdicionMensajes(usuario,cuerpoMensaje,hora,linea);
    }catch(error){};
}

function AdicionMensajes(usuario,cuerpoMensaje,hora,linea){   
    // Crea el div padre
    const div = document.createElement("div");
    div.textContent = "";
    div.id = "msg";

    // Crea el parrafo para el usuario
    const usrText = document.createElement("p");
    usrText.textContent = usuario;
    if(msgAnt == usuario) usrText.style.display = "none";

    // Le da su color asignado
    for(var i = 0 ; i < usuarios.length; i++){
        if(usuarios[i] == usuario){
            usrText.style.color = userColor[i];
        }
    }

    // Crea el párrafo del mensaje
    const msgText = document.createElement("p");

    msgText.innerHTML = cuerpoMensaje;
    msgText.id = "cuerpo";
    msgText.className = "cuerpocont";

    // Crea el párrafo de la fecha
    const fechaTexto = document.createElement("p");
    fechaTexto.textContent = hora;
    fechaTexto.id = "fecha";

    // Obtiene el elemento que será padre del mensaje
    var currentDiv = document.getElementById("area");

    // Crea el párrafo del día si se necesita
    if(fechaAnt != linea[0]){
        const alldiv = document.createElement("div");
        alldiv.id = "containall";
        alldiv.className = "date";
        const data = document.createElement("p");

        if(!eng){
            var year = parseInt(linea[0].split('/')[2]);
            if(year < 2000)
                year += 2000;
            data.textContent = linea[0].split('/')[0] + " de " + meses[linea[0].split('/')[1] - 1] + " de " + year;
        }
        else{
            var year = parseInt(linea[0].split('/')[2].substring(0,linea[0].split('/')[2].length - 1));
            if(year < 2000) year += 2000;
            data.textContent = months[linea[0].split('/')[0] - 1] +" "+linea[0].split('/')[1] +", " + year;
        }
        data.id = "dia";

        alldiv.append(data);
        currentDiv.append(alldiv);
    }

    var elements = document.createElement("div");
    elements.id = "elements";

    var contain = document.createElement("div");
    contain.id = "containmsg";

    contain.className = "oth " + usuario.substring(0,usuario.length-1).split(' ').join('');
    contain.style.display = "flex";
    elements.append(usrText,msgText);
    div.append(elements,fechaTexto);
    contain.append(div);
    currentDiv.append(contain);  
    fechaAnt = linea[0];
    msgAnt = usuario;
}

function advertMsg(linea){
    let advert = ""
            
    for(var i = 4 ; i < linea.length ; i++){
        advert += " " + linea[i];
    }

    
    const alldiv = document.createElement("div");
    alldiv.id = "containall";

    const warn = document.createElement("p");
    warn.textContent = advert;
    warn.id = "warn";
    var currentDiv = document.getElementById("area");
    alldiv.append(warn);
    currentDiv.append(alldiv);
}

function listUsers(){
    const userParraf = document.getElementById("userParraf");
    userParraf.style.display = "block"

    const mainDiv = document.getElementById("contUsers");
    mainDiv.style.display = "flex"

    const userDiv = document.createElement("div");
    userDiv.id = "user";
    userDiv.style.backgroundColor = userColor[userColor.length - 1];

    const userIcon = document.createElement("div");
    userIcon.id = "imagen";

    const username = document.createElement("span");
    username.textContent = usuarios[usuarios.length - 1].substring(0,usuarios[usuarios.length - 1].length-1);

    userDiv.appendChild(userIcon);
    userDiv.appendChild(username);
    mainDiv.appendChild(userDiv);
}

function checks(linea,fecha){
    var flag = false;

    if(!eng){
        advertencias.forEach(function(adv){
            if(linea.join(" ").includes(adv) && !linea.join(" ").substring(20,linea.join(" ").length).includes(":")){
                advertMsg(linea);
                flag = true;
                return true;
            }
        });
    }
    else{
        warnings.forEach(function(warn){
            if(linea.join(" ").includes(warn) && !linea.join(" ").substring(20,linea.join(" ").length).includes(":")){
                advertMsg(linea);
                flag = true;
                return true;
            }
        });
    }
    return flag;
}

function separateLine(cuerpoMensaje,originLin){
    cuerpoMensaje = originLin.replace(/ /g,"&nbsp");
    const currentDiv = document.getElementsByClassName("cuerpocont")[document.getElementsByClassName("cuerpocont").length - 1];
    currentDiv.innerHTML += "<br>" + cuerpoMensaje;
    return;
}

function whatsapptwo(){
    if(msgChar != 0)
        return;

    document.getElementById("logoapp").src = "assets/images/whatsapp.png";
    document.getElementById("wareader").textContent = "WhatsApp 2";

    document.getElementById("titulo").textContent = "WhatsApp 2 Revealed";
    document.getElementById("subtitulo").textContent = "Con el carro de WhatsApp";
    for(element of document.getElementsByClassName("parraf")) element.textContent = "";
    document.getElementById("entrada").remove();
    document.getElementById("area").remove();
    document.getElementById("parraf").remove();
    document.getElementById("desc").textContent =  "omg, carro do whatsapp";

    document.getElementById("eng").disabled = true;
    document.getElementById("esp").disabled = true;


    let carrodiv = document.createElement("div");
    carrodiv.id = "carrowasa";

    let carro = document.createElement("img");
    carro.src = "assets/images/carro.png";
    carrodiv.appendChild(carro);
    document.getElementById("subtitulo").insertAdjacentElement("afterend",carrodiv);
}

function createUserOption(username){
    const obj = document.getElementById("optionpov");
    var option = document.createElement("option");
    option.value = username;
    option.textContent = username;
    obj.append(option);
}

function elegirUsr(username){
    console.log(username);
    document.getElementById("chatstyle").href = "";
    document.getElementById("area").style.opacity = "0";
    document.getElementById("chatstyle").href = "assets/css/chats.css";
    let allMsg = document.getElementsByClassName("oth");
    Array.from(allMsg).forEach(msg => {
        if(msg.className.includes("env"))
            msg.className = msg.className.substring(0,msg.className.length - 3);
        if(msg.className.includes(username))
            msg.className += " env";
    })

    setTimeout(function(){
        document.getElementById("area").style.opacity = "1";
    },1000);
}   