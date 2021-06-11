document.addEventListener("DOMContentLoaded", e => {
    //Se ejecuta por cada elemento que tenga el data-atribute 
    const includeHTML = (el, url) => {
         const xhr = new XMLHttpRequest();
         let i = 1;
         //Se ejecuta 5 veces 
         xhr.addEventListener("readystatechange", e => {
            console.log(i, e);
            i++; 
             if(xhr.readyState !== 4) return;
             //Respuestas validas
             if(xhr.status >= 200 && xhr.status < 300){
                 el.outerHTML = xhr.responseText; //Coloca la respuesta de la petición
             }else{
                 let message = xhr.statusText || "Error al cargar el archivo, verifica que estes haciendo la petición por http o https";
                 el.outerHTML = `<div><p>Error ${xhr.status}: ${message}</p></div>`;      
             }
         });
        console.log("open"); 
        xhr.open("GET", url); //Solicitamos información
        xhr.setRequestHeader("Content-type", "text/html; charset=utf-8"); 
        xhr.send();
     };
     
     
     document.querySelectorAll("[data-include]").forEach(el => includeHTML(el, el.getAttribute("data-include")));  
     
});
