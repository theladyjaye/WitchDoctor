<?php
class WDJavascriptRenderer extends WDRenderer
{
	public static function rendererWithArray($array)
	{
		$instance = new WDJavascriptRenderer();
		$instance->templates = $array;
		
		return $instance;
	}
	
	protected function stringForTemplate(WDTemplate $template)
	{
		$mustache = AMMustache::initWithUri($template->uri);
		return "\t".$template->key.':"'.(string)$mustache."\",\n";
	}
	
	protected function renderTemplatesWillBegin(&$output)
	{
		$output .= "var WDTemplates = {\n";
	}
	
	protected function renderTemplatesDidComplete(&$output)
	{
		$output = substr($output, 0, -2);
		$output .= "\n}";
	}
}
?>