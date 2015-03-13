<?php
namespace Passcode\Ticket;

/**
 * Description of TicketException
 *
 * @author Carlos
 */
class UseTicketException extends \Exception{
    
    const INVALID_TICKET_TOKEN = 0;
    const INVALID_EVENT_KEY = 1;
    const TICKET_ALREADY_USED = 2;
    const EVENT_HAS_NO_KEY = 3;
    
    static public function invalidToken($ticketToken){
        throw new UseTicketException("Invalid ticket token: $ticketToken", self::INVALID_TICKET_TOKEN);
    }
    static public function invalidEventKey($eventKey){
        throw new UseTicketException("Invalid event key: $eventKey", self::INVALID_EVENT_KEY);
    }
    static public function ticketAlreadyUsed(){
        throw new UseTicketException("Ticket already used", self::TICKET_ALREADY_USED);
    }
    static public function noEventKey(){
        throw new UseTicketException("Event has no key", self::EVENT_HAS_NO_KEY);
    }
    
}
