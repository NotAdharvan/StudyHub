const fallbackSyllabus = {
  6: {Maths:['Knowing Our Numbers','Whole Numbers','Playing with Numbers'],English:['Who Did Patrick’s Homework?','A Pact with the Sun','A House, A Home'],Science:['The Wonderful World of Science','Sorting Materials','Components of Food'], 'Social Science':['The Earth in the Solar System','From Hunting-Gathering to Growing Food','Understanding Diversity']},
  7: {Maths:['Integers','Fractions and Decimals','The Triangle and Its Properties'],English:['Three Questions','A Gift of Chappals','Gopal and the Hilsa Fish'],Science:['Nutrition in Plants','Heat','Acids, Bases and Salts'], 'Social Science':['Environment','On Equality','Tracing Changes Through a Thousand Years']},
  8: {Maths:['Rational Numbers','Linear Equations in One Variable','Understanding Quadrilaterals'],English:['The Best Christmas Present','The Tsunami','Glimpses of the Past'],Science:['Crop Production and Management','Microorganisms: Friend and Foe','Coal and Petroleum'], 'Social Science':['Resources','The Indian Constitution','From Trade to Territory']},
  9: {Maths:['Number Systems','Polynomials','Coordinate Geometry'],English:['The Fun They Had','The Sound of Music','The Little Girl'],Science:['Matter in Our Surroundings','The Fundamental Unit of Life','Motion'], 'Social Science':['India: Size and Location','Socialism in Europe','What is Democracy? Why Democracy?']},
  10: {Maths:['Real Numbers','Polynomials','Pair of Linear Equations'],English:['A Letter to God','Nelson Mandela: Long Walk to Freedom','Two Stories About Flying'],Science:['Chemical Reactions and Equations','Life Processes','Light: Reflection and Refraction'], 'Social Science':['Resources and Development','Power Sharing','Development']}
};
const syllabus = window.studyHubSyllabus || fallbackSyllabus;
const icons = {Maths:'∑',English:'Aa',Science:'✧','Social Science':'◈'};
const baseQuestions = [
  {subject:'Maths',classNumber:'9',source:'NCERT Exemplar',q:'A two-digit number is four times the sum of its digits. If 18 is added, its digits are reversed. Find the number.',a:'The number is 24. Let the digits be 10x + y and use both conditions to form two linear equations.'},
  {subject:'English',classNumber:'9',source:'Textbook + inference',q:'In “The Sound of Music”, how does Evelyn Glennie experience music differently from most people?',a:'She senses music through vibrations in her body, allowing her to perform despite profound deafness.'},
  {subject:'Science',classNumber:'9',source:'Application lab',q:'Why does a metal spoon feel colder than a wooden spoon in the same room?',a:'Metal conducts heat away from your hand faster than wood, so it feels colder even though both are at room temperature.'},
  {subject:'Social Science',classNumber:'9',source:'NCERT + map work',q:'Why is power sharing desirable in a democracy? State two reasons.',a:'It reduces conflict between social groups and ensures political stability by giving all groups a voice.'},
  {subject:'Maths',classNumber:'10',source:'HOTS practice',q:'The area of a circle is 154 cm². Using π = 22/7, what is its radius?',a:'7 cm. Since πr² = 154, r² = 49 and r = 7.'},
  {subject:'Science',classNumber:'8',source:'Competency check',q:'A plant kept in darkness for two days is tested with iodine. What change do you expect and why?',a:'No blue-black colour appears because the plant used up its stored starch while kept away from light.'}
];
const questionPrompts = [
  'Define the central idea of {chapter} in your own words.',
  'Write two key facts you learned from {chapter}.',
  'Give one real-life example connected to {chapter}.',
  'What is the most important term in {chapter}? Explain it.',
  'Compare two ideas, processes, or examples from {chapter}.',
  'What common mistake should a learner avoid in {chapter}?',
  'Create a short revision note for {chapter}.',
  'How would you explain {chapter} to a younger student?',
  'Write one “why” question about {chapter} and answer it.',
  'Connect {chapter} to a previous chapter or concept.',
  'List the steps involved in the main process from {chapter}.',
  'Draw or describe a labelled diagram related to {chapter}.',
  'What evidence or example supports the main idea in {chapter}?',
  'Write a short case study based on {chapter}.',
  'Which part of {chapter} needs the most practice and why?',
  'Summarise {chapter} using exactly five sentences.',
  'Turn one key idea from {chapter} into a multiple-choice question.',
  'Find a cause-and-effect relationship in {chapter}.',
  'What would change if one condition in {chapter} were different?',
  'Write a board-exam style long-answer question for {chapter}.'
];
function createChapterQuestions() {
  const generated = [];
  Object.entries(syllabus).forEach(([classNumber, subjects]) => Object.entries(subjects).filter(([subject]) => subject !== '_books').forEach(([subject, chapters]) => chapters.forEach(chapter => {
    for (let number = 1; number <= questionPrompts.length; number += 1) {
      const template = questionPrompts[(number - 1) % questionPrompts.length];
      generated.push({subject, source:'Original practice', chapter, classNumber, q:`${template.replace('{chapter}', chapter)} (Question ${number}/100)`, a:`Use your Class ${classNumber} NCERT chapter “${chapter}” to build a complete answer with a definition, explanation, and suitable example.`});
    }
  })));
  return generated;
}
const questions = [...baseQuestions, ...createChapterQuestions()];
let activeClass = '8';
let activeSubject = 'All';
let shown = 3;

function renderSyllabus() {
  const grid = document.querySelector('#syllabus-grid');
  const data = syllabus[activeClass];
  grid.innerHTML = Object.entries(data).filter(([subject]) => subject !== '_books').map(([subject, chapters]) => `<article class="subject-card"><header><span class="icon">${icons[subject]}</span><span class="chapter-count">${chapters.length} chapters</span></header><h3>${subject}</h3><p><strong>${data._books?.[subject] || 'NCERT textbook'}</strong><br />20 guided practice prompts per chapter</p><div class="chapter-list">${chapters.slice(0, 3).map(chapter => `<span>${chapter}</span>`).join('')}</div><button class="dash-link chapter-practice" data-subject="${subject}">Practice all ${chapters.length} chapters →</button></article>`).join('');
  grid.querySelectorAll('.chapter-practice').forEach(button => button.addEventListener('click', () => {
    activeSubject = button.dataset.subject;
    shown = 3;
    document.querySelectorAll('.filter').forEach(filter => filter.classList.toggle('active', filter.dataset.subject === activeSubject));
    renderQuestions();
    document.querySelector('#practice').scrollIntoView({behavior:'smooth'});
  }));
}

function renderQuestions() {
  const grid = document.querySelector('#question-grid');
  const filtered = questions.filter(item => (activeSubject === 'All' || item.subject === activeSubject) && item.classNumber === activeClass);
  const visible = filtered.slice(0, shown);
  const chapterCount = new Set(filtered.map(item => item.chapter).filter(Boolean)).size;
  document.querySelector('#question-count').textContent = `${filtered.length} questions · ${chapterCount || 'mixed'} chapters`;
  grid.innerHTML = visible.map(item => `<article class="question-card"><div class="q-meta"><span>${item.subject}</span><span>${item.source}</span></div><h3>${item.q}</h3><button class="reveal" data-index="${questions.indexOf(item)}">Show answer guidance&nbsp; ↗</button></article>`).join('');
  document.querySelector('#load-more').style.display = shown >= filtered.length ? 'none' : 'block';
  grid.querySelectorAll('.reveal').forEach(button => button.addEventListener('click', () => {
    const item = questions[button.dataset.index];
    button.outerHTML = `<div class="answer"><strong>${item.chapter ? 'Answer guidance' : 'Answer'}</strong>${item.a}</div>`;
  }));
}

document.querySelectorAll('[data-scroll]').forEach(button => button.addEventListener('click', () => document.querySelector(button.dataset.scroll).scrollIntoView({behavior:'smooth'})));
document.querySelectorAll('.class-tab').forEach(button => button.addEventListener('click', () => { activeClass = button.dataset.class; shown = 3; document.querySelectorAll('.class-tab').forEach(tab => tab.classList.toggle('active', tab === button)); renderSyllabus(); renderQuestions(); }));
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { activeSubject = button.dataset.subject; shown = 3; document.querySelectorAll('.filter').forEach(filter => filter.classList.toggle('active', filter === button)); renderQuestions(); }));
document.querySelector('#load-more').addEventListener('click', () => { shown += 3; renderQuestions(); });
renderSyllabus();
renderQuestions();

document.querySelectorAll('.homework-list input').forEach(input => input.addEventListener('change', () => {
  const completed = document.querySelectorAll('.homework-list input:checked').length;
  document.querySelector('#homework-status').textContent = `${completed} of 4 complete`;
}));

let timerSeconds = 25 * 60;
let timerInterval;
const timerDisplay = document.querySelector('#timer-display');
const timerToggle = document.querySelector('#timer-toggle');
function updateTimer() {
  const minutes = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
  const seconds = (timerSeconds % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}
timerToggle.addEventListener('click', () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = undefined;
    timerToggle.textContent = 'Resume focus';
    return;
  }
  if (timerSeconds === 0) {
    timerSeconds = 25 * 60;
    updateTimer();
  }
  timerToggle.textContent = 'Pause focus';
  timerInterval = setInterval(() => {
    timerSeconds = Math.max(0, timerSeconds - 1);
    updateTimer();
    if (!timerSeconds) {
      clearInterval(timerInterval);
      timerInterval = undefined;
      timerToggle.textContent = 'Start focus';
    }
  }, 1000);
});
document.querySelector('#timer-reset').addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = undefined;
  timerSeconds = 25 * 60;
  timerToggle.textContent = 'Start focus';
  updateTimer();
});

const flashcardDeck = [
  {q:'What is the powerhouse of the cell?',a:'Mitochondria release usable energy through cellular respiration.'},
  {q:'What is photosynthesis?',a:'The process by which green plants use light energy to make food from carbon dioxide and water.'},
  {q:'What is the SI unit of force?',a:'The newton (N).'},
  {q:'What is the value of pi approximately?',a:'3.14159, often approximated as 22/7 for calculations.'},
  {q:'What is a prime number?',a:'A whole number greater than 1 with exactly two factors: 1 and itself.'},
  {q:'What is the function of the cell membrane?',a:'It regulates the movement of substances into and out of the cell.'},
  {q:'What is democracy?',a:'A form of government in which people choose their representatives through elections.'},
  {q:'What is a metaphor?',a:'A figure of speech that describes one thing as another to suggest a similarity.'},
  {q:'What is evaporation?',a:'The change of a liquid into vapour from its surface.'},
  {q:'What is an equation?',a:'A mathematical statement showing that two expressions are equal.'},
  {q:'What is federalism?',a:'A system in which power is divided between different levels of government.'},
  {q:'What is a food chain?',a:'A sequence showing how energy passes from one organism to another through feeding.'}
];
let flashcardIndex = 0;
function renderFlashcard() {
  const card = flashcardDeck[flashcardIndex];
  document.querySelector('.flash-front').textContent = card.q;
  document.querySelector('.flash-back').innerHTML = `${card.a}<br /><small>Tap to flip back</small>`;
  document.querySelector('#flash-index').textContent = `Card ${String(flashcardIndex + 1).padStart(2, '0')} / ${flashcardDeck.length}`;
}
renderFlashcard();
document.querySelector('#flashcard').addEventListener('click', event => event.currentTarget.classList.toggle('flipped'));
document.querySelector('#next-card').addEventListener('click', () => {
  document.querySelector('#flashcard').classList.remove('flipped');
  flashcardIndex = (flashcardIndex + 1) % flashcardDeck.length;
  renderFlashcard();
});
document.querySelectorAll('.quiz-options button').forEach(option => option.addEventListener('click', () => {
  document.querySelectorAll('.quiz-options button').forEach(item => item.classList.remove('correct', 'incorrect'));
  const correct = option.dataset.answer === 'right';
  option.classList.add(correct ? 'correct' : 'incorrect');
  document.querySelector('#quiz-feedback').textContent = correct ? 'Correct. +50 XP added!' : 'Not quite. Try the next one!';
}));