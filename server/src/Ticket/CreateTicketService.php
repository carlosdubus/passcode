<?php
namespace Passcode\Ticket;

use Passcode\Common\Object;
use Passcode\QrCode\QrCodeGenerator;
use Doctrine\ORM\EntityManager;
use Passcode\Entity\Ticket;
use Illuminate\Routing\UrlGenerator;

/**
 * Description of CreateTicketService
 *
 * @author Carlos
 */
class CreateTicketService extends Object{
    
    
    /**
     *
     * @var QrCodeGenerator 
     */
    protected $qrCodeGenerator;
    
    /**
     *
     * @var EntityManager
     */
    protected $em;
    
    /**
     *
     * @var \Passcode\Signup\ConfirmMailer
     */
    protected $mailer;
    
    
    /**
     *
     * @var UrlGenerator
     */
    protected $urlGenerator;
    
    function __construct(QrCodeGenerator $qrCodeGenerator, EntityManager $em, \Passcode\Signup\ConfirmMailer $mailer, UrlGenerator $urlGenerator) {
        $this->qrCodeGenerator = $qrCodeGenerator;
        $this->em = $em;
        $this->mailer = $mailer;
        $this->urlGenerator = $urlGenerator;
    }

            
    public function createTicket($userId,$eventId){
        
        $user = $this->em->getReference('pc:User', $userId);
        $event = $this->em->getReference('pc:Event', $eventId);
         
        $ticket = new Ticket();
        
        $ticket->event = $event;
        $ticket->user = $user;
        $ticket->token = $this->newUniqueToken();
        
        $tokenUrl =$this->urlGenerator->to('/ut/'.$ticket->token);
        
        $ticket->qrCode = $this->qrCodeGenerator->get($tokenUrl);

        $this->em->persist($ticket);
        $this->em->flush($ticket);
        
        $this->mailer->sendTicketBoughtEmail($ticket);
        
        return $ticket;
    }
    
    protected function newToken($length=6){
        $characters = '0123456789abcdefghijklmnopqrstuvwxyz';
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $randomString;
    }
    
    public function newUniqueToken(){
        do{
            $token = $this->newToken();
        }while($this->tokenExists($token));
        return $token;
    }
    
    protected function tokenExists($token){
        $query = $this->em
                ->createQuery('SELECT COUNT(u.token) FROM pc:Ticket u where u.token = :token')
                ->setParameter('token', $token);
        $count = $query->getSingleScalarResult();
        
        return $count > 0;
    }
}
