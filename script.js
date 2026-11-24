const quoteText=document.getElementById("quoteText");
const quoteAuthor=document.getElementById("quoteAuthor");
const historyList=document.getElementById("historyList");
const generateButton=document.getElementById("generateButton");
const statusText=document.getElementById("status");
const toast=document.getElementById("toast");
function notify(message){toast.textContent=message;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2400);}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));}
function renderHistory(items){
 document.getElementById("historyCount").textContent=`${items.length} SAVED`;
 if(!items.length){historyList.innerHTML='<div class="empty"><span>✧</span><p>Your saved quotes will appear here.</p><small>Generate your first quote to begin.</small></div>';return;}
 historyList.innerHTML=items.map(item=>`<article class="history-item"><p>“${escapeHTML(item.quote)}”</p><div class="history-meta"><strong>— ${escapeHTML(item.author)}</strong><span>${escapeHTML(item.created_at)}</span></div></article>`).join("");
}
async function loadHistory(){
 try{const response=await fetch("/api/quotes/history");if(!response.ok)throw new Error();renderHistory(await response.json());}
 catch{historyList.innerHTML='<div class="empty"><p>Unable to load quote history.</p><small>Please try refreshing.</small></div>';}
}
async function generateQuote(){
 generateButton.disabled=true;generateButton.innerHTML='<span>✳</span> Finding a quote...';statusText.textContent="Connecting to the quote service...";
 try{
  const response=await fetch("/api/quotes/random",{method:"POST"});const data=await response.json();
  if(!response.ok)throw new Error(data.error||"Could not generate a quote.");
  quoteText.textContent=data.quote;quoteAuthor.textContent=`— ${data.author.toUpperCase()}`;
  statusText.textContent="Saved to your quote history.";await loadHistory();notify("A new quote has been saved.");
 }catch(error){statusText.textContent=error.message;notify(error.message);}
 finally{generateButton.disabled=false;generateButton.innerHTML='<span>✳</span> Generate a new quote <b>↗</b>';}
}
generateButton.addEventListener("click",generateQuote);
document.getElementById("refreshButton").addEventListener("click",loadHistory);
loadHistory();