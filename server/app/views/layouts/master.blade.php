<!DOCTYPE html>
<html lang="en" 
      ng-app="passcode" 
      ng-controller="MainCtrl" 
      auth-init='<?=htmlentities(''.json_encode(array(
            'user'=>\Auth::user(),
            'loggedIn'=>\Auth::check()
        )))?>' 
      
  >
  <head>
    <meta admin-init="<?=htmlentities(json_encode(\Session::get('admin')))?>" />
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="/favicon.ico">

    <title>Passcode.do</title>

    <!-- Bootstrap core CSS -->
    <link href="/bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="/css/master.css?t=<?=filemtime(public_path('/css/master.css'))?>" rel="stylesheet">
    <link href="/css/events-list.css" rel="stylesheet">
    <link href="/css/login-box.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>

  <body >
      <div class="loading-overlay" ng-show="stateLoading"><i  class="fa fa-spinner fa-spin fa-5x"></i></div>

    <!-- Fixed navbar -->
    <div class="navbar navbar-default navbar-fixed-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" ui-sref="index">Passcode</a>
        </div>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li ui-sref-active="active">
                <a ui-sref="index">
                    <span class="glyphicon glyphicon-home"></span>
                    Inicio
                </a>
            </li>
            <li ui-sref-active="active"><a ui-sref="events">
                    <span class="glyphicon glyphicon-th-list"></span>
                    Eventos</a></li>
            
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li ng-show='!auth.user' ui-sref-active="active"><a ui-sref="login"><i class="fa fa-sign-in"></i> Login</a></li>
            <li ng-show='!auth.user' ui-sref-active="active"><a ui-sref="signup"><i class="fa fa-check-square-o"></i> Signup</a></li>
            <li class="dropdown" ng-show='auth.user'>
                <a href="#" prevent-default class="dropdown-toggle" ><i class="fa fa-user"></i> Mi cuenta <span class="caret"></span></a>
              <ul class="dropdown-menu" role="menu">
                  
                <li><a ui-sref="my-tickets">Mis tickets</a></li>
                 <li class="divider" ng-show="auth.isAdmin()"></li>
                <li role="presentation" class="dropdown-header" ng-show="auth.isAdmin()">Admin</li>
                <li><a ui-sref="admin/select-event" ng-show="auth.isAdmin()">Select event</a></li>
                <li class="divider"></li>
                <li><a href="/auth/logout">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </div>
    <div ui-view></div>
    <script src="/js/app.js?t=<?=filemtime(public_path('/js/app.js'))?>"></script>
  </body>
</html>
