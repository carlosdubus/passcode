@extends('layouts.master')

@section('content')

<div class="container">

    <!-- Main component for a primary marketing message or call to action -->
    <div class="jumbotron">
      <h1>Passcode</h1>
      <p><?=$faker->text()?></p>
      <p><?php var_dump($auth)?>
      <p>
        <a class="btn btn-lg btn-primary" ng-click="modal.login()"  role="button">Inscribete &raquo;</a>
      </p>
    </div>

  </div> <!-- /container -->
@stop