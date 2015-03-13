<?php
namespace Passcode\Provider;

use Doctrine\Common\Annotations\AnnotationRegistry;

use Illuminate\Support\ServiceProvider;

class DoctrineServiceProvider extends ServiceProvider {

    public function register() {
        $em = $this->createEntityManager();

        $this->app['em'] = $em;
        $this->app[get_class($em)] = $em; // add it with the class name so it can be injected in constructors
    }

    
    public function createEntityManager()
    { 
        $database = $this->app['config']->get('database.connections.mysql');
        $connection = array(
            'driver'   => 'pdo_mysql',
            'user'     => $database['username'],
            'password' => $database['password'],
            'dbname'   => $database['database'],
        );
     
        
        
       // WARNING: setup, assumes that autoloaders are set

        // globally used cache driver, in production use APC or memcached
        $cache = new \Doctrine\Common\Cache\ArrayCache;
        // standard annotation reader
        $annotationReader = new \Doctrine\Common\Annotations\AnnotationReader;
        
        
        
        $cachedAnnotationReader = new \Doctrine\Common\Annotations\CachedReader(
            $annotationReader, // use reader
            $cache // and a cache driver
        );
        

        // create a driver chain for metadata reading
        $driverChain = new \Doctrine\ORM\Mapping\Driver\DriverChain();
        // load superclass metadata mapping only, into driver chain
        // also registers Gedmo annotations.NOTE: you can personalize it
        \Gedmo\DoctrineExtensions::registerAbstractMappingIntoDriverChainORM(
            $driverChain, // our metadata driver chain, to hook into
            $cachedAnnotationReader // our cached annotation reader
        );
        
        
        //\Doctrine\Common\Annotations\AnnotationRegistry::registerFile(__DIR__.'/../../vendor/doctrine/orm/lib/Doctrine/ORM/Mapping/Driver/DoctrineAnnotations.php');
        AnnotationRegistry::registerLoader('class_exists');
        // now we want to register our application entities,
        // for that we need another metadata driver used for Entity namespace
        $annotationDriver = new \Doctrine\ORM\Mapping\Driver\AnnotationDriver(
            $cachedAnnotationReader, // our cached annotation reader
            array(__DIR__.'/../Entity') // paths to look in
        );
        // NOTE: driver for application Entity can be different, Yaml, Xml or whatever
        // register annotation driver for our application Entity namespace
        $driverChain->addDriver($annotationDriver, 'Passcode\\Entity');

        // general ORM configuration
        $config = new \Doctrine\ORM\Configuration;
        $config->setProxyDir(sys_get_temp_dir());
        $config->setProxyNamespace('Proxy');
        $config->setAutoGenerateProxyClasses(true); // this can be based on production config.
        // register metadata driver
        $config->setMetadataDriverImpl($driverChain);
        // use our already initialized cache driver
        $config->setMetadataCacheImpl($cache);
        $config->setQueryCacheImpl($cache);
        $config->addEntityNamespace('pc', 'Passcode\\Entity\\');
        $config->setDefaultRepositoryClassName('Passcode\\Repository\\BaseRepository');
        

        // create event manager and hook preferred extension listeners
        $evm = new \Doctrine\Common\EventManager();
        // gedmo extension listeners, remove which are not used

        // sluggable
        $sluggableListener = new \Gedmo\Sluggable\SluggableListener;
        // you should set the used annotation reader to listener, to avoid creating new one for mapping drivers
        $sluggableListener->setAnnotationReader($cachedAnnotationReader);
        $evm->addEventSubscriber($sluggableListener);

        // tree
        $treeListener = new \Gedmo\Tree\TreeListener;
        $treeListener->setAnnotationReader($cachedAnnotationReader);
        $evm->addEventSubscriber($treeListener);

        // loggable, not used in example
        $loggableListener = new \Gedmo\Loggable\LoggableListener;
        $loggableListener->setAnnotationReader($cachedAnnotationReader);
        $evm->addEventSubscriber($loggableListener);

        // timestampable
        $timestampableListener = new \Gedmo\Timestampable\TimestampableListener;
        $timestampableListener->setAnnotationReader($cachedAnnotationReader);
        $evm->addEventSubscriber($timestampableListener);

        // translatable
        $translatableListener = new \Gedmo\Translatable\TranslatableListener;
        // current translation locale should be set from session or hook later into the listener
        // most important, before entity manager is flushed
        $translatableListener->setTranslatableLocale('en');
        $translatableListener->setDefaultLocale('en');
        $translatableListener->setAnnotationReader($cachedAnnotationReader);
        $evm->addEventSubscriber($translatableListener);

        // sortable, not used in example
        $sortableListener = new \Gedmo\Sortable\SortableListener;
        $sortableListener->setAnnotationReader($cachedAnnotationReader);
        $evm->addEventSubscriber($sortableListener);

        // mysql set names UTF-8 if required
        $evm->addEventSubscriber(new \Doctrine\DBAL\Event\Listeners\MysqlSessionInit());
        // DBAL connection
        
         // Finally, create entity manager
        return \Doctrine\ORM\EntityManager::create($connection, $config, $evm);
    }

}