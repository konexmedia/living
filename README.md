# living

Observes if web services are still alive.

## Installation

Install with [npm](https://npmjs.org/package/living).

    npm install -g living

## Usage

Create a configuration file in which you define the web services you want to observe (e.g. `services.json`).

```json
[{
    "name": "Search Engine",
    "uri": "http://google.de",
    "interval": 2000
}, {
    "name": "Staging Website",
    "uri": "https://website1.staging.konexmedia.com",
    "interval": 5000
}]
```

After that, run `living`

    living services.json

## Author

Copyright 2014, [konexmedia](http://konexmedia.com) - info@konexmedia.com