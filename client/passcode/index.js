(function(angular){
    var module = angular.module('passcode', ['templates-main','ui.bootstrap','ui.router','restangular']);
    
    require("./config")(module);
    require("./run")(module);
    require("./factory")(module);
    require("./controllers")(module);
    require("./directives")(module);
})(window.angular);