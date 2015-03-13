<?php
namespace Passcode\Entity;

use Gedmo\Timestampable\Traits\TimestampableEntity;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use Illuminate\Auth\UserInterface;

/**
 * Description of Use
 *
 * @ORM\Entity
 * @ORM\Table(name="users")
 */
class User implements UserInterface{
    
    use TimestampableEntity;
    
    /**
     * @var integer
     *
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue
     */
    public $id ;
    
    /**
     *
     * @ORM\Column(nullable=true)
     */
    public $firstName;
    /**
     *
     * @ORM\Column(nullable=true)
     */
    public $lastName;
    /**
     *
     * @ORM\Column(type="date",nullable=true)
     */
    public $birthDate;
    /**
     *
     * @ORM\Column(unique=true)
     */
    public $email;
    /**
     *
     * @ORM\Column
     */
    public $password;
    
    /**
     *
     * @ORM\Column(nullable=true)
     */
    public $rememberToken;
    
    /**
     *
     * @ORM\Column(nullable=true)
     */
    public $confirmToken;
    
    /**
     *
     * @ORM\Column(type="boolean")
     */
    public $confirmed = false;
    
    /**
     *
     * @ORM\Column(type="string")
     */
    public $gender ;
    
    /**
     *
     * @ORM\Column(type="string")
     */
    public $role = "user";
    
    public function isAdmin(){
        return $this->role == "admin";
    }
    
    
    
    public function getAuthIdentifier() {
        return $this->id;
    }

    public function getAuthPassword() {
        return $this->password;
    }

    public function getRememberToken() {
        return $this->rememberToken;
    }

    public function getRememberTokenName() {
        return 'rememberToken';
    }

    public function setRememberToken($value) {
        $this->rememberToken = $value;
    }

}
