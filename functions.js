function createCookie(name, value, expiration) {
  document.cookie = `${name}=${value}; expires=${expiration};SameSite=None; Secure`;
}

function getCookies() {
  let cookies = [];
  let cookiesStrings = decodeURIComponent(document.cookie).split(/;/);
  for (const cookieString of cookiesStrings) {
    let cookieStrSplit = cookieString.split(/\=/);
    cookies.push({ name: cookieStrSplit[0], value: cookieStrSplit[1] });
  }
  return cookies;
}

function saveLocation() {
  createCookie(document.getElementById('locationName').value, document.getElementById('location').innerText, new Date(Date.now() + 24*60*60*1000).toUTCString());
}

function listCookies(cookies) {
  for (const cookie of cookies) {
    let divElement = document.createElement('div');
    divElement.className = 'cookielist-element'
    divElement.innerText = `Cookie name: ${cookie.name} Value: ${cookie.value}`;
    document.getElementById('cookieList').appendChild(divElement);
  }
}

function doRequest(url, method = 'GET', data = {}, json = false) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        resolve(xhr.responseText);
      } else if (xhr.readyState == 4 && xhr.status != 200) {
        reject();
      }
    };
    xhr.open(method, url);
    xhr.send();
  }).then((response) => { return response; }, () => { return false; });
}

async function onMapClick(e) {
  //Obtiene la información de la ubucacion
  let resp = JSON.parse(await doRequest(`https://api.ipgeolocation.io/astronomy?apiKey=API_KEY&lat=${e.latlng.lat}&long=${e.latlng.lng}`));
  let dataString = `Tiempo actual: ${resp.current_time}<br>Fecha: ${resp.date}<br>Duración del dia: ${resp.day_length}`;
  document.getElementById('astro-data').innerHTML = dataString;
  document.getElementById('location').innerText = `${e.latlng.lat},${e.latlng.lng}`;
}

async function indexMap() {
  if (document.readyState == 'complete') {
    //Creando mapa
    let myMap = L.map('mapid').setView([25.685, -100.319], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=API_KEY', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'API_KEY'
    }).addTo(myMap);
    document.getElementById('content').style.height = `${parseInt(window.innerHeight * 0.85)}px`;
    document.getElementById('mapid').style.height = `${parseInt(window.innerHeight * 0.85)}px`;
    window.onresize = function (event) {
      document.getElementById('mapid').style.height = `${parseInt(window.innerHeight * 0.85)}px`;
    };
    myMap.on('click', onMapClick);
  }
}
