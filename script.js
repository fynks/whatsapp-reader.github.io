window.addEventListener('load',() =>{
    document.getElementById('archivo').addEventListener('change',abrirArchivo)
})

let fechaAnt;
let usuarios =  [];
let userColor = [];
const meses = ["enero", "febrero", "Marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function abrirArchivo(evento){
    let archivo = evento.target.files[0];
    let reader = new FileReader();
    var lineas = "";

    if(archivo){
        if(archivo.name.substring(archivo.name.length - 3,archivo.name.length) != "txt"){
            document.getElementById("subtitulo").textContent = "Seleccione un archivo con la extensión .txt";
            return;
        }
        document.getElementById("subtitulo").textContent = archivo.name;
        document.getElementById("dia").remove();
        document.getElementById("msg").remove();
        document.getElementById("entrada").remove();
        reader.onload = function(e){
            let contenido = e.target.result;
            lineas = contenido.split('\n');

            internationalNumberFormat = new Intl.NumberFormat('es-US')
            document.getElementById("reload").style.display = "flex";
            document.getElementById("parraf").textContent = "Se han cargado " + internationalNumberFormat.format(parseInt(lineas.length)) + " mensajes";  
            for(var i = 0; lineas.length; i++){
                DividirMensaje(lineas[i]);
            }
        };
        reader.readAsText(archivo);
    } else {document.getElementById("subtitulo").textContent = "No se pudo cargar el archivo" };
}

function DividirMensaje(linea){
    let brecha =  0;
    linea = linea.split(' ');
    let usuario = linea[4];
    let cuerpoMensaje = "";
    let fecha = linea[0];
    let hora = linea[1] + " " + linea[2];
    var firstSerie = linea[4] + " " + linea[5];
    var lastSerie = linea[linea.length - 3] + " " + linea[linea.length - 2] + " " +linea[linea.length - 1];
    
    try{
        if(fecha == "")
            return;

        if(linea[4] == "Los" || linea[4] == "Cambió" || linea[4] == "Creaste" || linea[4] == "Cambiaste" || linea[4] == "Este" || linea[4] == "Esta"){
            advertMsg(linea);
            return;
        }

        if(firstSerie == "Eliminaste a"){
            advertMsg(linea);
            return;
        }
        
        if(firstSerie == "Añadiste a"){
            advertMsg(linea);
            return;
        }

        if(firstSerie == "Se añadió"){
            advertMsg(linea);
            return;
        }

        if(lastSerie == "salió del grupo"){
            advertMsg(linea);
            return;
        }

        if(lastSerie == "descripción del grupo"){
            advertMsg(linea);
            return;
        }

        if(lastSerie == "inició una llamada"){
            advertMsg(linea);
            return;
        }

        
        if(lastSerie == "admin. del grupo"){
            advertMsg(linea);
            return;
        }

        if(linea.join(" ").includes("creó el grupo") && !linea.join(" ").substring(20,linea.join(" ").length).includes(":")){
            advertMsg(linea);
            return;
        }

        if(linea.join(" ").includes("te añadió.") && !linea.join(" ").substring(20,linea.join(" ").length).includes(":")){
            advertMsg(linea);
            return;
        }

        if(linea.join(" ").includes("añadió a") && !linea.join(" ").substring(20,linea.join(" ").length).includes(":")){
            advertMsg(linea);
            return;
        }

        if(linea.join(" ").includes("cambió el ícono") && !linea.join(" ").substring(20,linea.join(" ").length).includes(":")){
            advertMsg(linea);
            return;
        }

        if(linea.join(" ").includes("cambió el asunto de") && !linea.join(" ").substring(20,linea.join(" ").length).includes(":")){
            advertMsg(linea);
            return;
        }

        if(linea.join(" ").includes("se unió usando el enlace") && !linea.join(" ").substring(20,linea.join(" ").length).includes(":")){
            advertMsg(linea);
            return;
        }

        if(linea.join(" ").includes("cambió a") && !linea.join(" ").substring(20,linea.join(" ").length).includes(":")){
            advertMsg(linea);
            return;
        }

        if(linea.join(" ").includes("cambió los ajustes de este grupo") && !linea.join(" ").substring(20,linea.join(" ").length).includes(":")){
            advertMsg(linea);
            return;
        }

        if(linea.join(" ").includes("eliminó a") && !linea.join(" ").substring(20,linea.join(" ").length).includes(":")){
            advertMsg(linea);
            return;
        }

        if(fecha.split('/').length < 3){
            for(var i = 0 ; i < linea.length ; i++){
                cuerpoMensaje += linea[i] + " ";
            }
            var currentDiv = document.getElementById("area");
            const msgCont = document.createElement("div");
            msgCont.id = "msgcont";
            const cuerpoMsg = document.createElement("p");
            cuerpoMsg.textContent = cuerpoMensaje   ;
            msgCont.append(cuerpoMsg);
            currentDiv.append(msgCont);
            return;
        }

        if(usuario[usuario.length - 1] == ":"){
            brecha = 5;
        } else{
            for(var i = 4; i < linea.length ; i++){
                let temp = linea[i];
                if(temp[temp.length - 1] == ":"){
                    brecha = i + 1;
                    for(var i = 5 ; i < brecha ; i++){
                        usuario += " " + linea[i];
                    }
                    break;
                }
            }
        }

        for(var i = brecha; i < linea.length ; i++){
            cuerpoMensaje += linea[i] + " ";
        }

        if(!usuarios.includes(usuario)){
            usuarios.push(usuario);
            console.log(linea);
            userColor.push("hsl(" + Math.round((Math.random() * 359)) + ", 64%, 64%)");
            listUsers();
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

    // Le da su color asignado
    for(var i = 0 ; i < usuarios.length; i++){
        if(usuarios[i] == usuario){
            usrText.style.color = userColor[i];
        }
    }

    // Crea el párrafo del mensaje
    const msgText = document.createElement("p");
    msgText.textContent = cuerpoMensaje;
    msgText.id = "cuerpo";

    // Crea el párrafo de la fecha
    const fechaTexto = document.createElement("p");
    fechaTexto.textContent = hora;
    fechaTexto.id = "fecha";

    // Obtiene el elemento que será padre del mensaje
    var currentDiv = document.getElementById("area");

    // Crea el párrafo del día si se necesita
    if(fechaAnt != linea[0]){
        const data = document.createElement("p");
        data.textContent = linea[0].split('/')[0] + " de " + meses[linea[0].split('/')[1] - 1] + " del " + linea[0].split('/')[2];
        data.id = "dia";
        currentDiv.append(data);
    }

    div.appendChild(usrText);
    div.appendChild(msgText);
    div.appendChild(fechaTexto);
    currentDiv.append(div);

    fechaAnt = linea[0];
}


function whatsapptwo(){
    document.getElementById("logoapp").src = "assets/images/whatsapp.png";
    document.getElementById("wareader").textContent = "WhatsApp 2";

    document.getElementById("titulo").textContent = "WhatsApp 2 Revealed";
    document.getElementById("subtitulo").textContent = "Con el carro de WhatsApp";
    for(element of document.getElementsByClassName("parraf")) element.textContent = "";
    document.getElementById("entrada").remove();
    document.getElementById("area").remove();

    let carrodiv = document.createElement("div");
    carrodiv.id = "carrowasa";
    
    let carro = document.createElement("img");
    carro.src = "assets/images/carro.png";
    carrodiv.appendChild(carro);
    document.getElementById("subtitulo").insertAdjacentElement("afterend",carrodiv);
}

function advertMsg(linea){
    let advert = ""
            
    for(var i = 4 ; i < linea.length ; i++){
        advert += " " + linea[i];
    }

    const warn = document.createElement("p");
    warn.textContent = advert;
    warn.id = "warn";
    var currentDiv = document.getElementById("area");
    currentDiv.append(warn);
    return;
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

