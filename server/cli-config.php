<?php
require __DIR__.'/bootstrap/autoload.php';
$app = require_once __DIR__.'/bootstrap/start.php';

use Doctrine\ORM\Tools\Console\ConsoleRunner;


// replace with mechanism to retrieve EntityManager in your app
$entityManager = $app['em'];

return ConsoleRunner::createHelperSet($entityManager);