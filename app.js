/* Minimal JS to populate gallery, handle timer and modal */
const START_DATE = '2022-01-31T00:00:00'; // altere aqui: data de início do casal (ISO)
const couple = {
  name: 'Ronia & Wesley',
  synopsis: 'Duas vidas, uma história — memórias, risos e filmes compartilhados. Um romance que se constrói em pequenas cenas do dia a dia.',
  cover: 'https://static.vecteezy.com/ti/fotos-gratis/t2/37371298-ai-gerado-uma-casal-do-amor-faz-uma-em-forma-de-coracao-gesto-enquanto-a-por-do-sol-ai-fundo-foto.jpg'
};

/* Sample assets (unsplash for images, sample video url) */
const photos = [
  {src:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPcRxmlK1ph5eQHTOGHYWL2w9Ha0vKtxS2SQ&s', label:'Viagem à praia'},
  {src:'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=800&auto=format&fit=crop', label:'Café da manhã'},
  {src:'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=800&auto=format&fit=crop', label:'Noite de filme'},
  {src:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop', label:'Pôr do sol'},
  {src:'https://images.unsplash.com/photo-1542156822-6924a7b5b8c6?q=80&w=800&auto=format&fit=crop', label:'Passeio'}
];

const videos = [
  {src:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', poster:'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=800&auto=format&fit=crop', label:'Clipe 1'},
  {src:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm', poster:'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=800&auto=format&fit=crop', label:'Clipe 2'}
];

document.addEventListener('DOMContentLoaded', () => {
  // populate hero
  document.getElementById('coupleName').textContent = couple.name;
  document.getElementById('synopsis').textContent = couple.synopsis;
  document.getElementById('heroCover').src = couple.cover;

  // timer
  const timeEl = document.getElementById('timeTogether');
  const start = new Date(START_DATE);
  function updateTimer(){
    const now = new Date();
    const diff = Math.max(0, now - start);
    const days = Math.floor(diff / (1000*60*60*24));
    const yrs = Math.floor(days/365);
    const months = Math.floor((days%365)/30);
    const remDays = days - yrs*365 - months*30;
    let text = '';
    if(yrs>0) text += `${yrs} ano${yrs>1?'s':''} `;
    if(months>0) text += `${months} mês${months>1?'es':''} `;
    text += `${remDays} dia${remDays!==1?'s':''}`;
    timeEl.textContent = text;
  }
  updateTimer();
  setInterval(updateTimer, 60*1000);

  // populate photos
  const photosRow = document.getElementById('photosRow');
  photos.forEach(p=>{
    const card = document.createElement('button');
    card.className='card';
    card.innerHTML = `<img loading="lazy" src="${p.src}" alt="${p.label}"/><div class="label">${p.label}</div>`;
    card.addEventListener('click', ()=>openModal('image', p));
    photosRow.appendChild(card);
  });

  // populate videos
  const videosRow = document.getElementById('videosRow');
  videos.forEach(v=>{
    const card = document.createElement('button');
    card.className='card';
    card.innerHTML = `<img loading="lazy" src="${v.poster}" alt="${v.label}"/><div class="label">▶ ${v.label}</div>`;
    card.addEventListener('click', ()=>openModal('video', v));
    videosRow.appendChild(card);
  });

  // trailer/play button: play first video
  const playBtn = document.getElementById('playTrailer');
  playBtn.addEventListener('click', ()=> {
    if(videos[0]) openModal('video', videos[0]);
  });

  // modal
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });

  function openModal(type, item){
    modalBody.innerHTML = '';
    if(type==='image'){
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.label || 'Foto';
      modalBody.appendChild(img);
    } else if(type==='video'){
      const video = document.createElement('video');
      video.src = item.src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      if(item.poster) video.poster = item.poster;
      modalBody.appendChild(video);
      // avoid playing multiple audios; pause others if any
      video.addEventListener('play', ()=> {
        document.querySelectorAll('video').forEach(vv=>{
          if(vv!==video) try{ vv.pause(); }catch(e){}
        });
      });
    }
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    // trap focus: move focus to close button
    modalClose.focus();
  }

  function closeModal(){
    // pause and remove media
    modalBody.querySelectorAll('video').forEach(v=>{try{v.pause();}catch(e){}});
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    // restore focus to play button
    document.getElementById('playTrailer').focus();
  }

  // small edit dialog (inline prompt) to change name and synopsis
  document.getElementById('editBtn').addEventListener('click', ()=>{
    const newName = prompt('Nome do casal:', couple.name);
    if(newName!==null) {
      couple.name = newName.trim() || couple.name;
      document.getElementById('coupleName').textContent = couple.name;
    }
    const newSynopsis = prompt('Sinopse:', couple.synopsis);
    if(newSynopsis!==null){
      couple.synopsis = newSynopsis.trim() || couple.synopsis;
      document.getElementById('synopsis').textContent = couple.synopsis;
    }
  });

  // keyboard: escape to close modal
  window.addEventListener('keydown', (e)=>{
    if(e.key==='Escape') {
      if(modal.classList.contains('show')) closeModal();
    }
  });

});