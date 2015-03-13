<?php
namespace Passcode\Signup;
use Illuminate\Mail\Mailer;
use Illuminate\Routing\UrlGenerator;
use Passcode\Entity\User;
/**
 * Description of ConfirmMailer
 *
 * @author Carlos
 */
class ConfirmMailer {
    
    
    /**
     *
     * @var Mailer
     */
    protected $mailer;
    
    /**
     *
     * @var UrlGenerator
     */
    protected $urlGenerator;
    
    function __construct(Mailer $mailer, UrlGenerator $urlGenerator) {
        $this->mailer = $mailer;
        $this->urlGenerator = $urlGenerator;
    }

    
    public function sendConfirmEmail(User $user){
        
        
        
        $data = array(
            'name'=>$user->firstName,
            'text'=> \Faker\Factory::create()->text(),
            'confirmLink'=>$this->urlGenerator->to('/auth/confirm?token='.$user->confirmToken)
        );

        return $this->mailer->send('emails.signup.confirm', $data, function($message) use ($user)
        {
            $message->to($user->email)->subject('Confirmación de cuenta');
        });
    }
    
    public function sendWelcomeEmail(User $user){
        $data = array(
            'user'=>$user,
            'text'=> \Faker\Factory::create()->text(),
            'loginUrl'=>$this->urlGenerator->to('/#!/login')
        );

        return $this->mailer->send('emails.signup.welcome', $data, function($message) use ($user)
        {
            $message->to($user->email)->subject('Cuenta creada');
        });
    }
    
    public function sendTicketBoughtEmail(\Passcode\Entity\Ticket $ticket){
        
        $user = $ticket->user;
        
        /**    <p><img src="{{$ticketImageUrl}}"></p>
                    <p><strong>Evento:</strong> <a href="{{$eventUrl}}">{{$eventTitle}}</a></p>
                    <p><a href="{{$ticketViewUrl}}">Mas detalles</a></p>*/
        
        $data = array(
            'user'=>$user,
            'ticketImageUrl'=>$this->urlGenerator->to('/images/tickets/'.$ticket->token),
            'eventUrl'=>$this->urlGenerator->to('/#!/events/'.$ticket->event->id),
            'eventTitle'=>$ticket->event->title,
            'ticketViewUrl'=>$this->urlGenerator->to('/#!/my-tickets/'.$ticket->token),
        );
        return $this->mailer->send('emails.tickets.ticket-bought', $data, function($message) use ($user)
        {
            $message->to($user->email)->subject('Nuevo passcode');
        });
    }
}
