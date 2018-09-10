# Timezones Converter

Convert any human-friendly timestamp with timezone to another timezone 

Formats:
* Date and time 
* Unix timestamp 
* 3-letter IANA airport code

<https://time.commons.host>

## Development
Run a local server:
```
python -m SimpleHTTPServer 2000
```
Open browser to <http://localhost:2000>

## Tests
Start server and open browser to <http://localhost:2000/tests>   
Open developer tools and verify that there are no errors in the console.

## Deploy
commonshost deploy

## Datasets
* Airports to timezones: https://openflights.org/data.html
