<?php
namespace Passcode\QrCode;

/**
 * Description of QrCodeGenerator
 *
 * @author Carlos
 */
class QrCodeGenerator {
    public function get($data,$width=300,$height=300){
        $content =  @file_get_contents('https://chart.googleapis.com/chart?cht=qr&chs='.$width.'x'.$height.'&chl='.urlencode($data).'&chld=L|0');

        if(!$content){
            throw new \Exception('Error generating qr code');
        }
        
        return $content;
    }
}
