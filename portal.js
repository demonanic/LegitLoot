document.querySelectorAll("[data-filter]").forEach((button)=>button.addEventListener("click",()=>{
  const group=button.parentElement;
  group.querySelectorAll("[data-filter]").forEach((item)=>item.classList.toggle("active",item===button));
  const value=button.dataset.filter;
  document.querySelectorAll(".portal-card[data-category]").forEach((card)=>{
    const categories=(card.dataset.category||"").trim().split(" ").filter(Boolean);
    card.hidden=value!=="all"&&!categories.includes(value);
  });
}));
