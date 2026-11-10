document.querySelectorAll("[data-filter]").forEach((button)=>button.addEventListener("click",()=>{
  const group=button.parentElement;
  group.querySelectorAll("[data-filter]").forEach((item)=>{
    const active=item===button;
    item.classList.toggle("active",active);
    item.setAttribute("aria-pressed",String(active));
  });
  const value=button.dataset.filter;
  document.querySelectorAll(".portal-card[data-category]").forEach((card)=>{
    const categories=(card.dataset.category||"").trim().split(" ").filter(Boolean);
    card.hidden=value!=="all"&&!categories.includes(value);
  });
}));

document.querySelectorAll("[data-filter]").forEach((button)=>{
  button.setAttribute("aria-pressed",String(button.classList.contains("active")));
});
