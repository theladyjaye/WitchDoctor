<?php
require 'PHPProxy.php';
$proxy = new PHPProxy();
$proxy->setHost('www.google.com');
$proxy->setHeaders(apache_request_headers());
$proxy->setCompression('gzip');
//$proxy->setFollowRedirects(true);
$proxy->proxy('/');
echo print_r($proxy->response->headers);
//echo $proxy->response->body;

/*foreach($proxy->response->headers as $header)
{
	header($header);
}*/
?>