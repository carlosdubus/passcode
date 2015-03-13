<?php
namespace Passcode\Controller;
use Illuminate\Support\Facades\Response;

use Passcode\Ticket\CreateTicketService;

/**
 * Description of AuthController
 *
 * @author Carlos
 */
class UserTicketController extends BaseController{
    
    public function index($userId){
        
        $qb = $this->em->createQueryBuilder()
                ->from('pc:Ticket','t')
               // ->from('pc:Event','e')
                ->select('t.token,t.createdAt,e.title as eventTitle,e.id as eventId')
               ->join('t.event','e')
                ->where('t.user = :userId')
               // ->andWhere('t.event = e.id')
                ->setParameter('userId', $userId)
                    ->orderBy('t.createdAt','DESC');
        
      
            $tickets = $qb->getQuery()->getArrayResult();
            
          
            return Response::json($tickets);
        
    }
    
    public function show($userId,$ticketToken){
          $qb = $this->em->createQueryBuilder()
                ->from('pc:Ticket','t')
               // ->from('pc:Event','e')
                ->select('t.token,t.createdAt,e.title as eventTitle,e.id as eventId')
               ->join('t.event','e')
                ->where('t.user = :userId')
                ->andWhere('t.token = :token')
               // ->andWhere('t.event = e.id')
                ->setParameter('token', $ticketToken)
                ->setParameter('userId', $userId);

         // print $qb;die();
      
            $tickets = $qb->getQuery()->getSingleResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
            
          
            return Response::json($tickets);
    }
    
    public function store($userId){
        $eventId = $this->request->json('eventId');
        $createTicketService = $this->app[CreateTicketService::getClass()];
        $ticket = $createTicketService->createTicket($userId,$eventId);
        return Response::json(array(
            'token'=>$ticket->token
        ));
    }
}
