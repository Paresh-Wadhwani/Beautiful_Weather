const apiKey = 'b8a3a6cbbbf2aabbae42dc8f9cb92f70'

let temperatureDesc;
let temperatureValue;
let timezone;
let unit;
let temperatureSection;

const iconId = 'weather-icon'

const farenheitToCelsuis = (f) =>
{
	const c = (f - 32) * 5 / 9
	return Number(c.toFixed(2))
}

const celsuisToFarenheit = (c) =>
{
	const f = (c * 9 / 5) + 32
	return Number(f.toFixed(2))
}

const temperatureClickHandler = () =>
{
	const currentUnit = unit.textContent

	if (currentUnit === 'F')
	{
		unit.textContent = 'C'
		temperatureValue.textContent = farenheitToCelsuis(temperatureValue.textContent)
	}
	else if (currentUnit === 'C')
	{
		unit.textContent = 'F'
		temperatureValue.textContent = celsuisToFarenheit(temperatureValue.textContent)
	}
}

const capitalizeString = (strng) =>
{
	const capitalized = strng.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())

	return capitalized
}

const convertIconCode = (openWeatherIconCode) =>
{

	// The openWeatherApi returns icon codes like '01d' & '04n' which can be used to fetch the same from their server.
	// But we are gonna use another icon library named Skycons for this app since it goes with the design.
	// In this function, we are converting the ion codes returned by openWeather API into corresponding skycon code.

	const iconCodeDictionary = 
	{
		'01d': 'CLEAR_DAY',
		'01n': 'CLEAR_NIGHT',

		'02d': 'PARTLY_CLOUDY_DAY',
		'02n': 'PARTLY_CLOUDY_NIGHT',

		'03d': 'CLOUDY',
		'03n': 'CLOUDY',

		'04d': 'CLOUDY',
		'04n': 'CLOUDY',

		'09d': 'RAIN',
		'09n': 'RAIN',

		'10d': 'SLEET',
		'10n': 'SLEET',

		'11d': 'CLOUDY',
		'11n': 'CLOUDY',

		'13d': 'SNOW',
		'13n': 'SNOW',

		'50d': 'FOG',
		'50n': 'FOG'
	}

	return iconCodeDictionary[openWeatherIconCode]
}

const setIcons = skyConCode =>
{
	const constructorParams = {color: 'white'}
	const skyCon = new Skycons(constructorParams)
	skyCon.play();

	return skyCon.set(iconId, Skycons[skyConCode])
}

const declinedPermissionHandler = () =>
{
	const alertMessage_declined = 'Looks like location access was declined. This app requires access to location for proper functioning. Please allow location access and refresh the page.'

	alert(alertMessage_declined)
}

const domManipulationController = data =>
{
	// This function is to make all the DOM manipulations on basis of data fetched

	const temperature = data.main.temp
	const description = data.weather[0].description
	const city = data.name
	const country = data.sys.country
	const iconCode_openWeatherMap = data.weather[0].icon

	const convertedIconCode = convertIconCode(iconCode_openWeatherMap)

	const locationDetail = city + ' [' + country + ']'

	const description_formatted = capitalizeString(description);

	temperatureValue.textContent = temperature
	temperatureDesc.textContent = description_formatted
	timezone.textContent = locationDetail
	unit.textContent = 'F'
	unit.style.marginLeft = '10px'

	setIcons(convertedIconCode, document.querySelector('#weather-icon'))
}

const approvedPermissionHandler = position =>
{
	// This will be the main controller for accessing the location data and displaying it on frontend.

	let long = position.coords.longitude;
	let lat = position.coords.latitude;

	const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=imperial`

	fetch(weatherApiUrl)
		.then
		(
			response =>
			{
				return response.json()
			}
		)
		.then(domManipulationController)
	
}

const mainApplicationController = () =>
{

	// This is the main function of the app.
	
	temperatureDesc = document.querySelector('.temperature-desc')
	temperatureValue = document.querySelector('.temperature-value')
	timezone = document.querySelector('.location-timezone')
	unit = document.querySelector('.temperature-unit')
	temperatureSection = document.querySelector('.temperature')

	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition
		(
			approvedPermissionHandler,
			declinedPermissionHandler
		)
	}
	else
	{
		const alertMessage_unsupported = 'Your browser does not support Geolocation which is required for proper functioning of this app.'
		alert(alertMessage_unsupported)
	}

	temperatureSection.addEventListener
	(
		'click',
		temperatureClickHandler
	)

}

window.addEventListener
(
	'load',
	mainApplicationController
)

