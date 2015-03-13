<?php
namespace Passcode\Controller;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Auth;
use Doctrine\ORM\EntityManager;
use Illuminate\Support\Facades\Input;
use Illuminate\Http\Request;
use Doctrine\ORM\EntityRepository;
use Illuminate\Foundation\Application;

class BaseController extends Controller{
    
    
    /**
     *
     * @var EntityManager
     */
    protected $em;
    
    /**
     *
     * @var Request
     */
    protected $request;
    
    
    /**
     * 
     * @var Application 
     */
    protected $app;
    
    
    /**
     *
     * @var \Passcode\Repository\BaseRepository
     */
    protected $users;
    
    function __construct(Application $app ) {
        $this->app = $app;
        $this->em = $this->app['em'];
        $this->request = $this->app['request'];
        $this->users = $this->em->getRepository('pc:User');
        
    }
    
    
    public function input($key=null,$default = null){
        
        
        if(!$key){
            return $this->request->all();
        }
        else{
            return $this->request->input($key, $default);
        }
    }
    
    public function json($key=null,$default=null){
        if(!$key){
            return $this->request->json()->all();
        }
        else{
            return $this->request->json($key, $default);
        }
    }

        
    protected function setupLayout() {
        
        
        View::share('auth',(object)array(
            'user'=>Auth::user(),
            'loggedIn'=>Auth::check()
        ));
        
        $faker = \Faker\Factory::create();
        View::share('faker',$faker);
        
        //$this->_seedEvents();die();
    }

    protected function _seedEvents(){
        $faker = \Faker\Factory::create();

        
        for($i=0;$i<6;$i++){
            $date1 = $faker->dateTimeBetween('now', '+2 years');
            $date2 = $faker->dateTimeBetween($date1, $date1->format('Y-m-d H:i:s').' +10hours');
            
            $event = new \Passcode\Entity\Event();
            
            $event->title = trim($faker->sentence(3),'.');
            $event->startTime = $date1;
            $event->endTime = $date2;
            $event->description = $faker->text();
            $event->image = "http://lorempixel.com/400/200/nightlife/?t=".substr( md5(rand()), 0, 7);
            
            $this->em->persist($event);
           
        }
         $this->em->flush();
    }
    
}
