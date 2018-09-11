(function ({ moment }, TimeParser) {
  function parseAndDisplay (query) {
    const separators = [' to ', ' in ']
    const sep = separators.find((sep) => query.includes(sep))
    const [fromTsTzPart, toTzPart] = query.split(sep)

    const parser = new TimeParser(fromTsTzPart)
    const fromObj = parser.parse()
    const tzOffset = parser.parseTimezone(toTzPart)

    const outFormats = [
      'ddd, D MMM YYYY, h:mm a Z',
      'YYYY-MM-DD HH:mm:ss Z',
      'X'
    ]
    const fromHTML = [
      `<span class="datetime">${fromObj.datetime}</span>`,
      fromObj.utcOffset !== null ? `<span class="from-tz">${fromObj.timezone}</span>` : ''
    ].join(' ')

    if (fromObj.moment) {
      const inputs = [fromHTML].concat(outFormats.map((f) => fromObj.moment.format(f)))
      Array.from(document.querySelectorAll('.from > div')).forEach((elem, i) => {
        if (i === 0) {
          elem.innerHTML = inputs[i]
        } else {
          elem.textContent = inputs[i]
        }
      })
    } else {
      // could not find a matching format to the input string
      Array.from(document.querySelectorAll('.from > div')).forEach((elem, i) => {
        elem.textContent = i === 0 ? 'Could not parse input' : ''
      })
    }

    const toHTML = `<span class="to-tz">${toTzPart}</span>`
    if (tzOffset === null) {
      Array.from(document.querySelectorAll('.to > div')).forEach((elem, i) => {
        elem.textContent = i === 0 ? 'Invalid output timezone' : ''
      })
    } else if (!fromObj.moment) {
      Array.from(document.querySelectorAll('.to > div')).forEach((elem, i) => {
        elem.innerHTML = i === 0 ? toHTML : ''
      })
    } else {
      document.querySelector('.resultbox > .sep').textContent = sep
      const outputs = [toHTML].concat(
        outFormats.map((format) => fromObj.moment.utcOffset(tzOffset).format(format))
      )
      Array.from(document.querySelectorAll('.to > div')).forEach((elem, i) => {
        if (i === 0) {
          elem.innerHTML = outputs[i]
        } else {
          elem.textContent = outputs[i]
        }
      })
    }
  }

  function onClickSearch (e) {
    e.preventDefault() // Prevent sending to server
    parseAndDisplay(document.querySelector('.query').value.trim())
  }

  function toggleExamples (forceHide) {
    const pulldownElem = document.querySelector('.examples-pulldown')
    const elem = document.querySelector('.examples')
    const hideScale = 'scaleY(0)'
    const showScale = 'scaleY(1)'
    const hidePos = 'absolute'
    const showPos = 'relative'
    const hideOpacity = '0'
    const showOpacity = '1'
    const hideText = 'Show Examples'
    const showText = 'Hide Examples'

    elem.style.transform = elem.style.transform === hideScale ? showScale : hideScale
    elem.style.position = elem.style.position === hidePos ? showPos : hidePos
    elem.style.opacity = elem.style.opacity === hideOpacity ? showOpacity : hideOpacity
    pulldownElem.textContent = pulldownElem.textContent === hideText ? showText : hideText
  }

  function onClickExampleRow (e) {
    const target = (e.target !== this) ? e.target.parentElement : e.target
    const texts = Array.from(target.children).map((child) => child.textContent)
    const query = texts.join(' ')
    parseAndDisplay(query)
    document.querySelector('.query').value = query
  }

  function renderWorldClocks () {
    const worldPlaces = ['San Francisco', 'UTC', 'London', 'India', 'Singapore']
    const elem = document.querySelector('.worldclocks')
    const parser = new TimeParser()

    elem.innerHTML = worldPlaces.map((place) => {
      const rMoment = moment().utcOffset(parser.parseTimezone(place))

      return `<div class="clock">
        <div class="place"> ${place}</div>
        <div class="to-tz">${rMoment.format('Z')}</div>
        <div class="time"> ${rMoment.format('h:mm a')}</div>
        <div class="date"> ${rMoment.format('ddd, MMM D')} </div>
      </div>`
    }).join('')
  }

  document.querySelector('button.submit').addEventListener('click', onClickSearch)
  document.querySelector('.examples-pulldown').addEventListener('click', toggleExamples)
  Array.from(document.querySelectorAll('.clickable')).forEach((e) => {
    e.addEventListener('click', onClickExampleRow, false)
  })

  function fetchAirportTimezones () {
    fetch('airport_timezones.json').then(r => r.json()).then(data => window.TimeConvert.airport_timezones = data)
  }

  fetchAirportTimezones()
  renderWorldClocks()
  window.setInterval(renderWorldClocks, 60000) // Update every minute
})(window, TimeParser)
