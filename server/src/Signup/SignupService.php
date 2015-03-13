<?php
namespace Passcode\Signup;
use Passcode\Entity\User;
use Illuminate\Hashing\BcryptHasher;
use Passcode\Common\Object;

/**
 * Description of SignupService
 *
 * @author Carlos
 */
class SignupService extends Object{
    
    /**
     *
     * @var \Doctrine\ORM\EntityManager
     */
    protected $em;
    
    /**
     *
     * @var ConfirmMailer
     */
    protected $confirmMailer;
    
    
    /**
     *
     * @var BcryptHasher 
     */
    protected $hasher;

    function __construct(\Doctrine\ORM\EntityManager $em, ConfirmMailer $confirmMailer, BcryptHasher $hasher) {
        $this->em = $em;
        $this->confirmMailer = $confirmMailer;
        $this->hasher = $hasher;
    }

    
    public function signup(array $data){
        
  
        $fields = array(
            'firstName',
            'lastName',
            'email',
            'gender');
        
        
        $user = new User();
        
        foreach($fields as $field){
            $user->$field = array_key_exists($field, $data) ? $data[$field] : null;
        }
        
   
        if(isset($data['password'])){
             $user->password = $this->hasher->make($data['password']);
        }
        
        if(isset($data['birthDate'])){
            $user->birthDate = new \DateTime($data['birthDate']);
        }

        $user->confirmToken = $this->hasher->make(uniqid());
        
        
        $this->em->persist($user);
        $this->em->flush();
        
         $this->confirmMailer->sendConfirmEmail($user);
        
        return $user;
    }
    
    public function confirm($confirmToken){
        $user = $this->em->getRepository('pc:User')->findOneBy(array(
            'confirmToken'=>$confirmToken,
            'confirmed'=>false
        ));
        
        if(!$user){
            throw new \Exception('Invalid token');
        }
        
        $user->confirmed = true;
        
        $this->em->flush();
        
        $this->confirmMailer->sendWelcomeEmail($user);
        
        return $user;
    }

}
