angular
.module('passcode', ['templates-main','ui.bootstrap','ui.router','restangular'])
.config(function(RestangularProvider) {
  RestangularProvider.setBaseUrl('/api');
  //RestangularProvider.setRequestSuffix('.json');
})
.config(['$httpProvider','$stateProvider', '$urlRouterProvider','$locationProvider', function($httpProvider,$stateProvider, $urlRouterProvider,$locationProvider) {
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
/*$httpProvider.defaults.headers.common = {
    "X-Requested-With":'XMLHttpRequest'
};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};*/

    $locationProvider.hashPrefix('!');
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  

  //
  // Now set up the states
  $stateProvider
    .state('index', {
      url: "/?confirmSent",
      templateUrl: "index.html",
      controller:function($scope,$stateParams,modal,$http,$modal,Events){
        
        if($stateParams.confirmSent){
            modal.confirmEmail($stateParams.confirmSent);
        }
        
        $scope.events = Events.getList().$object;
        
        
      }
    })
    .state("login", {
        url: "/login?redirect&needToLogin",
        templateUrl:"login.html",
        controller:'LoginCtrl',
        beforeFilter:'guest'
    })
    .state("signup", {
        url: "/signup",
        templateUrl:"signup.html",
        beforeFilter:'guest'
    })
    .state('events', {
      url: "/events?confirmed",
      templateUrl: "events.html",

      controller:function($scope,$stateParams,modal,$http,$modal,Events){
        
        if($stateParams.confirmed){
            modal.open('confirmed');
        }
        
        $scope.events = Events.getList().$object;
        
        
      }
    })
    .state("events:view", {
        url: "/events/:eventId",
        templateUrl:'events/view.html',
        resolve:{
            event:function(Events,$stateParams){
                return Events.one($stateParams.eventId).get();
            }
        },
        controller:'ViewEventController'
    })
    .state('my-tickets', {
      url: "/my-tickets",
      templateUrl: "my-tickets.html",
      resolve:{
          tickets:function(Tickets){
              return Tickets().getList();
          }
      },
      controller:'MyTicketsController',
      beforeFilter:'auth'
    })
    .state("my-tickets:view", {
        url: "/my-tickets/:ticketToken",
        templateUrl: "my-tickets/view.html",
        controller: 'MyTicketsViewController',
        beforeFilter:'auth',
        resolve:{
            ticket:function(Tickets,$stateParams){
                return Tickets().one($stateParams.ticketToken).get();
            }
        }
    })
    .state("error", {
        url: "/error?msg",
        templateUrl: "error.html",
        controller: function($scope,$stateParams){
            $scope.msg = $stateParams.msg;
        }
    })
    /*.state("admin/event-key", {
        url: "/admin/event-key?redirect&needEventKey",
        templateUrl: "admin/event-key.html",
        beforeFilter:"auth|admin",
        controller: function($scope,$stateParams,AdminSession,$location){
            $scope.needEventKey = $stateParams.needEventKey;
            $scope.data = {
                eventKey:AdminSession['event-key']
            };
            $scope.submit = function(form){
                $scope.saved = false;
                $scope.error = false;
                form.$submitted = true;
                if(form.$valid){
                   
                    $scope.saving = true;
                    AdminSession.set('event-key',$scope.data.eventKey).then(function(){
                        $scope.saved = true;
                        if($stateParams.redirect){
                            $location.url($stateParams.redirect);
                        }
                    },function(){
                        $scope.error = true;
                    });
                   
                    
                }
            }
        }
    })*/
    .state("admin/select-event", {
        url: "/admin/select-event?redirect&needEventKey",
        templateUrl: "admin/select-event.html",
        beforeFilter:"auth|admin",
        resolve:{
            events:function(Restangular){
                 return Restangular.all('admin/events').getList();
            }
        },
        controller: function($scope,$stateParams,AdminSession,$location,events){
            $scope.needEventKey = $stateParams.needEventKey;
            
            $scope.events = events;
            $scope.currentEventKey = AdminSession['event-key'];
            
            $scope.selectEvent = function(eventKey){
                $scope.saved = false;
                $scope.error = false;
                
                if(eventKey){
                    $scope.saving = true;
                    AdminSession.set('event-key',eventKey).then(function(){
                        $scope.saved = true;
                        $scope.saving = false;
                        $scope.currentEventKey = eventKey;
                        if($stateParams.redirect){
                            $location.url($stateParams.redirect);
                        }
                    },function(response){
                        $scope.saving = false;
                        $scope.error = response.data.error;
                    });
                }
                else{
                    $scope.error = {
                        message:"Event has no key."
                    };
                }
            };
            
            //console.log(events);
            /*$scope.data = {
                eventKey:AdminSession['event-key']
            };
            $scope.submit = function(form){
                $scope.saved = false;
                $scope.error = false;
                form.$submitted = true;
                if(form.$valid){
                   
                    $scope.saving = true;
                    AdminSession.set('event-key',$scope.data.eventKey).then(function(){
                        $scope.saved = true;
                        if($stateParams.redirect){
                            $location.url($stateParams.redirect);
                        }
                    },function(){
                        $scope.error = true;
                    });
                   
                    
                }
            }*/
        }
    })
    .state("admin/use-ticket", {
        url: "/admin/use-ticket/:ticketToken",
        templateUrl: "admin/use-ticket.html",
        beforeFilter:"auth|admin|eventKey",
        controller: function(AdminSession,$stateParams,Restangular,$scope,$state){
            
            $scope.error = false;
            $scope.success = false;
            
            $scope.changeEvent = function(){
                var redirect = $state.href($state.current.name,$stateParams).replace('#!','');
   
                $state.go('admin/select-event',{
                    redirect:redirect
                });
            };
            
            Restangular.one('tickets',$stateParams.ticketToken).customPUT({
                used:true,
                eventKey:AdminSession['event-key']
            })
            .then(function(){
               $scope.success = true;
            },function(response){
                $scope.error = response.data.error;
            });
        }
    })

}])
.factory('stateFilters',function($state,Auth,AdminSession){
    return {
        'guest':function(event){
            if(Auth.loggedIn){
                event.preventDefault();
                $state.go('my-tickets');
                return false;
            }
        },
        'auth':function(event,toState,toParams){
            if(!Auth.loggedIn){
                var redirect = $state.href(toState,toParams).replace("#!","");
                event.preventDefault();
                $state.go('login',{redirect:redirect,needToLogin:true});
                return false;
            }
        },
        'admin':function(event){
            if(!Auth.isAdmin()){
                event.preventDefault();
                $state.go('error',{msg:"Permission denied."});
                return false;
            }
        },
        'eventKey':function(event,toState,toParams){
            if(!AdminSession['event-key']){
                var redirect = $state.href(toState,toParams).replace("#!","");
                event.preventDefault();
                $state.go('admin/select-event',{
                    redirect:redirect,
                    needEventKey:true
                });
                return false;
            }
        },
        
    };
})
.run(function($rootScope,Auth,$state,stateFilters){
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
        
        // hotfix for navbar
        // on mobile, navbar was not closing when chaging states, so I added this jquery code, I know this is not the place bla bla...
        $('.navbar-collapse').removeClass('in');
        
        if(toState.beforeFilter){
            var filters = toState.beforeFilter.split('|');
            for(var i = 0;i < filters.length;i++){
                var filter = filters[i];
                var callback = stateFilters[filter];
                
                if(callback){
                    var result = callback.apply(this,arguments);
                    if(result === false){
                        return;
                    }
                }
            }
        }

        $rootScope.stateLoading = true;
    })
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
        $rootScope.stateLoading = false;
    })
})
.factory('Events', function(Restangular) {
  return Restangular.service('events');
})
.factory('Tickets', function(Restangular,Auth) {
  return function(){
      var user = Auth.user;
      var userId = user ? user.id : 0;
      return Restangular.service('users/'+userId+'/tickets');
  };
})
.service('Users',function(Restangular){
    return Restangular.service('users');
})
.controller('ViewEventController',function ($scope,event,Auth,Tickets,$state) {
      $scope.event = event;
      

      $scope.buyTicket = function(){
           
           $scope.buying = true;
           $scope.hasError = false;
          Tickets().post({
              eventId:event.id
          })
        .then(function(res){
            $state.go('my-tickets:view',{
                    ticketToken:res.token
                });
        },function(){
            $scope.hasError = true;
           $scope.buying = false;
        });
          
          
      }
      //$scope.modal = $modalInstance;

  })
.controller('MyTicketsController',function ($scope,$state,tickets,Auth) {

    if(!Auth.user){
        return $state.go('index');  
    }
    
    $scope.tickets = tickets;
      

  })
.controller('MyTicketsViewController',function ($scope,ticket) {
    $scope.ticket = ticket;
  })
/**
 * MainCtrl
 * @param {type} loginModal
 * @returns {undefined}
 */
.controller('MainCtrl',function(){

})

/**
 * LoginCtrl
 * @returns {undefined}
 */
.controller('LoginCtrl',function($scope,$http,$window,$state,$stateParams,Auth,$location){
    
    $scope.needToLogin = $stateParams.needToLogin;
    
    $scope.submit = function(form,$event){
        if($event){
            $event.preventDefault();
        }
        
        
        form.$submitted = true;
        form.$setValidity('validCredentials', true);

        if(form.$valid){
            form.$submitting = true;
             $http({
                url: "/auth/login",
                method: "POST",
                data: $scope.data
            }).success(function(data, status, headers, config) {
                form.$submitting = data.loggedIn;
                form.$setValidity('validCredentials', data.loggedIn);
                
                if(form.$valid){
                    Auth.set(data);
       
                    var redirect = '/my-tickets';
                    if($stateParams.redirect){
                        redirect = $stateParams.redirect;
                    }
                    
                    

                    $location.url(redirect);
                }
                
            }).error(function(data, status, headers, config) {
                
            });
        }
    }
})
.controller('SignUpCtrl',function($scope,$http,modal,Users,$state){
    
    $scope.data = {};
    $scope.hasError = false;
    
    $scope.dirty = function(form,name){
        return form.$submitted || form[name].$dirty;
    };
    
    $scope.invalid = function(form,name){
        return $scope.dirty(form,name) && form[name].$invalid;
    }
    
    $scope.error = function(name,error){
        return $scope.dirty($scope.form,name) && $scope.form[name].$error[error];
    }
    
    $scope.submit = function(form,$event){
        if($event){
            $event.preventDefault();
        }
        
        
        form.$submitted = true;
        
        if(form.$valid){
            
            form.$submitting = true;
            
            Users
            .post($scope.data)
            .then(function(res){
                form.$submitting = false;
                $state.go('index',{
                    confirmSent:$scope.data.email
                });
            },function(res){
                form.$submitting = false;
                $scope.hasError = true;
            });
        }
    }
})
/**
 * uniqueEmail
 * @param {type} Users
 * @returns {_L48.Anonym$3}
 */
.directive('uniqueEmail', function ($http) {
  return {
    require:'ngModel',
    restrict:'A',
    link:function (scope, el, attrs, ctrl) {

      ctrl.$parsers.push(function (viewValue) {
        var email = ctrl.$modelValue;
        
        if (email) {
            $http.post("/auth/email-exists",{email:viewValue})
            .success(function(result, status, headers, config) {
                ctrl.$setValidity('uniqueEmail', !result.exists);
            });
        }
        return viewValue;
      });
    }
  };
})
.directive('sameEmail', function ($http) {
  return {
    require:'ngModel',
    restrict:'A',
    scope:{
        sameEmail:'='
    },
    link:function (scope, el, attrs, ctrl) {
        
        
      //console.log(scope.sameEmail);
      ctrl.$parsers.push(function (viewValue) {

        if (viewValue) {
            
            ctrl.$setValidity('sameEmail', viewValue == scope.sameEmail);
            
          return viewValue;
        }
      });
    }
  };
})
.factory('modal',function($modal){
    var modal = {};
    
    modal.open = function(url,scope,callback){
        var modalInstance = $modal.open({
          templateUrl: ''+url+'.html',
          controller:function ($scope, $modalInstance) {
          
              if(scope){
                  for(var k in scope){
                      $scope[k] = scope[k];
                  }
              }
              
              $scope.modal = $modalInstance;
              
          }
        });

        if(callback){
            modalInstance.result.then(callback);
        }
    };
    
    modal.confirmEmail = function(email){
        modal.open('modal/confirm-email',{email:email})
    };
    
    modal.login = function(scope){
        if(!scope){
            scope = {};
        }
        
        scope.switchToSignUp = function(){
            this.modal.close();
            modal.signup();
         };
        
        this.open('modal/login',scope);
    };
    
    modal.signup = function(){
        this.open('modal/signup',{
            switchToLogin:function(){
                this.modal.close();
                modal.login();
             }
        });
    };
    
   
   return modal;
})
.service('Auth',function(){
    this.loggedIn = false;
    this.user = null;
    this.isAdmin = function(){
        return this.user && this.user.role === "admin";
    };
    
    this.set = function(data){
        for(var i in data){
            this[i] = data[i];
        }
    };
    
})
.service('AdminSession',function(Restangular){

    this.set = function(name,value){
        var self = this;
        return Restangular.one('admin/session',name).customPUT({
            value:value
        })
        .then(function(){
            self[name] = value;
        });
    };
    
    this.init = function(data){
        for(var i in data){
            this[i] = data[i];
        }
    }
    
})
.directive('preventDefault',function(){
  return {
    restrict:'A',
    link:function (scope, el, attrs, ctrl) {

      el.bind('click',function(e){
          e.preventDefault();
      })
    }
  };
})
.directive('toggle',function(){
  return {
    restrict:'A',
    scope:{
        toggle:'@'
    },
    link:function (scope, el, attrs, ctrl) {

        if(scope.toggle == 'tooltip'){
            el.tooltip();
        }
    }
  };
})
.directive('authInit',function(Auth,$rootScope){
  return {
    restrict:'A',
    scope:{
        authInit:'='
    },
    link:function (scope, el, attrs, ctrl) {
        
        Auth.set(scope.authInit);
        $rootScope.auth = Auth;
    }
  };
})
.directive('adminInit',function(AdminSession){
  return {
    restrict:'A',
    scope:{
        adminInit:'='
    },
    link:function (scope, el, attrs, ctrl) {
        AdminSession.init(scope.adminInit);
    }
  };
})
.directive('formGroup',function(){
  return {
    restrict:'E',
    templateUrl:'form/form-group.html',
    scope:{
        label:'@',
    },
    transclude:true,
    link:function (scope, el, attrs, ctrl) {
        
        var form  = scope.$parent.form;
        
        var name = el.find('input').attr('name');
          
        //scope.data = scope.$parent.data;
        scope.name = name;
        scope.form = form;
        scope.feedbackStyle = {};
        if(!scope.label){
            scope.feedbackStyle.top = '1px';
        }
    }
  };
})