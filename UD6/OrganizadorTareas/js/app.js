"use strict";

document.addEventListener("DOMContentLoaded", () => {
    
    // --- REFERENCIAS AL DOM ---
    const btnAdd = document.getElementById('addBtn');
    const input = document.getElementById('taskInput');
    const columns = document.querySelectorAll('.column'); // Seleccionamos todas las columnas (todo, doing, done)

    // --- PARTE 1: AÑADIR TAREAS NUEVAS ---
    
    btnAdd.addEventListener('click', () => {
        // Solo creamos si no está vacío. .trim() quita espacios en blanco extra.
        if (input.value.trim() !== "") {
            crearTarea(input.value);
            input.value = ""; // Limpiamos el input
        }
    });

    // UX: Permitir añadir pulsando la tecla Enter
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') btnAdd.click();
    });

    // --- PARTE 2: CONFIGURAR LAS ZONAS DE DESTINO (COLUMNAS) ---
    // Recorremos cada columna para convertirla en una zona válida de "aterrizaje"
    
    columns.forEach(column => {
        
        // A. DRAGOVER: "Alguien está volando sobre mí"
        // Por defecto, los navegadores NO permiten soltar elementos en otros elementos.
        // Debemos cancelar ese comportamiento con preventDefault() para habilitar el DROP.
        column.addEventListener('dragover', (e) => {
            e.preventDefault(); // ¡CRÍTICO! Sin esto, el evento 'drop' nunca se dispara.

            //Mostrar que no se puede obtener el idTarea en el dragover
            // const idTarea = e.dataTransfer.getData('text/plain');
            // console.log(`Arrastrando tarea con ID: ${idTarea} sobre la columna ${column.id}`);
        });

        column.addEventListener('dragenter', (e) => {
            e.dataTransfer.dropEffect = 'move';
            column.classList.add('hovered'); // Feedback visual (ej: borde punteado)
        });

        // B. DRAGLEAVE: "Se fue de mi territorio"
        // Si el usuario se arrepiente y saca el elemento de la columna, quitamos el estilo.
        column.addEventListener('dragleave', () => {
            column.classList.remove('hovered');
        });

        // C. DROP: "Aterrizaje confirmado"
        column.addEventListener('drop', (e) => {
            e.preventDefault(); // Evitamos comportamientos raros del navegador
            column.classList.remove('hovered'); // Limpiamos el estilo visual

            // 1. Recuperamos el "ticket" (ID) que guardamos al salir (dragstart)
            const idTarea = e.dataTransfer.getData('text/plain');
            
            // 2. Buscamos el elemento real en el DOM usando ese ID
            const tarea = document.getElementById(idTarea);

            // 3. Movemos el elemento.
            // NOTA: .appendChild() mueve el nodo si ya existe. No lo duplica.
            if (tarea) {
                column.append(tarea);
            }

            console.log(e.dataTransfer.files) ;
        });
    });
});


/**
 * Función Auxiliar: Crea el HTML de la tarea y le asigna los eventos
 * @param {string} texto - El contenido de la tarea
 */
function crearTarea(texto) {
    const tarea = document.createElement('div');
    
    // Configuración visual y atributos
    tarea.classList.add('task');
    tarea.innerText = texto;
    
    // --- PASO CLAVE: Habilitar arrastre ---
    // Sin draggable="true", el elemento es estático como una piedra.
    tarea.setAttribute('draggable', 'true');
    
   // 1. Buscamos todas las tareas que YA existen en el tablero
    const tareasExistentes = document.querySelectorAll('.task');
    
    // 2. Calculamos el siguiente número (Total actual + 1)
    const siguienteNumero = tareasExistentes.length + 1;
    
    // 3. Asignamos el ID (ej: "task-1", "task-2")
    tarea.id = `task-${siguienteNumero}`;

    // --- PARTE 3: EVENTOS DEL ELEMENTO ARRASTRABLE ---
    
    // A. DRAGSTART: "Empieza el viaje"
    tarea.addEventListener('dragstart', (e) => {
        // Feedback visual: Hacemos la tarea semitransparente
        tarea.classList.add('dragging');
        
        // DATA TRANSFER: El corazón del Drag & Drop
        // Guardamos el ID de esta tarea en el "portapapeles" del evento.
        // Formato: 'text/plain', Valor: el ID de la tarea.
        e.dataTransfer.setData('text/plain', tarea.id); 
    });

    // B. DRAGEND: "Terminó el viaje" (Sea exitoso o no)
    tarea.addEventListener('dragend', () => {
        // Siempre debemos limpiar las clases visuales al terminar
        tarea.classList.remove('dragging');
    });

    //Prueba de que drag ejecuta en cada pixel y por eso no añadimos la logica aqui
    // tarea.addEventListener('drag', (e) => {
    //     // Feedback visual: Hacemos la tarea semitransparente
    //     console.log('Arrastrando...');
    // });


    // Insertamos la nueva tarea en la columna inicial
    document.getElementById('todo').appendChild(tarea);
}