<?php
namespace Passcode\Entity;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;
/**
 * Description of Use
 *
 * @ORM\Entity
 * @ORM\Table(name="tickets")
 */
class Ticket {
    
    use TimestampableEntity;
    
    
    
    /**
     * @var Event
     * 
     * @ORM\ManyToOne(targetEntity="Event", inversedBy="tickets")
     * @ORM\JoinColumn(name="eventId", referencedColumnName="id",nullable=false)
     **/
    public $event;
    /**
     * @var User
     * 
     * @ORM\ManyToOne(targetEntity="User", inversedBy="tickets")
     * @ORM\JoinColumn(name="userId", referencedColumnName="id",nullable=false)
     **/
    public $user;
    
    
    /**
     * @ORM\Id
     * @ORM\Column(type="string")
     */
    public $token;
    
    
    /**
     *
     * @ORM\Column(type="blob")
     */
    public $qrCode;
    
    
    /**
     *
     * @ORM\Column(type="boolean")
     */
    public $used = false;
    
    
    /**
     *
     * @ORM\Column(type="datetime",nullable=true)
     */
    public $usedDate;
}
