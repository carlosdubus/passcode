<?php
namespace Passcode\Controller;
use Illuminate\Support\Facades\Response;

use Passcode\Signup\SignupService;

/**
 * Description of AuthController
 *
 * @author Carlos
 */
class UserController extends BaseController{
    
    public function getIndex(){
        
        
    }
    
    public function show(){

    }
    
    public function store(){
        $signupService = $this->app[SignupService::getClass()];
        
        $signupService->signup($this->json());
        
        return Response::json(array(
            'ok'=>true
        ));
    }
}
