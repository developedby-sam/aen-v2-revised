import {
  youtube_parser,
  numberIncreamentAnimation,
  setLocalStorage,
  getLocalStorage,
} from "./utility.js";

/* QUERY SELECTORS */
const nav = document.querySelector(".nav");
const revealSections = document.querySelectorAll(".reveal");
// Image slider elements
const prev = document.getElementsByClassName("prev")[0];
const next = document.getElementsByClassName("next")[0];
const slides = document.getElementsByClassName("mySlides");
const dots = document.getElementsByClassName("dot");
// Apod elements
const apodContainer = document.querySelector(".apod__container");
const apodText = document.querySelector(".apod__text");
// Aen at glance numbers
const events = document.querySelector("#events");
const participants = document.querySelector("#participants");
const members = document.querySelector("#members");
const partners = document.querySelector("#partners");
const colleges = document.querySelector("#schools");

/* INITIALIZING LIBRARIES */
const controller = new ScrollMagic.Controller();

/* GSAP TIMELINE */
const revealTimeline = gsap.timeline({
  defaults: { duration: 1.5, ease: "expo.inOut" },
});

/* IMAGE SLIDER */
let slideIndex = 1;
showSlides(slideIndex);
// Next/previous controls
function plusSlides(n) {
  showSlides((slideIndex += n));
}
// Thumbnail image controls
function currentSlide(n) {
  showSlides((slideIndex = n));
}
function showSlides(n) {
  let i;
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}
// Auto slide-show
setInterval(function () {
  plusSlides(1);
}, 5000);
// Previous btn
prev.addEventListener(
  "click",
  () => {
    plusSlides(-1);
  },
  false
);
// Next btn
next.addEventListener(
  "click",
  () => {
    plusSlides(1);
  },
  false
);
// Dots sliding
[...dots].forEach((dot, index) => {
  dot.addEventListener("click", () => {
    if (dot.classList.contains(`dot-${index + 1}`)) {
      currentSlide(index + 1);
    }
  });
});

/* ASTRONOMY PICTURE OF THE DAY*/
const auth = "T7Z6BYNlOOApYYAp4PD2ERaw1h6pCtuzt8lmI7dO";

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accepts: "application/json",
      Authorization: auth,
    },
  });

  const data = await dataFetch.json();
  setLocalStorage("data", {
    url: data.url,
    explanation: data.explanation,
    media_type: data.media_type,
  });
  return data;
}

function generatePicture(data) {
  if (data.media_type === "image") {
    apodContainer.innerHTML = `
     <img class='apod__container--media' src=${data.url} alt=${data.title}></img>
   `;
    apodText.innerHTML = `
     <h3>Astronomy Picture of the Day</h3>
     <p> ${data.explanation} </p>
   `;
  } else if (data.media_type === "video") {
    const videoId = youtube_parser(data.url);
    apodContainer.innerHTML = `
     <iframe class='apod__container--media' src=${
       data.url + `&autoplay=1&playlist=${videoId}&loop=1`
     } width="100%" height="500" allowfullscreen >
       <p>
         <a href=${data.url}>
           Fallback link for browsers that don't support iframes
         </a>
       </p>
     </iframe>
     `;
    apodText.innerHTML = `
       <h3> Astronomy Picture of the Day </h3>
       <p>${data.explanation}</p>
     `;
  }
  apodText.style.height = "auto";
}

async function loadAPOD() {
  let data = getLocalStorage("data");
  data = await fetchApi(`https://api.nasa.gov/planetary/apod?api_key=${auth}`);
  generatePicture(data);
}
loadAPOD();

/* SECTION REVEAL ANIMATION */
revealSections.forEach((section) => {
  revealTimeline.fromTo(
    section,
    { opacity: "0", transform: "translateY(8rem)" },
    { opacity: "1", transform: "translateY(0rem)" }
  );
  new ScrollMagic.Scene({
    triggerElement: section,
    triggerHook: 0.9,
    reverse: false,
  })
    .setTween(revealTimeline)
    .addTo(controller);
});

/* NAVBAR ANIMATION ON SCROLL */
new ScrollMagic.Scene({
  triggerElement: ".next",
  triggerHook: 0.2,
})
  .on("start", () => {
    nav.classList.toggle("shadow-on");
  })
  .addTo(controller);

/* INCREASING NUBER ANIMATION FOR AEN AT GLANCE */
function startNumberAnimation() {
  numberIncreamentAnimation(events, 0, 30, 2, 3000);
  numberIncreamentAnimation(participants, 0, 8000, 20, 3000);
  numberIncreamentAnimation(members, 0, 150, 2, 3000);
  numberIncreamentAnimation(partners, 0, 15, 1, 2000);
  numberIncreamentAnimation(schools, 0, 10, 1, 2000);
}
new ScrollMagic.Scene({
  triggerElement: ".aen-at-glance__numbers",
  triggerHook: 0.8,
  reverse: false,
})
  .on("start", startNumberAnimation)
  .addTo(controller);
