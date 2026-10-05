const products = [
  {id:1,name:"Oliveiras Clássico",category:"Burgers",price:24.90,emoji:"🍔",tag:"MAIS PEDIDO",description:"Pão brioche, burger artesanal 160g, queijo cheddar, alface, tomate e molho especial."},
  {id:2,name:"Duplo Bacon",category:"Burgers",price:32.90,emoji:"🍔",tag:"IRRESISTÍVEL",description:"Dois burgers artesanais, cheddar cremoso, bacon crocante e molho da casa no pão brioche."},
  {id:3,name:"Chicken Crispy",category:"Burgers",price:27.90,emoji:"🍔",tag:"CROCANTE",description:"Frango empanado crocante, queijo, alface, tomate e maionese temperada."},
  {id:4,name:"Smash Especial",category:"Burgers",price:29.90,emoji:"🍔",tag:"NOVO",description:"Dois smash burgers fininhos, cheddar, cebola caramelizada e molho especial."},
  {id:5,name:"Combo Clássico",category:"Combos",price:34.90,emoji:"🍔",tag:"COMBO",description:"Oliveiras Clássico + batata frita crocante + refrigerante lata."},
  {id:6,name:"Combo Bacon",category:"Combos",price:42.90,emoji:"🍔",tag:"COMBO",description:"Duplo Bacon + batata frita crocante + refrigerante lata."},
  {id:7,name:"Batata Crocante",category:"Porções",price:14.90,emoji:"🍟",tag:"QUERIDINHA",description:"Porção individual de batatas crocantes e sequinhas com sal especial."},
  {id:8,name:"Batata Cheddar & Bacon",category:"Porções",price:22.90,emoji:"🍟",tag:"TOP",description:"Batata crocante coberta com cheddar cremoso e bacon crocante."},
  {id:9,name:"Coca-Cola",category:"Bebidas",price:6.00,emoji:"🥤",tag:"GELADA",description:"Lata 350ml bem gelada."},
  {id:10,name:"Guaraná",category:"Bebidas",price:6.00,emoji:"🥤",tag:"GELADO",description:"Lata 350ml bem gelada."},
  {id:11,name:"Suco Natural",category:"Bebidas",price:8.90,emoji:"🧃",tag:"NATURAL",description:"Suco natural preparado na hora. Consulte sabores disponíveis."},
  {id:12,name:"Água",category:"Bebidas",price:4.00,emoji:"💧",tag:"",description:"Água mineral 500ml."}
];

let cart = JSON.parse(localStorage.getItem("oliveirasCart") || "[]");
let currentProduct = null, modalQty = 1;
const money = v => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

function renderProducts(category="Todos"){
  const grid=document.getElementById("menuGrid");
  const list=category==="Todos"?products:products.filter(p=>p.category===category);
  grid.innerHTML=list.map(p=>`
    <article class="menu-card">
      <div class="menu-image">${p.tag?`<span class="tag">${p.tag}</span>`:""}<span>${p.emoji}</span></div>
      <div class="menu-info">
        <h3>${p.name}</h3><p>${p.description}</p>
        <div class="card-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" onclick="openProduct(${p.id})">+</button></div>
      </div>
    </article>`).join("");
}
function filterCategory(category){
  document.querySelectorAll(".category").forEach(b=>b.classList.toggle("active",b.dataset.category===category));
  renderProducts(category); document.getElementById("cardapio").scrollIntoView({behavior:"smooth"});
}
document.querySelectorAll(".category").forEach(b=>b.addEventListener("click",()=>filterCategory(b.dataset.category)));

function openProduct(id){
  currentProduct=products.find(p=>p.id===id); modalQty=1;
  document.getElementById("modalEmoji").textContent=currentProduct.emoji;
  document.getElementById("modalCategory").textContent=currentProduct.category.toUpperCase();
  document.getElementById("modalName").textContent=currentProduct.name;
  document.getElementById("modalDescription").textContent=currentProduct.description;
  document.getElementById("modalPrice").textContent=money(currentProduct.price);
  document.getElementById("qty").textContent=1;
  document.querySelectorAll(".addons input").forEach(i=>i.checked=false);
  document.getElementById("productBackdrop").classList.add("show");
}
document.getElementById("closeProduct").onclick=()=>document.getElementById("productBackdrop").classList.remove("show");
document.getElementById("minus").onclick=()=>{if(modalQty>1){modalQty--;document.getElementById("qty").textContent=modalQty}};
document.getElementById("plus").onclick=()=>{modalQty++;document.getElementById("qty").textContent=modalQty};

document.getElementById("addProduct").onclick=()=>{
  const addons=[...document.querySelectorAll(".addons input:checked")].map(i=>({name:i.dataset.addon,price:+i.dataset.price}));
  const addonKey=addons.map(a=>a.name).join("|");
  const existing=cart.find(i=>i.id===currentProduct.id && i.addonKey===addonKey);
  if(existing) existing.qty+=modalQty;
  else cart.push({...currentProduct,qty:modalQty,addons,addonKey});
  saveCart(); closeProduct(); openCart(); toast("Item adicionado ao carrinho!");
};

function saveCart(){localStorage.setItem("oliveirasCart",JSON.stringify(cart));renderCart();}
function itemUnit(i){return i.price+i.addons.reduce((s,a)=>s+a.price,0)}
function renderCart(){
  const count=cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById("cartCount").textContent=count;
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML='<div class="empty-cart"><div>🛒</div><h4>Seu carrinho está vazio</h4><p>Escolha seus favoritos e monte seu pedido.</p></div>';}
  else box.innerHTML=cart.map((i,idx)=>`
    <div class="cart-item">
      <div class="cart-item-icon">${i.emoji}</div>
      <div><h4>${i.name}</h4><p>${i.addons.length?i.addons.map(a=>a.name).join(", "):"Sem adicionais"}</p>
      <div class="item-actions"><button onclick="changeQty(${idx},-1)">−</button><strong>${i.qty}</strong><button onclick="changeQty(${idx},1)">+</button><button class="remove" onclick="removeItem(${idx})">Remover</button></div></div>
      <strong>${money(itemUnit(i)*i.qty)}</strong>
    </div>`).join("");
  const subtotal=cart.reduce((s,i)=>s+itemUnit(i)*i.qty,0);
  const delivery=subtotal? (subtotal>=80?0:7):0;
  document.getElementById("subtotal").textContent=money(subtotal);
  document.getElementById("delivery").textContent=delivery?money(delivery):"Grátis";
  document.getElementById("total").textContent=money(subtotal+delivery);
  document.getElementById("checkoutTotal").textContent=money(subtotal+delivery);
}
function changeQty(idx,delta){cart[idx].qty+=delta;if(cart[idx].qty<=0)cart.splice(idx,1);saveCart()}
function removeItem(idx){cart.splice(idx,1);saveCart();toast("Item removido.");}

function openCart(){document.getElementById("cartPanel").classList.add("open");document.getElementById("cartBackdrop").classList.add("show");renderCart()}
function closeCart(){document.getElementById("cartPanel").classList.remove("open");document.getElementById("cartBackdrop").classList.remove("show")}
document.getElementById("openCart").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;document.getElementById("cartBackdrop").onclick=closeCart;

document.getElementById("checkoutBtn").onclick=()=>{
  if(!cart.length){toast("Adicione algum item antes de finalizar.");return}
  closeCart();document.getElementById("checkoutBackdrop").classList.add("show");
};
document.getElementById("closeCheckout").onclick=()=>document.getElementById("checkoutBackdrop").classList.remove("show");
document.getElementById("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data=new FormData(e.target), total=document.getElementById("total").textContent;
  const order=Math.floor(1000+Math.random()*9000);
  const msg=`Pedido #${order} - Oliveiras Burger%0ACliente: ${data.get("name")}%0AEndereço: ${data.get("address")}%0APagamento: ${data.get("payment")}%0ATotal: ${total}`;
  // Troque o número abaixo pelo WhatsApp da sua loja.
  const whatsapp="5585999999999";
  cart=[];saveCart();document.getElementById("checkoutBackdrop").classList.remove("show");
  e.target.reset();toast(`Pedido #${order} criado!`);
  setTimeout(()=>{window.open(`https://wa.me/${whatsapp}?text=${msg}`,"_blank")},700);
});

function toast(text){const t=document.getElementById("toast");t.textContent=text;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)}
renderProducts();renderCart();
