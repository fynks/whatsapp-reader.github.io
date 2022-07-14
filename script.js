window.addEventListener('load',() =>{
    document.getElementById('archivo').addEventListener('change',abrirArchivo)
})

let fechaAnt;
let usuarios =  [""];
let userColor = [""];

function abrirArchivo(evento){
    let archivo = evento.target.files[0];
    let reader = new FileReader();

    if(archivo){
        document.getElementById("titulo").textContent = archivo.name;
        document.getElementById("dia").remove();
        document.getElementById("msg").remove();
        document.getElementById("entrada").remove();

        reader.onload = function(e){
            let contenido = e.target.result;
            var lineas = contenido.split('\n');
            for(var i = 0; lineas.length; i++){
                DividirMensaje(lineas[i]);
                console.log(i);
            }
        };
        reader.readAsText(archivo);
    }else {
        document.getElementById('mensajes').innerText = "No se seleccionó nada";
    } 
}

function DividirMensaje(linea){
    let brecha =  0;
    linea = linea.split(' ');
    let usuario = linea[4];
    let cuerpoMensaje = "";
    let fecha = linea[0];
    let hora = linea[1] + " " + linea[2];

    try{
        if(fecha == "")
            return;

        if(linea[4] == "Los" || linea[4] == "Cambió" || linea[4] == "Creaste" || linea[4] == "Cambiaste"){
            let advert = ""
            
            for(var i = 4 ; i < linea.length ; i++){
                advert += " " + linea[i];
            }

            const warn = document.createElement("p");
            warn.textContent = advert;
            warn.id = "dia";
            var currentDiv = document.getElementById("area");
            currentDiv.append(warn);
            return;
        }

        if(usuario[usuario.length] == ":"){
            brecha = 0;
                        
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
            console.log(userColor);
        }

        AdicionMensajes(usuario,cuerpoMensaje,hora,linea);
        
    }catch(error){
        console.error(error);
    }
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
        if(usuarios[i] == usuario)
            usrText.style.color = userColor[i];
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
        data.textContent = linea[0];
        data.id = "dia";
        currentDiv.append(data);
    }

    div.appendChild(usrText);
    div.appendChild(msgText);
    div.appendChild(fechaTexto);
    currentDiv.append(div);

    fechaAnt = linea[0];
}
