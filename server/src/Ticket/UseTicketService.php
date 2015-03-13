<?php
namespace Passcode\Ticket;

use Doctrine\ORM\EntityManager;
use Passcode\Common\Object;

/**
 * Description of UseTicketService
 *
 * @author Carlos
 */
class UseTicketService extends Object{
    
    /**
     *
     * @var EntityManager
     */
    protected $em;
    
    function __construct(EntityManager $em) {
        $this->em = $em;
    }

    
    public function useTicket($ticketToken,$eventKey){
        
        $ticket = null;
        
        if($ticketToken){
            $ticket = $this->em->find("pc:Ticket", $ticketToken);
        }
     
        if(!$ticket){
            UseTicketException::invalidToken($ticketToken);
        }
        
        if(!$ticket->event->key){
            UseTicketException::noEventKey();
        }
        
        if($ticket->event->key != $eventKey){
            UseTicketException::invalidEventKey($eventKey);
        }
        
        if($ticket->used){
            UseTicketException::ticketAlreadyUsed();
        }
        
        $ticket->used = true;
        $ticket->usedDate = new \DateTime("now");
        
        $this->em->flush();
    }
}
