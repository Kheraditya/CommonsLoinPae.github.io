'use strict';
angular.module('Login', []);

myApp.controller('LoginCtrl', ['$scope', 'userServices', '$window', '$rootScope', '$location', '$q', '$timeout', '$filter', '$crypto', '$http',
    function($scope, userServices, $window, $rootScope, $location, $q, $timeout, $filter, $crypto, $http) {



        $http.get("/html/inputfile/Logincred.json")
            .then(function(res) {
                $scope.user = res.data; // Throws error if not defined earlier
            });

        $scope.LoderShow = false;
        $scope.IsLogin = true;
        $scope.signup = {};
        $scope.login = {};

        $scope.ClickSignup = function() {
            $scope.IsLogin = false;
            $scope.signup.email = undefined;
            $scope.signup.mobileno = undefined;
            $scope.signup.password = undefined;
            $scope.login.mobileno = undefined;
            $scope.login.password = undefined;
        }

        $scope.ClickLogin = function() {
            $scope.IsLogin = true;
            $scope.signup.email = undefined;
            $scope.signup.mobileno = undefined;
            $scope.signup.password = undefined;
            $scope.login.mobileno = undefined;
            $scope.login.password = undefined;

        }


        $scope.SignupClick = function() {
            try {
                if ($scope.signup.email !== undefined && $scope.signup.email !== null && $scope.signup.email !== "" &&
                    $scope.signup.mobileno !== undefined && $scope.signup.mobileno !== null && $scope.signup.mobileno !== "" && $scope.signup.password !== undefined && $scope.signup.password !== null && $scope.signup.password !== "") {
                    $scope.signup.password = $crypto.encrypt($scope.signup.password);
                    let jsonfile = JSON.stringify($scope.signup);

                    let Data1 = $window.localStorage.getItem($scope.signup.mobileno);
                    if (Data1) {
                        let jsondata = JSON.parse(Data1);
                        if (jsondata.mobileno === $scope.signup.mobileno && $crypto.decrypt(jsondata.password) === $crypto.decrypt($scope.signup.password)) {
                            alert("User Already Exists! Please Login");
                            $scope.IsLogin = true;
                        }
                    } else {


                        $window.localStorage.setItem($scope.signup.mobileno, jsonfile);

                        alert("User signup successfully! Please Login ");
                        $scope.IsLogin = true;
                    }

                }
            } catch (e) {
                alert("Enter all required details!");
                //toaster.pop('error', "Something gose worng");
            }
        }

        $scope.LoginClick = function() {
            try {
                if ($scope.login.mobileno !== undefined && $scope.login.mobileno !== null && $scope.login.mobileno !== "" && $scope.login.password !== undefined && $scope.login.password !== null && $scope.login.password !== "") {
                    let Data = $window.localStorage.getItem($scope.login.mobileno);

                    if (Data) {
                        let jsondata = JSON.parse(Data);
                        if ($crypto.decrypt(jsondata.password) === $scope.login.password) {
                            $window.location.href = "/html/dashboard.html";
                        } else {
                            alert("Invalid Password!");
                        }
                    } else {
                        alert("Invalid User!");

                    }


                }
            } catch (e) {
                $scope.loadingSign = false;
                // toaster.pop('error', "Something gose worng");
            }
        }



    }
]);