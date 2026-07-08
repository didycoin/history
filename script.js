// ===============================
// HISTORY HUB
// PART 1
// ===============================

// ---------- Navigation ----------

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".nav");

navButtons.forEach(button=>{

button.addEventListener("click",()=>{

navButtons.forEach(b=>b.classList.remove("active"));
button.classList.add("active");

pages.forEach(page=>page.classList.remove("active"));

document
.getElementById(button.dataset.page)
.classList.add("active");

});

});

// ---------- Data ----------

const sessions=[

{
title:"Session 1",
topic:"Rights & Freedoms Overview",
xp:100,
tasks:[
"Read assessment notification",
"Create timeline",
"Summarise all topics",
"Learn key vocabulary"
]
},

{
title:"Session 2",
topic:"Stolen Generations",
xp:120,
tasks:[
"Causes",
"Impacts",
"Important dates",
"Flashcards"
]
},

{
title:"Session 3",
topic:"Freedom Ride",
xp:120,
tasks:[
"Who organised it",
"What happened",
"Why it mattered",
"Review flashcards"
]
},

{
title:"Session 4",
topic:"1967 Referendum",
xp:140,
tasks:[
"What changed",
"Results",
"Importance",
"Timeline review"
]
},

{
title:"Session 5",
topic:"Land Rights",
xp:150,
tasks:[
"Wave Hill",
"Land Rights Act",
"Importance",
"Practice recall"
]
},

{
title:"Session 6",
topic:"Why Australians Enlisted",
xp:160,
tasks:[
"Causes of WWI",
"Recruitment",
"Patriotism",
"Vocabulary"
]
},

{
title:"Session 7",
topic:"Gallipoli",
xp:170,
tasks:[
"Landing",
"Trench warfare",
"Evacuation",
"Significance"
]
},

{
title:"Session 8",
topic:"Final Review",
xp:250,
tasks:[
"Complete flashcards",
"Practice TEEL",
"Review weak topics",
"Self-test"
]
}

];

// ---------- Save ----------

let save={

xp:Number(localStorage.getItem("xp"))||0,

completed:
JSON.parse(localStorage.getItem("completed"))||[],

tasks:
JSON.parse(localStorage.getItem("tasks"))||{}

};

// ---------- Dashboard ----------

function updateDashboard(){

const level=Math.floor(save.xp/1000)+1;

document.getElementById("level").innerText=level;

document.getElementById("xp").innerText=
save.xp+" / "+(level*1000);

document.getElementById("sessions").innerText=
save.completed.length+" / 8";

const readiness=Math.round(
(save.completed.length/8)*100
);

document.getElementById("readiness").innerText=
readiness+"%";

document.getElementById("progressBar").style.width=
readiness+"%";

document.getElementById("progressText").innerText=
readiness+"%";

}

// ---------- Calendar ----------

const calendar=document.getElementById("studyCalendar");

function buildCalendar(){

calendar.innerHTML="";

sessions.forEach((session,index)=>{

const card=document.createElement("div");

card.className="sessionCard";

let html=`

<div class="sessionHeader">

<div>

<h2>${session.title}</h2>

<p>${session.topic}</p>

</div>

<div>

<strong>${session.xp} XP</strong>

</div>

</div>

<div class="sessionTasks">

`;

session.tasks.forEach((task,i)=>{

const id=`${index}-${i}`;

const checked=
save.tasks[id]?"checked":"";

html+=`

<label>

<input
type="checkbox"
data-id="${id}"
data-session="${index}"
${checked}
>

${task}

</label>

`;

});

html+=`</div>`;

card.innerHTML=html;

calendar.appendChild(card);

});

addCheckboxEvents();

}

function addCheckboxEvents(){

document
.querySelectorAll(".sessionTasks input")
.forEach(box=>{

box.addEventListener("change",()=>{

save.tasks[box.dataset.id]=box.checked;

localStorage.setItem(
"tasks",
JSON.stringify(save.tasks)
);

checkCompletion();

});

});

}

updateDashboard();
buildCalendar();
// ===============================
// PART 2
// XP • Progress • Achievements
// ===============================

const toast=document.getElementById("toast");
const completeSound=document.getElementById("completeSound");

function showToast(text){

toast.innerText=text;

toast.classList.add("show");

setTimeout(()=>{
toast.classList.remove("show");
},2500);

}

function saveData(){

localStorage.setItem("xp",save.xp);

localStorage.setItem(
"completed",
JSON.stringify(save.completed)
);

localStorage.setItem(
"tasks",
JSON.stringify(save.tasks)
);

}

function sessionFinished(index){

if(save.completed.includes(index)) return;

save.completed.push(index);

save.xp+=sessions[index].xp;

saveData();

updateDashboard();

unlockAchievements();

celebrate();

showToast(
`+${sessions[index].xp} XP`
);

completeSound.play();

}

function celebrate(){

if(typeof confetti==="undefined") return;

confetti({

particleCount:160,

spread:90,

origin:{y:.65}

});

}

function checkCompletion(){

sessions.forEach((session,index)=>{

let finished=true;

session.tasks.forEach((task,i)=>{

const id=`${index}-${i}`;

if(!save.tasks[id]){

finished=false;

}

});

if(finished){

sessionFinished(index);

}

});

saveData();

updateDashboard();

}

// ===============================
// Achievements
// ===============================

function unlock(id,text){

const card=document.getElementById(id);

if(card.classList.contains("unlocked")) return;

card.classList.remove("locked");

card.classList.add("unlocked");

showToast("🏆 "+text);

}

function unlockAchievements(){

// First Session

if(save.completed.length>=1){

unlock("a1","First Session Complete");

}

// Three Sessions

if(save.completed.length>=3){

unlock("a2","3 Study Sessions");

}

// Rights & Freedoms

if(

save.completed.includes(0)&&

save.completed.includes(1)&&

save.completed.includes(2)&&

save.completed.includes(3)&&

save.completed.includes(4)

){

unlock("a3","Rights & Freedoms Master");

}

// Gallipoli

if(

save.completed.includes(5)&&

save.completed.includes(6)

){

unlock("a4","Gallipoli Expert");

}

// Holiday Complete

if(save.completed.length===8){

unlock("a5","Holiday Complete");

}

}

// ===============================
// Goal Text
// ===============================

function updateGoal(){

const goal=document.getElementById("goalText");

const remaining=sessions.filter(

(s,i)=>!save.completed.includes(i)

);

if(remaining.length===0){

goal.innerHTML=
"🎉 Everything completed!";

return;

}

goal.innerHTML=

"Next Session:<br><br><strong>"+

remaining[0].topic+

"</strong>";

}

updateGoal();

unlockAchievements();

checkCompletion();
// ===============================
// PART 3
// Pomodoro • Flashcards • Particles
// ===============================

// ---------- Pomodoro ----------

let timerSeconds = 25 * 60;
let timerInterval = null;

const display = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

function updateTimer(){

const mins = Math.floor(timerSeconds / 60)
.toString()
.padStart(2,"0");

const secs = (timerSeconds % 60)
.toString()
.padStart(2,"0");

display.innerText = mins + ":" + secs;

}

startBtn.onclick = () => {

if(timerInterval) return;

timerInterval = setInterval(()=>{

timerSeconds--;

updateTimer();

if(timerSeconds <= 0){

clearInterval(timerInterval);

timerInterval = null;

celebrate();

showToast("Pomodoro Complete! 🎉");

completeSound.play();

timerSeconds = 25 * 60;

updateTimer();

}

},1000);

};

pauseBtn.onclick = () => {

clearInterval(timerInterval);

timerInterval = null;

};

resetBtn.onclick = () => {

clearInterval(timerInterval);

timerInterval = null;

timerSeconds = 25 * 60;

updateTimer();

};

updateTimer();

// ---------- Flashcards ----------

const flashcards=[

{
front:"Stolen Generations",
back:"Aboriginal children removed from their families by government policies."
},

{
front:"Freedom Ride",
back:"1965 protest against racial discrimination led by Charles Perkins."
},

{
front:"1967 Referendum",
back:"Allowed the federal government to make laws for Aboriginal Australians and include them in the census."
},

{
front:"Land Rights",
back:"Recognition of Aboriginal ownership and connection to traditional land."
},

{
front:"Gallipoli",
back:"1915 campaign in Türkiye remembered for the ANZAC legend."
},

{
front:"Why Australians Enlisted",
back:"Patriotism, adventure, loyalty to Britain, employment and pressure."
}

];

const flashcardArea =
document.getElementById("flashcardArea");

flashcards.forEach(card=>{

const div=document.createElement("div");

div.className="flashcard";

div.innerHTML=`

<div class="flashInner">

<div class="flashFront">

${card.front}

</div>

<div class="flashBack">

${card.back}

</div>

</div>

`;

div.onclick=()=>{

div.classList.toggle("flip");

};

flashcardArea.appendChild(div);

});

// ---------- Particle Background ----------

if(typeof tsParticles!=="undefined"){

tsParticles.load("particles",{

background:{
color:"transparent"
},

fpsLimit:60,

particles:{

number:{
value:70
},

color:{
value:"#4cc9f0"
},

links:{
enable:true,
distance:160,
opacity:.2
},

move:{
enable:true,
speed:1
},

opacity:{
value:.4
},

size:{
value:{
min:1,
max:4
}
}

}

});

}

// ---------- Streak ----------

const today = new Date().toDateString();

let streak = Number(localStorage.getItem("streak")) || 0;
let lastDay = localStorage.getItem("lastDay");

if(lastDay !== today){

streak++;

localStorage.setItem("streak",streak);
localStorage.setItem("lastDay",today);

}

const streakCard=document.createElement("div");

streakCard.className="card";

streakCard.innerHTML=`

<h2>🔥 Current Streak</h2>

<h1>${streak}</h1>

`;

document
.getElementById("dashboard")
.appendChild(streakCard);

// ---------- Random Quote ----------

const quotes=[

"Small progress is still progress.",

"Consistency beats motivation.",

"Future you will thank you.",

"One study session at a time.",

"Discipline > Motivation.",

"Learn it now. Master it later."

];

const quoteCard=document.createElement("div");

quoteCard.className="card";

quoteCard.innerHTML=`

<h2>Today's Motivation</h2>

<p style="font-size:20px;margin-top:15px;">
"${quotes[Math.floor(Math.random()*quotes.length)]}"
</p>

`;

document
.getElementById("dashboard")
.appendChild(quoteCard);
// ===============================
// PART 4
// Music • Calendar • Statistics
// ===============================

// ---------- Lofi Music ----------

const musicCard=document.createElement("div");

musicCard.className="card";

musicCard.innerHTML=`

<h2>🎵 Study Music</h2>

<p>Lo-fi Girl Radio</p>

<iframe
width="100%"
height="300"
src="https://www.youtube.com/embed/jfKfPfyJRdk"
title="LoFi"
frameborder="0"
allow="autoplay"
allowfullscreen>
</iframe>

`;

document
.getElementById("dashboard")
.appendChild(musicCard);

// ---------- Calendar ----------

const studyDays=[
"Monday",
"Wednesday",
"Friday",
"Saturday",
"Monday",
"Tuesday",
"Thursday",
"Sunday"
];

const calendarCard=document.createElement("div");

calendarCard.className="card";

let calendarHTML="<h2>📅 Holiday Plan</h2>";

sessions.forEach((s,i)=>{

calendarHTML+=`

<div style="
display:flex;
justify-content:space-between;
padding:12px;
margin-top:10px;
border-radius:12px;
background:rgba(255,255,255,.05);
">

<div>

<strong>${studyDays[i]}</strong>

</div>

<div>

${s.topic}

</div>

</div>

`;

});

calendarCard.innerHTML=calendarHTML;

document
.getElementById("calendar")
.appendChild(calendarCard);

// ---------- Study Statistics ----------

const statsCard=document.createElement("div");

statsCard.className="card";

function updateStats(){

const complete=save.completed.length;

const remaining=8-complete;

statsCard.innerHTML=`

<h2>📈 Statistics</h2>

<p style="margin-top:15px">

✅ Sessions Finished:
<strong>${complete}</strong>

</p>

<p>

📚 Remaining:
<strong>${remaining}</strong>

</p>

<p>

🏆 XP:
<strong>${save.xp}</strong>

</p>

<p>

📊 Readiness:
<strong>${Math.round((complete/8)*100)}%</strong>

</p>

`;

}

updateStats();

document
.getElementById("dashboard")
.appendChild(statsCard);

// ---------- Level Up ----------

let previousLevel=
Math.floor(save.xp/1000)+1;

setInterval(()=>{

const level=
Math.floor(save.xp/1000)+1;

if(level>previousLevel){

previousLevel=level;

celebrate();

showToast("🎉 LEVEL UP!");

}

updateStats();

},1000);

// ---------- Floating Effect ----------

document.querySelectorAll(".card").forEach(card=>{

card.addEventListener("mousemove",e=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;
const y=e.clientY-rect.top;

const rotateY=((x/rect.width)-0.5)*12;
const rotateX=((y/rect.height)-0.5)*-12;

card.style.transform=
`perspective(1000px)
rotateX(${rotateX}deg)
rotateY(${rotateY}deg)
scale(1.02)`;

});

card.addEventListener("mouseleave",()=>{

card.style.transform="";

});

});

// ---------- Welcome ----------

setTimeout(()=>{

showToast("Welcome back 👋");

},800);

// ---------- Random Study Tip ----------

const tips=[

"Review yesterday's work before learning something new.",

"Teach the topic out loud to yourself.",

"Use active recall instead of rereading.",

"Flashcards are best when reviewed regularly.",

"Spend more time on weak topics than strong ones.",

"Take a 5 minute break every 25 minutes."

];

const tipCard=document.createElement("div");

tipCard.className="card";

tipCard.innerHTML=`

<h2>💡 Study Tip</h2>

<p style="margin-top:15px;font-size:18px;">

${tips[Math.floor(Math.random()*tips.length)]}

</p>

`;

document
.getElementById("dashboard")
.appendChild(tipCard);

// ---------- Completion Screen ----------

function finishHoliday(){

if(save.completed.length!==8) return;

const overlay=document.createElement("div");

overlay.style.position="fixed";
overlay.style.inset="0";
overlay.style.background="rgba(0,0,0,.92)";
overlay.style.display="flex";
overlay.style.flexDirection="column";
overlay.style.justifyContent="center";
overlay.style.alignItems="center";
overlay.style.zIndex="99999";

overlay.innerHTML=`

<h1 style="font-size:70px;">
🎉
</h1>

<h2 style="margin:20px;">
Holiday Complete
</h2>

<p>
You're ready for Term 3.
</p>

<button
style="
margin-top:30px;
padding:15px 30px;
border:none;
border-radius:12px;
font-size:18px;
cursor:pointer;
">

Close

</button>

`;

overlay
.querySelector("button")
.onclick=()=>overlay.remove();

document.body.appendChild(overlay);

celebrate();

}

finishHoliday();
