/**
 * Created by Oleg Galaburda on 20.02.2015.
 */
//FIXME, try put insights instead of module.config into module.provider, all of these will be available in config state!
//FIXME directive component will use scope:{param:"=@"} parameter of directive to make all facade properties be availablre to upper level
//FIXME use prelink function with passed controller, if not possible create instance of facade with try{}catch and in case of error tell that facade must not require anything oncreation phase
//FIXME directive facade may have directiveArguments property with list of properties being exposed to upper level
(function (module) {
  function ApplicationController($scope, $timeout) {
    var application = this;
    application.label = "Hello world!";
    $scope.source1 = 'App Source #1';
    $scope.source2 = [1, 2, 3, 4, 5];
    $timeout(function (a) {
      $scope.source1 = '#2 SRC #2';
    }, 1500);
    $timeout(function (a) {
      $scope.source2 = [5, 4, 3, 2, 1];
    }, 2500);
  }

  module.controller('aw.Application', [
    '$scope',
    '$timeout',
    ApplicationController
  ]);
  module.config([
    'componentsProvider',
    function (componentsProvider) {
      componentsProvider.registerController(ApplicationController);
    }
  ]);
  module.directive('directive', function () {
    var property1 = 1,
      property2 = 2;
    var definition = {
      restrict: "AE",
      template: '<h1>Directive Enabled! {{$facade.property1}} {{$facade.property2}}</h1>',
      controller: [
        '$scope',
        '$timeout',
        function DirectiveController($scope, $timeout) {
          //FIXME $facade not needed, there are should be facade already with $scope.$$component
          $scope.$facade = {};
          Object.defineProperty($scope.$facade, "property1", {
            get: function () {
              console.log('GET: property1 =', property1);
              return property1;
            },
            set: function (value) {
              console.log('SET: property1 =', value);
              property1 = value;
            }
          });
          Object.defineProperty($scope.$facade, "property2", {
            get: function () {
              console.log('GET: property2 =', property2);
              return property2;
            },
            set: function (value) {
              console.log('SET: property2 =', value);
              property2 = value;
            }
          });
          $timeout(function (a) {
            $scope.$facade.property1 = '#1 TARGET #1';
          }, 2500);
        }
      ],
      link: function ($scope, $element, attrs) {
        console.log($scope);
        var $injector = angular.injector(['ng']),
          $parse = $injector.get('$parse'),
          $parentScope = definition.scope ? $scope.$parent : $scope;
        /**
         * @type {string[]}
         */
        var props = ["property1", "property2"];
        var target = $scope.$facade;
        var last = {};
        props.forEach(function (name) {
          var parentGet = $parse(attrs[name]);
          compare = parentGet.literal ? angular.equals : function (a, b) {
            return a === b || (a !== a && b !== b);
          };
          parentSet = parentGet.assign || function () {
            lastValue = target[name] = parentGet($parentScope);
          };
          lastValue = target[name] = parentGet($parentScope);
          var parentValueWatch = function parentValueWatch(parentValue) {
            console.log(arguments, parentValue, target[name]);
            if (!compare(parentValue, target[name])) {
              // we are out of sync and need to copy
              if (!compare(parentValue, lastValue)) {
                // parent changed and it has precedence
                target[name] = parentValue;
              } else {
                // if the parent can be assigned then do so
                parentSet($parentScope, parentValue = target[name]);
              }
            }
            return lastValue = parentValue;
          };
          parentValueWatch.$stateful = true;
          var unwatch = $parentScope.$watch($parse(attrs[name], parentValueWatch), null, parentGet.literal);
          $parentScope.$on('$destroy', unwatch);
        });
      },
      //FIXME Try postLink function with making attrs events + $$component watcher instead of scope {}
      scope: true
    }
    return definition;
  });
})(angular.module('aw.Application', ['aw.components']));