<?php
require 'PHPProxy.php';
$endpoint        = explode('/', $_GET['endpoint']);
$port            = $_GET['port'];
$uri             = '/'.implode('/', array_slice($endpoint, 1));
$uri             = isset($_GET['params']) ? $uri.'?'.$_GET['params'] : $uri;
$headers         = apache_request_headers();
$header_key      = 'X-WitchDoctor-';
$request_headers = array();
$seperator       = '--------------WitchDoctor';
foreach($headers as $key => $value)
{
	if(strpos($key, $header_key) !== false)
	{
		$request_headers[substr($key, strlen($header_key))] = $value;
	}
}

$request_body = file_get_contents("php://input");
//echo json_encode($request_body);exit;
//echo json_encode($request_headers);exit;
$proxy = new PHPProxy($endpoint[0], $port);
$proxy->setHeaders($request_headers);
$proxy->proxy($uri);

echo json_encode($proxy->request_info);
echo $seperator;
echo $request_body;
echo $seperator;
echo json_encode($proxy->response->headers);
echo $seperator;
echo $proxy->response->body;

//$out = array('request'=> array('info'=>$proxy->request_info, 'body'=>$request_body), 'response'=>array('headers'=>$proxy->response->headers, 'body'=>$proxy->response->body)); 
//echo json_encode($out);
?>