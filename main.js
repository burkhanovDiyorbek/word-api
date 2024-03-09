let main = document.querySelector(".main");
let inp = document.querySelector("input");
let res;
document.querySelector("form").addEventListener("submit", (e) => {
  if (inp.value) {
    say();
  }
  e.preventDefault();
});

async function say() {
  let url = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${inp.value}`
  );
  res = await url.json();
  if (url.status >= 400) {
    main.innerHTML = `
    <div class='err'>
      <p>😕</p>
      <h2>No Definitions Found</h2>
      <p>Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at later time or head to the web instead.</p>
    </div>    
    `;
  } else {
    add(res);
  }
  console.log(res);
}

function add(arr) {
  arr.forEach((item) => {
    main.innerHTML = `
    <section class="result-section">
          <div class="result-word">
          <h2>${item.word}</h2>
            <span>${item.phonetic}</span>
          </div>
          <div>          
          <img src="./img/play.svg" alt="play" class="result-audio" onclick="music()"/>
          <audio src='https://api.dictionaryapi.dev/media/pronunciations/en/${item.word}-us.mp3'  class="aud"/>
          </div>
        </section>
       <div class='meanings'></div>            
        <hr />
        <div class="author">
        <u>Source</u>
          <a href="https://en.wiktionary.org/wiki/${item.word}" target='_blank'
            >https://en.wiktionary.org/wiki/${item.word}</a
            >
          <img src="./img/link.svg" alt="link" />
          </div>
    `;
    addMeanings(item.meanings);
  });
}

function addMeanings(arr) {
  let meanings = document.querySelector(".meanings");
  arr.forEach((itemM) => {
    let div = document.createElement("div");
    meanings.append(div);

    div.innerHTML += `
     <h3>${itemM.partOfSpeech}<line></line></h3>
     <p>Meaning</p>
     <div class='ul'></div>
     
  `;
    let p = document.createElement("p");
    div.append(p);
    p.textContent = "Synonyms";
    syn(itemM, p);
    let ul = document.querySelectorAll(".meanings >div>.ul");

    ul.forEach((item) => {
      let ulTag = document.createElement("ul");
      item.append(ulTag);
      addLi(itemM.definitions, ulTag);
    });
  });
}

let toggle = document.querySelectorAll(".tog");
toggle.forEach((item) => {
  item.onclick = () => {
    let darkValue = document.body.classList.toggle("dark");
    localStorage.setItem("dark", darkValue);
  };
});

if (localStorage.getItem("dark") == "true") {
  document.body.classList.add("dark");
} else {
  document.body.classList.remove("dark");
}

document.getElementById("select-font").addEventListener("change", () => {
  let selectedFont = document.getElementById("select-font").value;
  document.body.style.fontFamily = selectedFont;
});

function music() {
  document.querySelector(".aud").play();
}

function addLi(arr, ulTag) {
  arr.forEach((itemMLi) => {
    ulTag.innerHTML += `<li>${itemMLi.definition}</li>`;
  });
}

function syn(itemM, p) {
  itemM.synonyms.length > 0
    ? itemM.synonyms.forEach((itemS) => {
        p.innerHTML += `
      <span>${itemS}</span>`;
      })
    : p.remove();
}
