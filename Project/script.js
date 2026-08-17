const BOOKS = [
 {id:"moonlit-map",title:"The Moonlit Map",author:"Elena Vale",genre:"Fantasy",description:"A cartographer discovers a map that redraws itself whenever the moon rises.",price:6.50,durations:[7,14,30],featured:true},
 {id:"last-lantern",title:"The Last Lantern",author:"Mara Quinn",genre:"Mystery",description:"In a rain-soaked harbor town, one impossible light points to an old secret.",price:5.50,durations:[7,14,30],featured:true},
 {id:"paper-sparrows",title:"Paper Sparrows",author:"Noah Bell",genre:"Romance",description:"Two strangers leave handwritten notes inside the same library book.",price:4.75,durations:[7,14,30],featured:true},
 {id:"glass-house",title:"The Glass House",author:"Iris Rowan",genre:"Thriller",description:"A quiet retreat becomes a maze when the house starts revealing its guests' memories.",price:7.75,durations:[7,14,30],featured:true},
 {id:"small-stars",title:"A Sky Full of Small Stars",author:"June Mercer",genre:"Fiction",description:"Three generations return to a lakeside home to decide what should stay and what should go.",price:5.25,durations:[7,14,30],featured:true},
 {id:"signal-after-rain",title:"The Signal After Rain",author:"Theo Arden",genre:"Science Fiction",description:"A radio astronomer receives a message that seems to arrive from tomorrow.",price:8.25,durations:[7,14,30],featured:true},
 {id:"violet-hour",title:"The Violet Hour",author:"Clara Finch",genre:"Fiction",description:"An insomniac bookseller finds unexpected friendship during the city's quietest hour.",price:4.25,durations:[7,14,30]},
 {id:"house-of-tides",title:"House of Tides",author:"S. Wren",genre:"Fantasy",description:"A coastal house appears only during storms, offering one visitor a second chance.",price:7.25,durations:[7,14,30]},
 {id:"quiet-alibi",title:"A Quiet Alibi",author:"Jon Bellamy",genre:"Mystery",description:"A retired detective investigates a crime nobody remembers reporting.",price:6.25,durations:[7,14,30]},
 {id:"orbiting-home",title:"Orbiting Home",author:"Nia Sol",genre:"Science Fiction",description:"A botanist aboard a lonely station grows a garden and a reason to return.",price:8.75,durations:[7,14,30]},
 {id:"between-lines",title:"Between the Lines",author:"Rose Hart",genre:"Romance",description:"A bookbinder and a novelist fall for each other one edit at a time.",price:5.00,durations:[7,14,30]},
 {id:"blackwater-room",title:"The Blackwater Room",author:"Evan Crowe",genre:"Thriller",description:"Every door in an old hotel opens to a different version of the same night.",price:7.50,durations:[7,14,30]}
];

const DURATION_MULTIPLIERS = {7:1,14:1.45,30:1.9};
const money = n => `$${n.toFixed(2)}`;
const getBasket = () => { try { return JSON.parse(localStorage.getItem("rainshineBasket") || "[]"); } catch(e) { return []; } };
const saveBasket = b => { localStorage.setItem("rainshineBasket", JSON.stringify(b)); updateBadge(); };

function updateBadge(){
  const count = getBasket().length;
  document.querySelectorAll(".basket-count").forEach(el => el.textContent = count);
}
function initNav(){
  const toggle=document.querySelector(".menu-toggle"), menu=document.querySelector(".nav-links");
  if(!toggle||!menu)return;
  toggle.addEventListener("click",()=>{const open=menu.classList.toggle("open");toggle.setAttribute("aria-expanded",open);toggle.setAttribute("aria-label",open?"Close navigation menu":"Open navigation menu")});
  menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{menu.classList.remove("open");toggle.setAttribute("aria-expanded","false")}));
}
function coverClass(genre){return ({Mystery:"mystery",Fantasy:"fantasy",Romance:"romance","Science Fiction":"scifi",Thriller:"thriller",Fiction:"fiction"})[genre]||"fiction"}
function bookCard(book){
 return `<article class="book-card">
  <div class="cover ${coverClass(book.genre)}" aria-label="Cover illustration for ${book.title}">
   <span class="cover-author">${book.author}</span><span class="cover-title">${book.title}</span>
  </div>
  <div class="card-body"><div class="card-meta"><span>${book.genre}</span><span>·</span><span>from ${money(book.price)}</span></div>
   <h3>${book.title}</h3><div class="author">by ${book.author}</div>
   <p class="description">${book.description}</p>
   <div class="card-footer"><div class="price"><strong>${money(book.price)}</strong><span>7-day rental</span></div><button class="btn btn-primary add-btn" data-add="${book.id}">Add to Basket</button></div>
  </div>
 </article>`;
}
function addBook(id){
 const basket=getBasket();
 if(!basket.some(x=>x.id===id)) basket.push({id,duration:7});
 saveBasket(basket);
 document.querySelectorAll(`[data-add="${id}"]`).forEach(btn=>{btn.textContent="Added ✓";btn.classList.add("added");setTimeout(()=>{btn.textContent="Add to Basket";btn.classList.remove("added")},1200)});
}
function renderBooks(){
 const grid=document.querySelector("#books-grid"); if(!grid)return;
 const search=(document.querySelector("#book-search")?.value||"").toLowerCase().trim();
 const genre=document.querySelector("#genre-filter")?.value||"all";
 const dur=document.querySelector("#duration-filter")?.value||"all";
 const price=document.querySelector("#price-filter")?.value||"all";
 const sort=document.querySelector("#sort-books")?.value||"recommended";
 let list=BOOKS.filter(b=>{
  const matchesText=!search || b.title.toLowerCase().includes(search)||b.author.toLowerCase().includes(search);
  const matchesGenre=genre==="all"||b.genre===genre;
  const matchesDur=dur==="all"||b.durations.includes(Number(dur));
  const matchesPrice=price==="all"||(price==="under5"&&b.price<5)||(price==="5to8"&&b.price>=5&&b.price<=8)||(price==="over8"&&b.price>8);
  return matchesText&&matchesGenre&&matchesDur&&matchesPrice;
 });
 if(sort==="low")list.sort((a,b)=>a.price-b.price); if(sort==="high")list.sort((a,b)=>b.price-a.price); if(sort==="title")list.sort((a,b)=>a.title.localeCompare(b.title));
 grid.innerHTML=list.map(bookCard).join("");
 document.querySelector("#result-count").textContent=`${list.length} ${list.length===1?"story":"stories"} found`;
 document.querySelector("#empty-results")?.classList.toggle("hidden",list.length>0);
 grid.classList.toggle("hidden",list.length===0);
 grid.querySelectorAll("[data-add]").forEach(btn=>btn.addEventListener("click",()=>addBook(btn.dataset.add)));
}
function initCatalog(){
 if(!document.querySelector("#books-grid"))return;
 ["book-search","genre-filter","duration-filter","price-filter","sort-books"].forEach(id=>document.querySelector("#"+id)?.addEventListener("input",renderBooks));
 const clear=()=>{document.querySelector("#book-search").value="";document.querySelector("#genre-filter").value="all";document.querySelector("#duration-filter").value="all";document.querySelector("#price-filter").value="all";document.querySelector("#sort-books").value="recommended";renderBooks()};
 document.querySelector("#clear-filters")?.addEventListener("click",clear);document.querySelector("#empty-clear")?.addEventListener("click",clear);renderBooks();
}
function renderFeatured(){
 const grid=document.querySelector("#featured-grid");if(!grid)return;
 grid.innerHTML=BOOKS.filter(b=>b.featured).map(bookCard).join("");
 grid.querySelectorAll("[data-add]").forEach(btn=>btn.addEventListener("click",()=>addBook(btn.dataset.add)));
}
function basketDetails(){
 return getBasket().map(item=>({item,book:BOOKS.find(b=>b.id===item.id)})).filter(x=>x.book);
}
function rentalPrice(book,duration){return book.price*(DURATION_MULTIPLIERS[duration]||1)}
function renderBasket(){
 const itemsEl=document.querySelector("#basket-items");if(!itemsEl)return;
 const details=basketDetails(), empty=details.length===0;
 document.querySelector("#basket-empty").classList.toggle("hidden",!empty);document.querySelector("#basket-content").classList.toggle("hidden",empty);
 if(empty)return;
 itemsEl.innerHTML=details.map(({item,book})=>`<article class="basket-item">
  <div class="mini-cover ${coverClass(book.genre)}">${book.title}</div>
  <div class="basket-info"><h3>${book.title}</h3><p>${book.author} · ${book.genre}</p><label>Rental duration<select class="duration-select" data-duration="${book.id}">${[7,14,30].map(d=>`<option value="${d}" ${item.duration==d?"selected":""}>${d} days</option>`).join("")}</select></label></div>
  <div class="item-price"><strong>${money(rentalPrice(book,item.duration))}</strong><br><button class="remove-btn" data-remove="${book.id}">Remove</button></div>
 </article>`).join("");
 itemsEl.querySelectorAll("[data-duration]").forEach(s=>s.addEventListener("change",()=>{const b=getBasket();const x=b.find(i=>i.id===s.dataset.duration);if(x)x.duration=Number(s.value);saveBasket(b);renderBasket()}));
 itemsEl.querySelectorAll("[data-remove]").forEach(btn=>btn.addEventListener("click",()=>{saveBasket(getBasket().filter(i=>i.id!==btn.dataset.remove));renderBasket()}));
 const subtotal=details.reduce((sum,{item,book})=>sum+rentalPrice(book,item.duration),0), fee=subtotal?Math.max(1.5,subtotal*.08):0,total=subtotal+fee;
 document.querySelector("#subtotal").textContent=money(subtotal);document.querySelector("#service-fee").textContent=money(fee);document.querySelector("#grand-total").textContent=money(total);
}
function openRental(){
 const details=basketDetails();if(!details.length)return;
 const total=details.reduce((s,{item,book})=>s+rentalPrice(book,item.duration),0);const fee=Math.max(1.5,total*.08);
 document.querySelector("#modal-books").textContent=`${details.length} ${details.length===1?"book":"books"}`;
 document.querySelector("#modal-total").textContent=money(total+fee);
 document.querySelector("#rental-modal").classList.remove("hidden");document.body.style.overflow="hidden";
}
function initBasket(){
 if(!document.querySelector("#basket-items"))return;
 renderBasket();document.querySelector("#proceed-btn")?.addEventListener("click",openRental);
 document.querySelectorAll("[data-close-modal]").forEach(x=>x.addEventListener("click",()=>{document.querySelector("#rental-modal").classList.add("hidden");document.body.style.overflow=""}));
 document.querySelector("#rental-form")?.addEventListener("submit",e=>{e.preventDefault();const name=new FormData(e.target).get("name");document.querySelector("#success-name").textContent=name;document.querySelector("#rental-form-view").classList.add("hidden");document.querySelector("#rental-success").classList.remove("hidden");localStorage.removeItem("rainshineBasket");updateBadge();document.querySelector("#basket-items").innerHTML="";document.querySelector("#basket-content").classList.add("hidden");document.querySelector("#basket-empty").classList.remove("hidden")});
}
function initNewsletter(){
 document.querySelector("#newsletter-form")?.addEventListener("submit",e=>{e.preventDefault();const msg=e.currentTarget.querySelector(".form-message");msg.textContent="Thank you — we'll save a rainy-day recommendation for you.";e.currentTarget.querySelector("input").value=""});
}
document.addEventListener("DOMContentLoaded",()=>{initNav();updateBadge();renderFeatured();initCatalog();initBasket();initNewsletter()});