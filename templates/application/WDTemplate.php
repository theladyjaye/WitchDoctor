<?php
class WDTemplate
{
	public $uri;
	public $key;
	
	public static function templateWithUri($uri)
	{
		$instance = new WDTemplate();
		$instance->setUri($uri);
		
		return $instance;
	}
	
	private function setUri($uri)
	{
		$this->uri = $uri;
		list($this->key, $extension) = explode('.', basename($this->uri));
	}
}
?>