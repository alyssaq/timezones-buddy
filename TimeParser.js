class TimeParser {
  constructor (timeInput = '') {
    this.timeInput = timeInput.trim()
  }

  isNow () {
    return this.timeInput.startsWith('now') || this.timeInput.startsWith('time')
  }

  isHere (tzPart) {
    return tzPart.startsWith('here')
  }

  parse () {
    if (this.isNow()) {
      return {
        moment: moment(),
        timezone: '',
        datetime: 'now'
      }
    }

    const parts = this.timeInput.split(' ')
    const timezone = parts[parts.length - 1]
    const utcOffset = this.parseTimezone(timezone)  // offset can be 0 so check for null
    const timeWithoutTz = utcOffset === null ? this.timeInput : parts.slice(0, parts.length - 1).join(' ')
    const format = this.findValidTimeFormat(timeWithoutTz)

    if (!format) {
      this.moment = null
    } else if (format && utcOffset === null) {
      this.moment = moment(timeWithoutTz, format, true)
    } else { // format and utcOffset exists
      this.moment = moment(timeWithoutTz, format, true).utcOffset(utcOffset, true)
    }

    return {
      moment: this.moment,
      format,
      utcOffset,
      timezone,
      datetime: timeWithoutTz
    }
  }

  parseTimezone (tzPart = '') {
    tzPart = tzPart.trim()
    if (tzPart === '') {
      return null
    }

    if (this.isHere(tzPart)) {
      return moment().utcOffset()
    }

    const tzOffset = this.convertTimezoneOffset(tzPart)
    if (tzOffset !== null) {
      return tzOffset
    }

    const tzName = this.findValidTimezoneName(tzPart)
    if (tzName) {
      return moment().tz(tzName).utcOffset()
    }

    return null
  }

  convertTimezoneOffset (tz) {
    if (!tz.startsWith('+') && !tz.startsWith('-')) {
      return null
    }

    const numberParts = tz.split(':').map((num) => isNaN(num) ? null : parseInt(num, 10))
    const nonNumbers = numberParts.some((num) => num === null)
    if (nonNumbers) {
      return null
    }

    const tzMajor = numberParts[0]
    const magnitude = tzMajor < 0 ? -1 : 1
    return tzMajor * 60 + magnitude * (numberParts[1] || 0)
  }

  findValidTimezoneName (tz = '') {
    if (tz.length === 3 && window.TimeConvert && window.TimeConvert.airport_timezones) {
      const airportTz = window.TimeConvert.airport_timezones[tz.toUpperCase()]
      if (airportTz) {
        return airportTz
      }
    }

    return moment.tz.names().find((name) => {
      return name.split('/').pop().replace('_', ' ').toLowerCase() === tz.toLowerCase()
    })
  }

  findValidTimeFormat (time) {
    return window.TimeConvert.formats.find((mformat) => moment(time, mformat, true).isValid())
  }
}
