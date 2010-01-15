<?php
abstract class WDRenderer
{
	protected $templates;
	
	abstract protected function stringForTemplate(WDTemplate $template);
	abstract protected function renderTemplatesWillBegin(&$output);
	abstract protected function renderTemplatesDidComplete(&$output);
	
	public function __toString()
	{
		$output = '';
		$this->renderTemplatesWillBegin($output);
		
		foreach($this->templates as $template)
		{
			$output .= $this->stringForTemplate($template);
		}
		
		$this->renderTemplatesDidComplete($output);
		
		return $output;
	}
}
?>