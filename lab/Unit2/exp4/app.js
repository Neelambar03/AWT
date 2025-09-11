angular.module('myApp', [])
  .controller('FormController', ['$scope', '$interval', function ($scope, $interval) {

    // Current time auto update
    $scope.currentTime = new Date();
    $interval(function () {
      $scope.currentTime = new Date();
    }, 1000);

    $scope.user = {};
    $scope.submitted = false;
    $scope.success = '';

    $scope.newRecord = {};
    $scope.records = [];

    // Load saved records
    const saved = localStorage.getItem('orderRecords');
    if (saved) {
      $scope.records = JSON.parse(saved);
    }

    $scope.register = function (form) {
      if (form.$valid) {
        $scope.success = 'Registration successful for ' + $scope.user.name;
        $scope.user = {};
        $scope.submitted = false;
        form.$setPristine();
        form.$setUntouched();
      } else {
        $scope.success = '';
        $scope.submitted = true;
      }
    };

    $scope.addRecord = function (form) {
      if (form.$valid) {

        // Check if Order Name (unique id) already exists
        const exists = $scope.records.some(r => r.name === $scope.newRecord.name);
        if (exists) {
          alert('Order Name must be unique! This name already exists.');
          return;
        }

        // Create order with name, amount, timestamp
        const record = {
          name: $scope.newRecord.name,
          amount: $scope.newRecord.amount,
          timestamp: new Date()
        };

        $scope.records.push(record);

        $scope.newRecord = {};
        form.$setPristine();
        form.$setUntouched();

        localStorage.setItem('orderRecords', JSON.stringify($scope.records));
      }
    };

    $scope.remove = function (record) {
      const idx = $scope.records.indexOf(record);
      if (idx !== -1) {
        $scope.records.splice(idx, 1);
        localStorage.setItem('orderRecords', JSON.stringify($scope.records));
      }
    };

    $scope.total = function () {
      return $scope.records.reduce((sum, r) => sum + Number(r.amount || 0), 0);
    };

    $scope.downloadRecords = function () {
      const dataStr = JSON.stringify($scope.records, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'order-records.json';
      a.click();

      URL.revokeObjectURL(url);
    };

  }]);
