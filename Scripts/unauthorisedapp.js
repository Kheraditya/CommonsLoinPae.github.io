'use strict';
// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
    'mdo-angular-cryptography'
    // 'toaster',
]);

myApp.config(['$httpProvider', '$locationProvider', '$qProvider', function($httpProvider, $locationProvider, $qProvider) {
    if (window.history && window.history.pushState) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false,
            rewriteLinks: false
        });
    } else {
        $locationProvider.html5Mode(false);
    }

    $qProvider.errorOnUnhandledRejections(false);
}]);

myApp.config(function($cryptoProvider) {
    $cryptoProvider.setCryptographyKey('123456');
});

myApp.factory('userServices', ['$http', function($http) {
    var factoryDefinitions = {
        PostService: function(loginReq, servicepath) {
            return $http.post(servicepath, loginReq).then(function(data) { return data; });
        },
        GetService: function(servicepath) {
            return $http.get(servicepath).then(function(data) { return data; });
        },
        Commonservice: function(servicepath) {
            return $http.get(servicepath).then(function(data) { return data; });
        },
        PutService: function(servicepath) {
            return $http.put(servicepath).then(function(data) { return data; });
        },
        PutServicewithparameter: function(parameter, servicepath) {
            return $http.put(servicepath, parameter).then(function(data) { return data; });
        },
        PostServicewithoutparameter: function(servicepath) {
            return $http.post(servicepath).then(function(data) { return data; });
        }
    };
    return factoryDefinitions;
}]);




myApp.directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});


myApp.directive('regexValidate', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            var flags = attr.regexValidateFlags || '';
            var regex = new RegExp(attr.regexValidate, flags);
            ctrl.$parsers.unshift(function(value) {
                var valid = regex.test(value);
                ctrl.$setValidity('regexValidate', valid);
                return valid ? value : undefined;
            });
            ctrl.$formatters.unshift(function(value) {
                ctrl.$setValidity('regexValidate', regex.test(value));
                return value;
            });
        }
    };
});


myApp.directive('restrictInput', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                var options = scope.$eval(attr.restrictInput);
                if (!options.regex && options.type) {
                    switch (options.type) {
                        case 'digitsOnly':
                            options.regex = '^[0-9]*$';
                            break;
                        case 'lettersOnly':
                            options.regex = '^[a-zA-Z]*$';
                            break;
                        case 'lowercaseLettersOnly':
                            options.regex = '^[a-z]*$';
                            break;
                        case 'uppercaseLettersOnly':
                            options.regex = '^[A-Z]*$';
                            break;
                        case 'lettersAndDigitsOnly':
                            options.regex = '^[a-zA-Z0-9]*$';
                            break;
                        case 'validPhoneCharsOnly':
                            options.regex = '^[0-9 ()/-]*$';
                            break;
                        default:
                            options.regex = '';
                    }
                }
                var reg = new RegExp(options.regex);
                if (reg.test(viewValue)) { //if valid view value, return it
                    return viewValue;
                } else { //if not valid view value, use the model value (or empty string if that's also invalid)
                    var overrideValue = (reg.test(ctrl.$modelValue) ? ctrl.$modelValue : '');
                    element.val(overrideValue);
                    return overrideValue;
                }
            });
        }
    };
});