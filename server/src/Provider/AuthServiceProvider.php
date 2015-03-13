<?php
namespace Passcode\Provider;
use Illuminate\Auth\UserProviderInterface;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Illuminate\Auth\UserInterface;
use Illuminate\Hashing\BcryptHasher;
/**
 * Description of AuthServiceProvider
 *
 * @author Carlos
 */
class AuthServiceProvider implements UserProviderInterface{
    
  
    /**
     *
     * @var EntityManager
     */
    protected $em;
    /**
     *
     * @var EntityRepository
     */
    protected $userRepository;
    
    /**
     *
     * @var BcryptHasher
     */
    protected $hasher;
    
    function __construct(EntityManager $em, EntityRepository $userRepository, BcryptHasher $hasher) {
        $this->em = $em;
        $this->userRepository = $userRepository;
        $this->hasher = $hasher;
    }

        
    public function retrieveByCredentials(array $credentials) {
        $find = array(
            'email'=>$credentials['email'],
            'confirmed'=>true
        );
        
        return $this->userRepository->findOneBy($find);
    }

    public function retrieveById($identifier) {
        return $this->userRepository->find($identifier);
    }

    public function retrieveByToken($identifier, $token) {
        return $this->userRepository->findOneBy(array(
            'id'=>$identifier,
            'rememberToken'=>$token
        ));
    }

    public function updateRememberToken(UserInterface $user, $token) {
        $user->setRememberToken($token);
        
        $this->em->flush($user);
    }

    public function validateCredentials(UserInterface $user, array $credentials) {
        return $this->hasher->check($credentials['password'], $user->getAuthPassword());
    }

}
