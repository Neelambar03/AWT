var app = angular.module('myApp', []);

app.controller('FormController', ['$scope', '$interval', function($scope, $interval) {

  // Initialize user data
  $scope.user = {};
  $scope.success = '';
  $scope.submitted = false;

  // Show current time, update every second
  $scope.currentTime = new Date();
  $interval(function() {
    $scope.currentTime = new Date();
  }, 1000);

  // Register function
  $scope.register = function(form) {
    $scope.submitted = true;
    if (form.$valid) {
      $scope.success = "Thanks for registering, " + $scope.user.name + "!";
      $scope.submitted = false;
      $scope.user = {};
      form.$setPristine();
      form.$setUntouched();
    }
  };

  // Orders list and new order model
  $scope.records = [];
  $scope.newRecord = { name: '', quantity: null, amount: null };

  // Add a new order record
  $scope.addRecord = function(form) {
    if (form.$valid) {
      // Check for unique order name
      var exists = $scope.records.some(function(order) {
        return order.name === $scope.newRecord.name;
      });
      if (exists) {
        alert("Order name must be unique! Please choose another.");
        return;
      }

      // Add the order with timestamp
      var newOrder = {
        name: $scope.newRecord.name,
        quantity: $scope.newRecord.quantity,
        amount: $scope.newRecord.amount,
        timestamp: new Date()
      };

      $scope.records.push(newOrder);

      // Clear form
      $scope.newRecord = { name: '', quantity: null, amount: null };
      form.$setPristine();
      form.$setUntouched();
    }
  };

  // Remove an order record
  $scope.remove = function(order) {
    var index = $scope.records.indexOf(order);
    if (index !== -1) {
      $scope.records.splice(index, 1);
    }
  };

  // Total quantity
  $scope.totalQuantity = function() {
    var total = 0;
    $scope.records.forEach(function(order) {
      total += order.quantity;
    });
    return total;
  };

  // Total amount (quantity * amount)
  $scope.totalAmount = function() {
    var total = 0;
    $scope.records.forEach(function(order) {
      total += order.quantity * order.amount;
    });
    return total;
  };

  // Download PDF
  $scope.downloadPDF = function() {
    var element = document.getElementById('ordersTable');
    html2canvas(element).then(function(canvas) {
      var imgData = canvas.toDataURL('image/png');

      const { jsPDF } = window.jspdf;
      var pdf = new jsPDF('p', 'pt', 'a4');

      var imgWidth = 550;
      var pageHeight = 780;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var position = 20;

      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
      pdf.save('orders.pdf');
    });
  };

  // Download JSON
  $scope.downloadJSON = function() {
    if ($scope.records.length === 0) {
      alert("No records to download!");
      return;
    }

    var dataStr = JSON.stringify($scope.records, null, 2);
    var blob = new Blob([dataStr], { type: "application/json" });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.href = url;
    a.download = "orders.json";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

}]);
