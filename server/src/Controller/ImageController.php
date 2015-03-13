<?php
namespace Passcode\Controller;
use Illuminate\Support\Facades\Response;


/**
 * Description of AuthController
 *
 * @author Carlos
 */
class ImageController extends BaseController{
    
    public function getTickets($id){
        $ticket = $this->em->find('pc:Ticket',$id);
        
        $response = Response::make(stream_get_contents($ticket->qrCode));

        $response->header('Content-Type', 'image/png');
        
        return $response;
    }
}
