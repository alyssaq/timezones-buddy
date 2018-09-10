const tests = [
  function timezoneOffset () {
    const parser = new TimeParser()
    const data = [
      {input: '', expected: null},
      {input: '+2', expected: 120},
      {input: '-2', expected: -120},
      {input: '9pm', expected: null},
      {input: '-8:45', expected: -525},
      {input: '9:30', expected: null},
      {input: '-0:00', expected: 0},
      {input: '+6p', expected: null}
    ]

    data.forEach((t) => {
      const offset = parser.convertTimezoneOffset(t.input)
      if (offset !== t.expected) {
        throw `Unexpected output: ${offset}. Expected: ${t.expected}`
      }
    })
  },

  function findValidTimezoneName () {
    const parser = new TimeParser()
    const data = [
      {input: '', expected: undefined},
      {input: 'unknown', expected: undefined},
      {input: 'sydney', expected: 'Australia/Sydney'},
      {input: 'El Salvador', expected: 'America/El_Salvador'},
      {input: 'PST', expected: 'PST'},
      {input: 'utc', expected: 'Etc/UTC'},
      {input: 'frankfurt', expected: 'Frankfurt'},
      {input: 'india', expected: 'India'}
    ]

    data.forEach((t) => {
      const name = parser.findValidTimezoneName(t.input)
      if (name !== t.expected) {
        throw `Unexpected output: ${name}. Expected: ${t.expected}`
      }
    })
  },

  function parseTimezone () {
    const parser = new TimeParser()
    const data = [
      {input: '', expected: null},
      {input: 'imaginary', expected: null},
      {input: '+3', expected: 180},
      {input: 'SGT', expected: 480},
      {input: '-2:30:1', expected: -150},
      {input: 'here', expected: moment().utcOffset()},
      {input: 'berlin', expected: 120},
      {input: 'utc', expected: 0},
      {input: '-0', expected: 0}
    ]

    data.forEach((t) => {
      const tz = parser.parseTimezone(t.input)
      if (tz !== t.expected) {
        throw `Unexpected output: ${tz}. Expected: ${t.expected}`
      }
    })
  },

  function findValidTimeFormat () {
    const parser = new TimeParser()
    const data = [
      {input: '10 Jan 2016 5pm', expected: 'D MMM YYYY hA'},
      {input: '28 feb 13:13', expected: 'D MMM HH:mm'},
      {input: '2017-09-21', expected: 'YYYY-MM-DD'},
      {input: 'Jun 18', expected: 'MMM D'},
      {input: '6:15am', expected: 'h:mmA'},
    ]

    data.forEach((t) => {
      const name = parser.findValidTimeFormat(t.input)

      if (name !== t.expected) {
        throw `Unexpected output: ${name}. Expected: ${t.expected}`
      }
    })
  },

  function parse () {
    const data = [
      {input: 'now', expectedFormat: undefined},
      {input: '3pm +3', expectedFormat: 'hA', expectedOffset: 180},
      {input: '10 Jan 2016 5pm', expectedFormat:'D MMM YYYY hA'},
      {input: '12 Feb 2015 6:45am', expectedFormat: 'D MMM YYYY h:mmA'},
      {input: '12 Mar 2015 20:41', expectedFormat: 'D MMM YYYY HH:mm'},
      {input: '11 Apr 9pm', expectedFormat: 'D MMM hA'},
      {input: '10 May 08:45pm SGT', expectedFormat: 'D MMM h:mmA', expectedOffset: 480},
      {input: '02 Jun 18:41', expectedFormat: 'D MMM HH:mm'},
      {input: '3 Jul denver', expectedFormat: 'D MMM', expectedOffset: -360},
      {input: '2017-04-02', expectedFormat: 'YYYY-MM-DD'},
      {input: '6:15pm utc', expectedFormat: 'h:mmA', expectedOffset: 0},
      {input: '5pm -2', expectedFormat: 'hA', expectedOffset: -120},
      {input: '1497770000', expectedFormat: 'X'},
      {input: '28 feb 13:13 london', expectedFormat: 'D MMM HH:mm', expectedOffset: 60},
      {input: '2018-03-11 5:14:12pm -6:30', expectedFormat: 'YYYY-MM-DD h:mm:ssA', expectedOffset: -390}
    ]

    data.forEach((t) => {
      const parser = new TimeParser(t.input)
      const obj = parser.parse()

      if (obj.format !== t.expectedFormat) {
        throw `Input ${t.input}. Unexpected output: ${obj.moment.format(obj.format)} with format ${obj.format}. Expected format: ${t.expectedFormat}`
      }
      if (t.expectedOffset !== undefined && obj.moment.utcOffset() !== t.expectedOffset) {
        throw `Unexpected offset: ${obj.moment.utcOffset()}. Expected: ${t.expectedOffset}`
      }
    })
  }
]

tests.forEach((test) => {
  test()
})

