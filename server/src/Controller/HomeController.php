<?php
namespace Passcode\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\View;

/**
 * Description of HomeController
 *
 * @author Carlos
 */
class HomeController extends BaseController{
    
    public function getIndex(){
        return View::make("home/index");
    }
}
