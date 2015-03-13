<?php
namespace Passcode\Controller;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Auth;
use Passcode\Entity\User;
use Passcode\Signup\SignupService;

/**
 * Description of AuthController
 *
 * @author Carlos
 */
class AuthController extends BaseController{
    
    public function getIndex(){
        
    }
    public function postEmailExists(){
        $email = $this->request->json('email');
        $user = $this->em->getRepository('pc:User')->findOneByEmail($email);
        return Response::json(array(
            'exists'=>(boolean)$user
        ));
    }
    
    public function postLogin(){
        $data = $this->json();
  
        $remember = $this->input('rememberme');
        
        $valid = Auth::attempt($data,$remember);

        return Response::json(array(
            'loggedIn'=>$valid,
            'user'=>Auth::user()
        ));
        
    }
    
    public function getConfirm(){
        $signupService = $this->app[SignupService::getClass()];
        
        $user = $signupService->confirm($this->input('token'));
        
        Auth::login($user);
        
        return \Redirect::to('/#!/events?confirmed');
    }
    
    
    public function getLogout(){
        Auth::logout();
        return \Redirect::to('/');
    }
    
    public function postUser(){
        return Response::json(Auth::user());
    }
}
