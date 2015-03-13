<?php
namespace Passcode\Entity;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;
/**
 * Description of Use
 *
 * @ORM\Entity
 * @ORM\Table(name="events")
 */
class Event {
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
     * @ORM\Column(type="string")
     */
    public $title;
    
    /**
     *
     * @ORM\Column(type="datetime")
     */
    public $startTime;
    /**
     *
     * @ORM\Column(type="datetime")
     */
    public $endTime;

    
    /**
     *
     * @ORM\Column(type="text")
     */
    public $description;
    /**
     *
     * @ORM\Column(type="text")
     */
    public $image;
    
    /**
     * @var ArrayCollection
     * @ORM\OneToMany(targetEntity="Ticket", mappedBy="event")
     **/
    public $tickets;

     /**
     *
     * @ORM\Column(type="string",unique=true)
     */
    public $key;
}
