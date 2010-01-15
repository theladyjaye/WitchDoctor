<?php
require 'PHPProxy.php';
$endpoint = explode('/', $_GET['endpoint']);
$port     = $_GET['port'];

$uri   = '/'.implode('/', array_slice($endpoint, 1));
$uri   = isset($_GET['params']) ? $uri.'?'.$_GET['params'] : $uri;

$proxy = new PHPProxy($endpoint[0], $port);

$proxy->proxy($uri);

$request_body = file_get_contents("php://input");
$out = array('request'=> array('info'=>$proxy->request_info, 'body'=>$request_body), 'response'=>array('headers'=>$proxy->response->headers, 'body'=>$proxy->response->body)); 
echo json_encode($out);
?>