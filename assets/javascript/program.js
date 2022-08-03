window.addEventListener('load',() =>{
    document.getElementById('archivo').addEventListener('change',abrirArchivo)
})

let fechaAnt;
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
                    "te añadió."]
let warnings = ["Messages and calls are","left","You're no longer","changed to", "You removed","Your security code with",
                "added","changed this group's","created group","Your'e now an admin","You created group","was added",
                "changed the group description","joined using this group's","changed the subject","changed the group",
                "You're now an admin","started a call"];


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
            var textFinal = "";
            internationalNumberFormat = new Intl.NumberFormat('es-US')
            document.getElementById("reload").style.display = "flex";
            msgChar = internationalNumberFormat.format(parseInt(lineas.length));
            if(!eng)
                textFinal = "Se han cargado " + msgChar + " mensajes";
            else
                textFinal = "Has been loaded " + msgChar + " messages";

            document.getElementById("parraf").textContent = textFinal;  

            for(var i = 0; lineas.length; i++){
                DividirMensaje(lineas[i]);
            }
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
    linea = linea.split(' ');
    let usuario = linea[4];
    let cuerpoMensaje = "";
    let fecha = linea[0];
    let hora = linea[1] + " " + linea[2];

    try{
        if(checks(linea,fecha))
            return;
            console.log(linea.join(' ') + " - " + fecha + " / ");
            console.log(fecha.split('/').length + " " + fecha.length);
            
        if(fecha.split('/').length < 3){
            for(var i = 0 ; i < linea.length ; i++){
                cuerpoMensaje += linea[i] + " ";
            }
            const currentDiv = document.getElementsByClassName("cuerpocont")[document.getElementsByClassName("cuerpocont").length - 1];
            var cuerpoMsg = document.createElement("p");
            cuerpoMsg.textContent = cuerpoMensaje;
            currentDiv.insertAdjacentElement("afterend",cuerpoMsg);
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
    msgText.className = "cuerpocont";

    // Crea el párrafo de la fecha
    const fechaTexto = document.createElement("p");
    fechaTexto.textContent = hora;
    fechaTexto.id = "fecha";

    // Obtiene el elemento que será padre del mensaje
    var currentDiv = document.getElementById("area");

    // Crea el párrafo del día si se necesita
    if(fechaAnt != linea[0]){
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
        currentDiv.append(data);
    }

    div.appendChild(usrText);
    div.appendChild(msgText);
    div.appendChild(fechaTexto);
    currentDiv.append(div);

    fechaAnt = linea[0];
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