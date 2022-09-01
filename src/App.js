import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ country }) => {
  const [weather, setWeather] = useState({})
  const lat = country.capitalInfo.latlng[0]
  const lon = country.capitalInfo.latlng[1]

  const hook = () => {
    axios
      .get(
        `http://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_MY_ARY_KEY}&q=${lat},${lon}`
      )
      .then((response) => {
        setWeather(response)
        console.log(response.data.temp_c)
      })
      .then(console.log(JSON.stringify(weather, null, 2)))
      .catch(console.log('can not load weather api'))
  }
  useEffect(hook, [])

  if (!weather.data) {
    return <h3>Loading weather...</h3>
  }

  return (
    <div>
      <h2>
        Weather in {country.capital[0]}, {country.name.official}
      </h2>
      <p>temperature {weather.data.current.temp_c}&deg;Celsius</p>
      <img src={weather.data.current.condition.icon} />{' '}
      <p>{weather.data.current.condition.text}</p>
      <p>wind {weather.data.current.wind_kph} km/h</p>
    </div>
  )
}

const Display = ({ countries, input, displayState }) => {
  const handleClick = (el) => {
    displayState([el])
  }

  if (input.length === 0) return <p>Start typing country name.</p>

  if (countries.length > 1 && countries.length < 15) {
    return countries.map((el) => {
      return (
        <ul>
          <li key={el.name.official}>
            {' '}
            {el.name.official}{' '}
            <button
              key={el.name.common}
              value={{ el }}
              onClick={() => handleClick(el)}
            >
              show
            </button>
          </li>
        </ul>
      )
    })
  } else if (countries.length >= 15)
    return <p>Too many matches, specify filter...</p>
  else if (countries.length === 0 && input.length > 0) {
    return <p>{`No matches found :(`}</p>
  }
  // Country page
  if (countries.length === 1) {
    return (
      <div>
        <h1>{countries[0].name.official}</h1>

        <p>
          capital:{'  '}
          {countries[0].capital[0]}
        </p>
        <p>
          Area:{'  '}
          {countries[0].area} square kilometers
        </p>
        <p>Population: {countries[0].population}</p>

        <h4>languages:</h4>
        <ul>
          {Object.entries(countries[0].languages).map(([key, value]) => {
            return <li id={key}>{value}</li>
          })}
        </ul>
        <div>
          <img
            src={countries[0].flags.png}
            alt={`flag of ${countries[0].name.official}`}
          />
        </div>
        <Weather country={countries[[0]]} />
      </div>
    )
  }
}

function App() {
  // //////////////////
  const [countries, setCountries] = useState([])
  const [displayedCountries, setDisplayed] = useState([])
  const [newInput, setInput] = useState('')

  const hook = () => {
    axios.get('https://restcountries.com/v3.1/all').then((response) => {
      console.log(`countries set`)
      setCountries(response.data)
    })
  }
  useEffect(hook, [])

  const handleChange = (event) => {
    const input = event.target.value
    setInput(input)
    sortCountries(input)
  }
  const sortCountries = (input) => {
    const filterdCountries = countries.filter((el) => {
      return el.name.official.toLowerCase().includes(input.toLowerCase())
    })
    setDisplayed(filterdCountries)
  }

  if (!countries[0]) return <h3>Loading countries database...</h3>
  return (
    <div>
      <div>
        <label>
          Find countries:{'  '}
          <input id='search' type='text' onChange={handleChange} />
        </label>
      </div>
      <Display
        countries={displayedCountries}
        input={newInput}
        displayState={setDisplayed}
      />
    </div>
  )
}

export default App
