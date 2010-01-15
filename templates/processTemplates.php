<?php
require 'lib/axismundi/display/AMMustache.php';
require 'application/WDTemplate.php';
require 'application/WDRenderer.php';
require 'application/WDJavascriptRenderer.php';

$directory = dir('files');
$files     = array();

while (false !== ($entry = $directory->read())) 
{
	switch($entry)
	{
		case '.':
		case '..':
			break;
		
		default:
		$file = realpath($directory->path.'/'.$entry);
		$files[] = WDTemplate::templateWithUri($file);
			break;
	}
}

$directory->close();
$renderer = WDJavascriptRenderer::rendererWithArray($files);
echo $renderer;
?>