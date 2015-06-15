/**
 *
 * @package     angularjs-themerator-service
 * @version     0.0.0
 * @copyright   Copyright (c) 2015 - All rights reserved.
 * @license     MIT License
 * @author      Mark Florence <mflo999@gmail.com>
 * @link        https://github.com/mflorence99/mflorence99.github.io
 *
 */

angular.module("XXX").service("angularjs-themerator-service",
  ["$document",
   function($document) {

  var THEME0BEEF = ["#beef01", "#beef02", "#beef03", "#beef04", "#beef05"];
  var THEME1BEEF = ["#beef11", "#beef12", "#beef13", "#beef14", "#beef15"];

  // private functions

  var hexToRGB = _.memoize(function(hex) {
    return "rgb(" + parseInt(hex.substring(1, 3), 16) + ", " +
                    parseInt(hex.substring(3, 5), 16) + ", " +
                    parseInt(hex.substring(5, 7), 16) + ")";
  });

  var hexToRGBa = _.memoize(function(hex) {
    return "rgba(" + parseInt(hex.substring(1, 3), 16) + ", " +
                     parseInt(hex.substring(3, 5), 16) + ", " +
                     parseInt(hex.substring(5, 7), 16);
  });

  function munge(rule, themes, beefs) {
    var css = rule.style.cssText;
    var dirty = false;
    _.forEach(themes, function(theme, i) {
      var beef = beefs[i];
      // try raw #beef colors first
      while (css.indexOf(beef) !== -1) {
        css = css.replace(beef, theme);
        dirty = true;
      }
      // now see if they're coded in rgb form
      // NOTE: you'd think we should use a regex and you'd be right but regex is 10x slower
      // -- too slow to be viable -- and all tested browsers resolve to this form internally
      var rgb = hexToRGB(beef);
      while (css.indexOf(rgb) !== -1) {
        css = css.replace(rgb, theme);
        dirty = true;
      }
      // smoke test to see if there are any rgba encodings as this is much more rare
      // NOTE: we encode and search for only the r, g, b as we can keep the alpha constant
      if (css.indexOf("rgba(") !== -1) {
        var rgba = hexToRGBa(beef);
        var repl = hexToRGBa(theme);
        while (css.indexOf(rgba) !== -1) {
          css = css.replace(rgba, repl);
          dirty = true;
        }
      }
    });
    // all that trouble because get/set cssText is expensive!
    if (dirty)
      rule.style.cssText = css;
  }

  function processRules(rules, themes, beefs) {
    _.forEach(rules, function(rule) {
      if (rule.style && rule.style.cssText)
        munge(rule, themes, beefs);
      processRules(rule.cssRules || rule.rules, themes, beefs);
    });
  }

  function processSheets(THEME0, THEME1) {
    var themes = THEME0.concat(THEME1);
    var beefs = THEME0BEEF.concat(THEME1BEEF);
    _.forEach($document[0].styleSheets, function(styleSheet) {
      if (styleSheet.href && (styleSheet.href.indexOf("all.css") !== -1))
        processRules(styleSheet.cssRules || styleSheet.rules, themes, beefs);
    });
  }

  // the service

  return processSheets;

}]);
