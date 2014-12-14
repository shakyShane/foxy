##Foxy [![Build Status](https://travis-ci.org/shakyShane/foxy.svg?branch=master)](https://travis-ci.org/shakyShane/foxy)

Proxy with response moddin'

##Simple usage
```js
var foxy = require("foxy");

var proxy = foxy("http://localhost:3000").listen(8000);

// Now access the site through http://localhost:8000
```

Built-in middleware will re-write html on the fly to update any urls & there'll also be the option
for additional rules for the re-writing.

## Additional re-write rules

Let's say you want to change the text `Home Page` to be `Homepage Rocks`, you can do that easily by 
providing additional `rules`

```js
var foxy = require("foxy");

var config = {
    rules: [
        {
            match: /Home Page/g,
            fn: function () {
                return "Homepage Rocks"
            }
        }
    ]
};

var proxy = foxy("http://localhost:3000", config).listen(8000);
```

#TODO

- [ ] https


