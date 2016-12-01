'use strict';

angular.module('mean.events').controller('EventController', ['$scope', '$stateParams', 'Global', 'Events', '$state', function ($scope, $stateParams, Global, Events, $state) {
    $scope.global = Global;

    $scope.create = function() {
        var event = new Events({
            Event_date: this.Event_date,
            Event_notes: this.Event_notes
        });
        event.$save(function(response) {
            //$state.go('viewCompany',{Company_name : responseid});
            $state.go('viewEvent',{id : response.id});
        });

        this.Event_date = "";
        this.Event_notes = "";
    };

    $scope.remove = function(event) {
        console.log("removeevent was called");
        console.log($scope.event);

        if (event) {
            console.log("THERE WAS AN EVENT");
            event.$remove();  

            for (var i in $scope.events) {
                if ($scope.events[i] === event) {
                    console.log("that thing happened");
                    $scope.events.splice(i, 1);
                }
            }
        }
        else {
            console.log("hello event else");
            $scope.event.$remove();
            $state.go('events');
        }
    };

    $scope.update = function() {
        var event = $scope.event;
        console.log("$scope.event");
        console.log($scope.event);
        if (!event.updated) {
            console.log("event didn't updated");
            event.updated = [];
        }
        event.updated.push(new Date().getTime());
        event.$update(function() {
        $state.go('viewEvent',{id : event.id});

        });
    };

    $scope.findOne = function() {
        console.log("findOneEvent ran");
        console.log("$stateParams.id=");
        console.log($stateParams.id);
        Events.get({
            id: $stateParams.id 
        }, function(event) {
            console.log(event);
            $scope.event = event;
        });
    };

    
    $scope.find = function() {
        Events.query(function(events) {
            console.log("findeventfindevent");
            $scope.events = events;
            console.log(events);
        });
    };



}]);