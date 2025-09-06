function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const createElement = (arr) => {
  const htmlElement = arr.map((el) => `<span class="btn">${el}</span>`);
  return htmlElement.join(" ");
};

const manageSpiner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const loadLesson = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayData(json.data));
};

const activeRemove = () => {
  const avtiveBtn = document.querySelectorAll(".lessn-btn");
  avtiveBtn.forEach((btn) => btn.classList.remove("active"));
};
const loadlevelWord = (id) => {
  manageSpiner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      activeRemove();
      const btnActive = document.getElementById(`lesson-btn-${id}`);
      btnActive.classList.add("active");
      displayLevelWord(data.data);
    });
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const detail = await res.json();
  displywordDetail(detail.data);
};

// "word": "Eager",
// "meaning": "আগ্রহী",
// "pronunciation": "ইগার",
// "level": 1,
// "sentence": "The kids were eager to open their gifts.",
// "points": 1,
// "partsOfSpeech": "adjective",
// "synonyms": [
// "enthusiastic",
// "excited",
// "keen"

const displywordDetail = (wdetails) => {
  console.log(wdetails);
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `
    <div class="space-y-5 p-3 border-1 rounded-xl border-sky-300">
        <h2 class="text-2xl font-bold"> ${
          wdetails.word ? wdetails.word : "শব্দটি পাওয়া যায় নি!"
        } (  <i class="fa-solid fa-microphone-lines"></i>  :${
    wdetails.pronunciation ? wdetails.pronunciation : "পাওয়া যায় নি"
  })</h2>
        <div class="">
            <h2 class="text-lg font-bold">Meaning</h2>
            <p>${
              wdetails.meaning ? wdetails.meaning : "অর্থটি পাওয়া যায় নি"
            }</p>
        </div>
        <div class="">
            <h2 class="text-lg font-bold">Example</h2>
            <p>${
              wdetails.sentence ? wdetails.sentence : "বাক্য টি পাওয়া যায় নি"
            }</p>
        </div>
        <div class="">
            <h2 class="text-lg font-bold">সমার্থক শব্দগুলো</h2>
            <div class="">
            ${createElement(wdetails.synonyms)}
            </div>
        </div>

    </div>
    `;

  document.getElementById("word_modal").showModal();
};

const displayLevelWord = (words) => {
  const levelWordContainer = document.getElementById("word-container");
  levelWordContainer.innerHTML = " ";

  if (words.length == 0) {
    levelWordContainer.innerHTML = `
        <div class="text-center bg-center col-span-full" >
          <img class="mx-auto" src="assets/alert-error.png" alt="">
          <p class="text-gray-600 text-sm">
            এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
          </p>
          <h2 class="text-3xl py-3">নেক্সট Lesson এ যান</h2>
        </div>
    `;
    manageSpiner(false);
    return;
  }
  words.forEach((word) => {
    console.log(word);
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5">
        <h2 class="font-bold text-2xl">${
          word.word ? word.word : "শব্দটি পাওয়া যায় নি!"
        }</h2>
        <p class="font-semibold">Meaning /Pronounciation</p>
        <div class="text-2xl font-medium bangla-font">"${
          word.meaning ? word.meaning : "অর্থটি পাওয়া যায় নি"
        } / ${word.pronunciation ? word.pronunciation : "পাওয়া যায় নি"}"</div>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDetail(${
            word.id
          })" class="btn"><i class="fa-solid fa-circle-info"></i></button>
          <button onclick="pronounceWord('${
            word.word
          }')" class="btn"><i class="fa-solid fa-volume-high"></i></button>
        </div>
      </div>
    `;
    levelWordContainer.append(card);
  });
  manageSpiner(false);
};

const displayData = (lesson) => {
  //1.get the container & empty
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = " ";
  //2.get into every lesson
  for (let lessons of lesson) {
    //3. create element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
        <button id="lesson-btn-${lessons.level_no}" onclick="loadlevelWord(${lessons.level_no})" class="btn btn-outline btn-primary lessn-btn">
            <span><i class="fa-solid fa-book-open"></i></span> Lesson - ${lessons.level_no}
        </button>
    `;
    levelContainer.append(btnDiv);
  }
};
loadLesson();

document.getElementById("btn-search").addEventListener("click", () => {
  activeRemove();
  const input = document.getElementById("btn-input");
  const searchValue = input.value.trim().toLowerCase();
  console.log(searchValue);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((words) =>
        words.word.toLowerCase().includes(searchValue)
      );
      displayLevelWord(filterWords);
    });
});
