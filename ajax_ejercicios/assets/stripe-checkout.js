import STRIPE_KEYS from "./stripe-keys.js";

const d = document, 
        $tacos = d.getElementById("tacos"),
        $template = d.getElementById("taco-template").content,
        $fragment = d.createDocumentFragment(),
        fetchOptions ={
            headers:{
                Authorization: `Bearer ${STRIPE_KEYS.secret}`,
            },  
        };

//Acceder a los productos

let products, prices;

//Formato del currency 
const moneyFormat = num => `$${num.slice(0,-2)}.${num.slice(-2)}`;

//El siguiente método espera  a que le contesten las promesas y hasta que conteste la primera sigue con la segunda y envia todas 
//las respuestas al then
Promise.all([
    fetch("https://api.stripe.com/v1/products", fetchOptions),
    fetch("https://api.stripe.com/v1/prices", fetchOptions)
])
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then(json => {
        console.log(json);
        products = json[0].data;
        prices = json[1].data;  
        console.log(products, prices);
        //Para cada precio de la lista se colocará un producto 
        prices.forEach(el => {
           let productData = products.filter(product => product.id === el.product);
           console.log(productData);
           //Al template que tiene la figure taco se le agrega un data-attribute con precio y su id.
           $template.querySelector(".taco").setAttribute("data-price",el.id);
           
           $template.querySelector("img").src = productData[0].images[0];
           $template.querySelector("img").alt = productData[0].name[0];
           $template.querySelector("figcaption").innerHTML = `
                ${productData[0].name}
                <br>
                ${moneyFormat(el.unit_amount_decimal)} ${el.currency}
                
            `;
           
           //Cuando se usa la tecnica Template se debe usar un clone
           let $clone = d.importNode($template, true);
           
           //Se agrega al fragmet el clone por cada precio que se termine
           $fragment.appendChild($clone);
        });
        
        $tacos.appendChild($fragment);
    })
    .catch(err =>{
        console.log(err);
        let message = err.statusText || "Ocurrio un error al conectarse con la API de Stripé";
        $tacos.innerHTML = `<p>Error ${err.status}: ${message}</p>`
    });
    
    d.addEventListener("click", e=> {
       if(e.target.matches(".taco *")){
           let price = e.target.parentElement.getAttribute("data-price");
           //console.log(price);
           
           Stripe(STRIPE_KEYS.public).redirectToCheckout({
               lineItems: [{price, quantity:1}],
               mode: "subscription",
               successUrl: "http://localhost/Cursos/ajax_ejercicios/assets/stripe-success.html",
               cancelUrl: "http://localhost/Cursos/ajax_ejercicios/assets/stripe-cancel.html"
           }).then(res=>{
               if(res.error){
                   $tacos.insertAdjacentHTML("afterend", res.error.message);
               }
           })
       } 
    });

//fetch("https://api.stripe.com/v1/products", ).then((res)=>{
//            console.log(res);
//            return res.json()
//}).then(json =>{
//   console.log(json);
//});