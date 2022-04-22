let nav = 0; //TODO Global state to discriminate which month are on now
let clicked = null; //TODO Global state using which day is clicked
let events = localStorage.getItem('events') //TODO Global state to store events from localstorage
   ?
   JSON.parse(localStorage.getItem('events'))
   :
   [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function openModal(date) {
  clicked = date;


  const clickedDate = document.getElementById('clicked_date');
  clickedDate.innerText = date;
  const eventForDay = events.find(e => e.date === clicked);
  if (eventForDay) {
    const _clickedDate = document.getElementById('_clicked_date');
    _clickedDate.innerText =date;
    document.getElementById('eventText').innerText = eventForDay.title;
    deleteEventModal.style.display = 'block';
  } else {

    newEventModal.style.display = 'block';
  }
}

function load() {
  const dt = new Date();

  if (nav !== 0) dt.setMonth(new Date().getMonth() + nav);

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  // const weekends = dt.getDay();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  //to know how many days in month
  
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });// ex> Friday, 1/1/2021
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
  //weekdays.indexOf('Friday')

  document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('ko-KR', { month: 'long' })} ${year}`;

  calendar.innerHTML = '';

  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    let dayOfWeek = new Date(i-paddingDays).getDay();
    let isWeekend = (dayOfWeek === 6) || (dayOfWeek  === 0); // 6 = Saturday, 0 = Sunday
    const dayString =
       `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      //TODO red on weekends
      daySquare.innerText = (i - paddingDays).toString();
      if(isWeekend) daySquare.className = 'weekend';
      const eventForDay = events.find(e => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);    
  }
}

function closeModal() {

  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  // backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}

function deleteEvent() {
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('cancelButton').addEventListener('click', closeModal);
  document.getElementById('deleteButton').addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);
}

initButtons();
load();
