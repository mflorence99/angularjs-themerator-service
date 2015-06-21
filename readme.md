# ```angularjs-themerator-service``` An Approach to Pure Client-Side CSS Theming

## Motivation

This project is not intended to be used as-is, but rather as a suggested implementation to be tweaked
to taste. The idea is to efficiently apply theme colors to a Web application's stylesheets at run-time and
purely using client-side code.

The latter point is important. Of course, it is trivial to solve this problem server-side: simply 
generate the CSS file(s) through some kind of server-side templating framework like JSP and inject theme colors
there. But we wish our Web application to be completely static and bound at build time such that it can be
deployed through a CDN.

Of course, if we can customize colors we can customize arbitrary CSS values. 


## Typical Use Case

The classic use case from which all others can be extrapolated is of a generic application whose look
and feel can be customized by individual user or perhaps entire client. Typically, some interface in a
setup or admin component allows users to select theme colors. In a purely static client-side application
that theme, along with additional user data, is provided in a RESTful Web service as the user authenticates.

In applications where the theme is associated with an entire client, the client is usually identifiable 
or inferrable from the launch URI. For example:

```
  mycompany.superblog.com
```

In this case, the Web application will retrieve client information (including theme) from ```mycompany```
via a RESTful service at startup.

Of course, ```angularjs-themerator-service``` is agnostic about what method is actually used and picks
up only when the theme is known.


## Stylesheet Construction: Where's the Beef?

```angularjs-themerator-service``` works by recognizing placeholder colors in stylesheets and replacing
them with actual theme colors. However, it is not possible to insert a non-color into CSS and for the
CSS to be syntactically correct. This is especially important when preprocessors like LESS or SASS are used.

Instead, I chose "unlikely" RGB hex combinations. Exactly how unlikely they are is a judgment call that
will differ for each application. There are a number of "cute" pseudo-words that can be spelt in hex, 
and I chose "beef" as the seed to the placeholders used by ```angularjs-themerator-service```.

```angularjs-themerator-service``` as illustrated here supports a primary and a secondary theme, with 5
variants for each. Of course, it would be simple to expand this model. 

So you might create a ```globals.less``` file which in part looks like this:

```CSS
  /*------------------------------------------------------------------------
    NOTE: these colors are placeholders and will be replaced in the current
    stylesheet(s) by the angularjs-themerator-service when called. Use these
    symbols in LESS files more or less freely -- but they CANNOT be used in
    functions like lighten or darken for obvious reasons.
  
    DD means 20% darker
    D  means 10% darker
    L  means 10% lighter
    LL means 20% lighter
    ------------------------------------------------------------------------*/
  
  @THEME0_DD : #beef01;
  @THEME0_D  : #beef02;
  @THEME0    : #beef03;
  @THEME0_L  : #beef04;
  @THEME0_LL : #beef05;
  
  @THEME1_DD : #beef11;
  @THEME1_D  : #beef12;
  @THEME1    : #beef13;
  @THEME1_L  : #beef14;
  @THEME1_LL : #beef15;
```

Now you can use the placeholders as colors:

```CSS
  i {
    color: @THEME0;
  }

  svg {
    fill: @THEME1;
  }
```

Preprocessor functions like ```darken()``` or ```lighten()``` can't be used, however, as they
will change the RGB value of the placeholder. But alpha-channel functions can be used, as 
```angularjs-themerator-service``` will recognize RGBa colors.

```CSS
  .box {
    background-color: fadeout(@THEME1, 50%);
  }
```

Of course, the significance of the theme colors and their variants is totally dependent on
the application and the above is just a suggestion.


## How to Use ```angularjs-themerator-service```

Calling ```angularjs-themerator-service``` to theme your stylesheets is trivial:

```javascript
  angular.module("XXX").controller("YYY", 
    [..., "angularjs-themerator-service", ...,
     function(..., themerator, ...) {
    ...
    // once theme colors are known 
    themerator(theme0 /* string[] */, theme1 /* string[] */);
    ...
  }]);
```


## Performance

I optimized ```angularjs-themerator-service``` to get the best performance I could. Tests using
```console.profile()``` consistently show about 40ms to process about 10,000 CSS rules. Key to the
optimization:

  * Use of the lodash (or Underscore) ```_.memoize()``` function
  * Getting and setting a CSS rule in the DOM is very expensive and the code avoids doing so
  as much as possible
  * Regular expressions - while more correct here -- are prohibitively expensive
  
The code in ```themerator.js``` is short and easy to read and gives a few more clues.


## A Note on Coupling

A quick look at the ```themerator.js``` code shows that the placeholder ```#beefNN``` colors are 
 enumerated essentially as ```const```s yet at the same time your stylesheet is expected to define
the exact same constants. No DRY support is provided. I did this deliberately to keep the code
as simple as possible. If anyone else ever uses it, you will want to tweak it in many possible
directions and any DRY support would just get in the way.