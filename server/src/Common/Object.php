<?php
namespace Passcode\Common;
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Object
 *
 * @author Carlos
 */
abstract class Object {
        
    static public function getClass(){
        return get_called_class();
    }
}
