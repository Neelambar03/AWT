// Define the AngularJS app
var app = angular.module('todoApp', []);

app.controller('TodoController', function($scope) {
    $scope.tasks = [];

    // Add a new task
    $scope.addTask = function() {
        if ($scope.newTask && $scope.newTask.trim() !== '') {
            $scope.tasks.push({ text: $scope.newTask, done: false });
            $scope.newTask = '';
        }
    };

    // Toggle task completion
    $scope.toggleDone = function(task) {
        task.done = !task.done;
    };

    // Delete a task
    $scope.deleteTask = function(index) {
        $scope.tasks.splice(index, 1);
    };
});
