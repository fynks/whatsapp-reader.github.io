window.addEventListener('load',() =>{
    document.getElementById('archivo').addEventListener('change',abrirArchivo)
})

var usuarios = [];
let fechaAnt = "";
let allLines = 0;

function abrirArchivo(evento){
    let archivo = evento.target.files[0];
    let reader = new FileReader();
    var fechasMsg = [];

    if(archivo){
        document.getElementById("dia").remove();
        document.getElementById("msg").remove();
        document.getElementById("archivo").remove();


        reader.onload = function(e){
            let contenido = e.target.result;
            var lineas = contenido.split('\n');
            for(var i = 0; lineas.length; i++){
                console.log(i);
                DividirMensaje(lineas[i]);
            }

        };
        reader.readAsText(archivo);
    }else {
        document.getElementById('mensajes').innerText = "No se seleccionó nada";
        console.log('no hay archivo')
    } 
}

function DividirMensaje(linea){
    linea = linea.split(' ');
    let cuerpoMensaje = "";
    let fecha = linea[0];
    let hora = linea[1] + " " + linea[2];
    let usuario = linea[4];

    for(var i = 5; i < linea.length ; i++){
        cuerpoMensaje += linea[i] + " ";
    }

    console.log("--------------------------");
    console.log("Usuario: " + linea[4]);
    console.log("Fecha de envío: " + fecha);
    console.log("Hora de envío: " + hora);
    console.log("Mensaje: " + cuerpoMensaje);
    console.log("--------------------------");

    if(fecha == "")
        return;

    if(linea[4] == "Los" || linea[4] == "Cambió"){
        const warn = document.createElement("p");
        warn.textContent = linea[4] + " " + cuerpoMensaje;
        warn.id = "dia";

        var currentDiv = document.getElementById("area");
        currentDiv.append(warn);

    } else{
        const div = document.createElement("div");
        div.textContent = "";
        div.id = "msg";

        const usrText = document.createElement("p");
        usrText.textContent = usuario;

        const msgText = document.createElement("p");
        msgText.textContent = cuerpoMensaje;
        msgText.id = "cuerpo";

        const fechaTexto = document.createElement("p");
        fechaTexto.textContent = hora;
        fechaTexto.id = "fecha";

        div.appendChild(usrText);
        div.appendChild(msgText);
        div.appendChild(fechaTexto);

        var currentDiv = document.getElementById("area");

        const data = document.createElement("p");
        data.textContent = linea[0];
        data.id = "dia";

        if(fechaAnt != linea[0]){
            currentDiv.append(data);
        }
        currentDiv.append(div);
        fechaAnt = linea[0];
    }
}
