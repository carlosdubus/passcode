<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/


Route::filter('auth.api', function($route, $request)
{

   if(
    // if is not logged in  
    Auth::guest() ||
    // or is not an admin, and the route user id doesnt match the current user id
    !Auth::user()->isAdmin() && $route->getParameter('userId') != Auth::user()->id){
       return Response::make('Unauthorized', 401);
   }
});

Route::get('ut/{ticketToken}',function($ticketToken){
    return Redirect::to('/#!/admin/use-ticket/'.$ticketToken);
});


Route::controller('auth', 'Passcode\Controller\AuthController');
Route::controller('images', 'Passcode\Controller\ImageController');
Route::resource('api/tickets', 'Passcode\Controller\TicketController');
Route::resource('api/events', 'Passcode\Controller\EventController');
Route::resource('api/users', 'Passcode\Controller\UserController');
Route::resource('api/users/{userId}/tickets', 'Passcode\Controller\UserTicketController');
Route::resource('api/admin/session', 'Passcode\Controller\Admin\SessionController');
Route::resource('api/admin/events', 'Passcode\Controller\Admin\EventsController');
Route::controller('/', 'Passcode\Controller\HomeController');



Route::when('api/users/*', 'auth.api');
Route::when('api/tickets*', 'auth.api');
Route::when('api/admin*', 'auth.api');