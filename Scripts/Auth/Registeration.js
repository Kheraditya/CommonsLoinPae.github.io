'use strict';
angular.module('StudentRegi', []);

myApp.controller('StudentRegiCtrl', ['$scope', 'userServices', '$window', '$rootScope', '$location', '$q', '$timeout', '$filter', 'toaster',
    function ($scope, userServices, $window, $rootScope, $location, $q, $timeout, $filter, toaster) {
        $scope.LoderShow = false;
        $scope.Student = {};
        $scope.masterData = [{ "label": "Yes", "id": 1 }, { "label": "No", "id": 0 }];
        $scope.AddressTypeData = [{ "label": "PERMANENT", "id": "PERMANENT" }, { "label": "CORRESPONDENCE", "id": "CORRESPONDENCE" }];
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        $scope.Student.IsHostelNeeded = 0;
        $scope.Student.IsHandicapped = 0;
        $scope.Student.ChildWithSpecialNeed = 0;
        $scope.Student.IsTransportNeeded = 0;
        $scope.Student.IsLibraryNeeded = 0;
        $scope.address = [];

        $scope.GetAllLookup = function () {
            try {
                $scope.LoderShow = true;
                var countryserviceName = $rootScope.Masterservicepath + "GetAllLookup?CustomerID=1&LookupType=All"; //Get?staffId=10
                userServices.GetService(countryserviceName).then(function (result) {
                    if (result.data) {
                        $scope.GetAllLookupList = result.data.Data;
                        $scope.LoderShow = false;

                    }
                    else {
                        $scope.LoderShow = false;
                        toaster.pop('warning', "No data Found!");
                    }
                }).catch(function (e) {
                    console.log(e);
                    $scope.LoderShow = false;
                    toaster.pop('warning', "Something goes wrong!");
                });
            }
            catch (e) {
                $scope.LoderShow = false;
                toaster.pop('warning', "Something goes wrong!");
            }
        };

        $scope.GetAllLookup();

        $scope.AddStudentAddress = function () {
            $scope.address = [];
            $scope.address.push($scope.studentAddressModel);
        }

        $scope.DOBInWords = function (date_str) {
            let temp_date = date_str.split("-");
            var a = parseInt(temp_date[2].charAt(0) + temp_date[2].charAt(1));
            var b = parseInt(temp_date[2].charAt(2) + temp_date[2].charAt(3));
            $scope.Student.DoBInWord = (numberToEnglish(temp_date[0]) + " " + months[Number(temp_date[1]) - 1] + " " + numberToEnglish(a) + " " + numberToEnglish(b)); //.toUpperCase()
        }

        $scope.StudentRagisteration = function () {
            try {
                if ($scope.Student.FirstName !== undefined && $scope.Student.FirstName !== null && $scope.Student.FirstName !== ""
                ) {
                    $scope.LoderShow = true;
                    $scope.Student["studentAddressModel"] = $scope.address;
                    $scope.Student["CustomerID"] = 1;
                    $scope.Student["ID"] = 0;
                    $scope.Student["BranchId"] = 0;
                    $scope.Student["RegistrationNo"] = 1;
                    $scope.Student.studentAddressModel[0]["ID"] = 0;
                    $scope.Student.studentAddressModel[0]["IsDefault"] = 1;
                    $scope.Student.studentParentsModel["ID"] = 0;
                    $scope.Student.studentPreviousSchoolModel["ID"] = 0;
                    let servicepath = $rootScope.Masterservicepath + "student/AddStudentRegistration";
                    userServices.PostService(JSON.stringify($scope.Student), servicepath).then(function (result) {
                        if (result.data.Status) {
                            window.location = "~/ThankYou"
                            $scope.LoderShow = false;
                        }
                        else {
                            $scope.LoderShow = false;
                            toaster.pop('warning', "Something goes wrong!");
                        }
                    }).catch(function (e) {
                        console.log(e);
                        $scope.LoderShow = false;
                        toaster.pop('warning', "Something goes wrong!");
                    });
                }
                else {
                    $scope.LoderShow = false;
                    toaster.pop('warning', "Please fill all the details!");
                }
            }
            catch (e) {
                $scope.LoderShow = false;
                toaster.pop('warning', "Something goes wrong!");
            }
        };

        function numberToEnglish(n) {

            var string = n.toString(), units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words, and = '';

            /* Remove spaces and commas */
            string = string.replace(/[, ]/g, "");

            /* Is number zero? */
            if (parseInt(string) === 0) {
                return 'zero';
            }

            /* Array of units as words */
            units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

            /* Array of tens as words */
            tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

            /* Array of scales as words */
            scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion', 'Sextillion', 'Septillion', 'Octillion', 'Nonillion', 'Decillion', 'Undecillion', 'Duodecillion', 'Tredecillion', 'Ruatttuor-Decillion', 'Ruindecillion', 'Sexdecillion', 'Septen-Decillion', 'Octodecillion', 'Novemdecillion', 'Vigintillion', 'Centillion'];

            /* Split user argument into 3 digit chunks from right to left */
            start = string.length;
            chunks = [];
            while (start > 0) {
                end = start;
                chunks.push(string.slice((start = Math.max(0, start - 3)), end));
            }

            /* Check if function has enough scale words to be able to stringify the user argument */
            chunksLen = chunks.length;
            if (chunksLen > scales.length) {
                return '';
            }

            /* Stringify each integer in each chunk */
            words = [];
            for (i = 0; i < chunksLen; i++) {

                chunk = parseInt(chunks[i]);

                if (chunk) {

                    /* Split chunk into array of individual integers */
                    ints = chunks[i].split('').reverse().map(parseFloat);

                    /* If tens integer is 1, i.e. 10, then add 10 to units integer */
                    if (ints[1] === 1) {
                        ints[0] += 10;
                    }

                    /* Add scale word if chunk is not zero and array item exists */
                    if ((word = scales[i])) {
                        words.push(word);
                    }

                    /* Add unit word if array item exists */
                    if ((word = units[ints[0]])) {
                        words.push(word);
                    }

                    /* Add tens word if array item exists */
                    if ((word = tens[ints[1]])) {
                        words.push(word);
                    }

                    /* Add 'and' string after units or tens integer if: */
                    if (ints[0] || ints[1]) {

                        /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
                        if (ints[2] || !i && chunksLen) {
                            words.push(and);
                        }

                    }

                    /* Add hundreds word if array item exists */
                    if ((word = units[ints[2]])) {
                        words.push(word + ' Hundred');
                    }

                }

            }

            return words.reverse().join(' ');

        }
    }]);