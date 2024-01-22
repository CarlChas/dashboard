import axios from 'axios'
import isUrl from 'is-url'

const url = 'https://jsonplaceholder.typicode.com/users';
async function getUser(url) {
  try {
    const response = await axios.get(url)
    console.log(response)
  }
  catch (error) {
    console.error(error)
  }
}
getUser(url)

myTimer()
setInterval(myTimer, 1000)

function myTimer() {
  const now = new Date()
  /* 
  let hour = 5; // Fixed value for testing
  let minute = 3; // Fixed value for testing 
  */
  let hour = now.getHours().toString().padStart(2, '0')
  let minute = now.getMinutes().toString().padStart(2, '0')
  document.getElementById("myTime").innerHTML = hour + ":" + minute + " " + now.toLocaleDateString()
}

document.getElementById("myTitle").placeholder = "Click to edit this title"

document.getElementById("myTitle").addEventListener('input', function () {
  localStorage.setItem('myName', this.value)
})

document.getElementById("myNotes").placeholder = "Your very own notepad!"
document.getElementById("myNotes").addEventListener('input', function () {
  localStorage.setItem('setNotes', this.value)
})

//knapp för att lägga till länkar
let links = JSON.parse(localStorage.getItem('myLinks')) || []

document.getElementById("newLink").addEventListener('click', function () {
  let chosenUrl = prompt("Url:", "")
  let myUrl = isUrl(chosenUrl)
  if (myUrl) {
    const urlExists = links.some(link => link.url === chosenUrl)

    if (urlExists) {
      alert("This URL already exists.")
    }
    else {
      let titleUrl = prompt("Choose the title for the link: ", "")

      let thisUrl = document.createElement("a")
      thisUrl.innerHTML = titleUrl
      thisUrl.classList.add('myUrl')
      thisUrl.href = chosenUrl


      let deleteUrl = document.createElement("button")
      deleteUrl.classList.add('antiUrl')
      deleteUrl.innerHTML = 'Delete'


      let visualUrl = document.createElement("li")
      visualUrl.appendChild(thisUrl)
      visualUrl.appendChild(deleteUrl)

      deleteUrl.addEventListener('click', function (event) {
        if (event.target.classList.contains('antiUrl')) {

          const listItem = this.parentNode
          const urlToDelete = this.previousSibling.href

          listItem.remove()
          links = links.filter(link => link.url !== urlToDelete)

          localStorage.setItem('myLinks', JSON.stringify(links))
        }
      })

      document.getElementById("myShortcuts").appendChild(visualUrl)

      links.push({ url: chosenUrl, title: titleUrl })
      localStorage.setItem('myLinks', JSON.stringify(links))
      console.log('Links saved:', links)
    }
  }
})

//sidan laddas

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed')
  myCats()

  setInterval(() => {
    myCats()
  }, 5000)

  const myName = localStorage.getItem('myName')
  if (myName) {
    document.getElementById('myTitle').value = myName
  }

  const myNotes = document.getElementById('myNotes');
  function adjustTextareaHeight() {
    myNotes.style.height = 'inherit';
    myNotes.style.height = `${myNotes.scrollHeight}px`;
  }
  myNotes.addEventListener('input', adjustTextareaHeight);

  const thisNote = localStorage.getItem('setNotes')
  if (thisNote) {
    myNotes.value = thisNote
    adjustTextareaHeight()
  }

  const savedImage = localStorage.getItem('backgroundImage');
  if (savedImage) {
    document.getElementById("app").style.backgroundImage = `url('${savedImage}')`;
  }

  const savedLinks = localStorage.getItem('myLinks')
  console.log('Retrieved links from localStorage:', savedLinks)

  if (savedLinks) {
    const linksArray = JSON.parse(savedLinks)
    console.log('Parsed links array:', linksArray)

    linksArray.forEach(link => {
      let thisUrl = document.createElement("a")
      thisUrl.innerHTML = link.title
      thisUrl.href = link.url
      thisUrl.classList.add('myUrl')


      let deleteUrl = document.createElement("button")
      deleteUrl.classList.add('antiUrl')
      deleteUrl.innerHTML = 'Delete'


      let visualUrl = document.createElement("li")
      visualUrl.appendChild(thisUrl)
      visualUrl.appendChild(deleteUrl)

      const shortcutsContainer = document.getElementById("myShortcuts")
      if (shortcutsContainer) {
        shortcutsContainer.appendChild(visualUrl)

        deleteUrl.addEventListener('click', function (event) {
          if (event.target.classList.contains('antiUrl')) {

            const listItem = this.parentNode
            const urlToDelete = this.previousSibling.href

            listItem.remove()
            links = links.filter(link => link.url !== urlToDelete)

            localStorage.setItem('myLinks', JSON.stringify(links))
          }
        })
      } else {
        console.log("Can't find the 'myShortcuts' element in the DOM")
      }
    })
  } else {
    console.log("No saved links found in localStorage.")
  }
})

//Väder

async function getCityNameFromCoordinates(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data && data.address) {
      return data.address.city || data.address.town || data.address.village || 'Unknown';
    }
    return 'Unknown';
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return 'Unknown';
  }
}

function loadWeather() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const cityName = await getCityNameFromCoordinates(position.coords.latitude, position.coords.longitude);

      await myWeather(position.coords.latitude, position.coords.longitude, cityName)
    }, (error) => {
      console.error(error)
      alert("Can't find you :(")
    })
  } else {
    alert("Unsupported Bowser")
  }
  //hourly update
  setInterval(loadWeather, 3600000)
}
async function myWeather(lat, lon, cityName) {
  const myAPI = 'BHHEGB6XHJRJLTWYG99BATYLU'
  const urlWeather = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=${myAPI}&contentType=json`

  try {
    const response = await axios.get(urlWeather)
    const data = response.data
    showWeather(data, cityName)
  } catch (error) {
    console.error('No weather data:', error)
  }
}
function showWeather(data, cityName) {
  const weatherDiv = document.getElementById('weather')
  const currentWeather = data.currentConditions
  const tomorrowWeather = data.days[1]
  const fiveWeather = data.days[5]

  //<h2>Current Weather in ${data.address}</h2> ska länkas till en geolocation API

  weatherDiv.innerHTML = `
  <h2>Current Weather in ${cityName}</h2>
  <p>Current Temperature: ${currentWeather.temp}°C</p>
  <h3>Forecast</h3>
  <p>Temperature Tomorrow: ${tomorrowWeather.temp}°C</p>
  <p>Temperature in 5 Days: ${fiveWeather.temp}°C</p>
  `;
}

//Cat api

async function myCats() {
  const apiCat = 'live_1vA3soEqcAHnBw7IKBWSiLl5t4SxsMdW7enD0Zwp6u62VgDVWxQgyEYMrs5GnLTC'
  const catLimit = 'https://api.thecatapi.com/v1/images/search'

  try {
    const response = await axios.get(catLimit, {
      headers: apiCat ? { 'x-api-key': apiCat } : {}
    })
    const catData = response.data[0];
    console.log(catData);

    if (catData && catData.url) {
      const imageContainer = document.getElementById('custom');
      imageContainer.innerHTML = `<img src="${catData.url}" alt="Random Cat Image"/>`;
    }
  } catch (error) {
    console.error('Error fetching cat image:', error);
  }
}

///////////////////////////////////////////////////////////////////////////////7

document.getElementById('splash').addEventListener('click', function () {
  let ranImg = "7aF3aGqX0PHHrN7fa3ATk0fPjavYWVj_tnauNETbowc"
  let imgUrl = `https://api.unsplash.com/photos/random?client_id=${ranImg}`

  axios.get(imgUrl)
    .then(response => {
      const splashData = response.data.urls.regular
      document.getElementById("app").style.backgroundImage = `url('${splashData}')`

      localStorage.setItem('backgroundImage', splashData)
    }).catch(error => {
      console.error("No images found :(", error)
    })
})

myCats()
loadWeather()