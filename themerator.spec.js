/**
 * Unit tests for angularjs-themerator-service
 *
 * @author      https://github.com/mflorence99/mflorence99.github.io
 * @version     0.0.1
 */

describe("The themerator service converts #beef placeholder colors in the stylesheet", function() {

  // mocked services
  var document = [{}];

  // services under test
  var themerator;

  // test data
  var THEME0 = ["#010203", "#040506", "#070809", "#0a0b0c", "#0d0e0f"];
  var THEME1 = ["#111213", "#141516", "#171819", "#1a1b1c", "#1d1e1f"];

  beforeEach(function() {
    module("XXX");
    // mocked services
    module(function($provide) {
      $provide.value("$document", document);
    });
    // service under test
    inject(function($injector) {
      themerator = $injector.get("angularjs-themerator-service");
    });
  });

  it("represented as #rrggbb in hex", function() {
    document[0].styleSheets = [{
      href: "all.css",
      rules: [
        { style: { cssText: "color: #beef13" } }
      ]
    }];
    themerator(THEME0, THEME1);
    expect(document[0].styleSheets[0].rules[0].style.cssText).toEqual("color: #171819");
  });

  it("represented as rgb(rrr, ggg, bbb) in decimal", function() {
    document[0].styleSheets = [{
      href: "all.css",
      rules: [
        { style: { cssText: "color: rgb(190, 239, 19)" } }
      ]
    }];
    themerator(THEME0, THEME1);
    expect(document[0].styleSheets[0].rules[0].style.cssText).toEqual("color: #171819");
  });

  it("represented as rgba(rrr, ggg, bbb, aaa) in decimal", function() {
    document[0].styleSheets = [{
      href: "all.css",
      rules: [
        { style: { cssText: "color: rgba(190, 239, 19, 128)" } }
      ]
    }];
    themerator(THEME0, THEME1);
    expect(document[0].styleSheets[0].rules[0].style.cssText).toEqual("color: rgba(1, 2, 39, 128)");
  });

});
