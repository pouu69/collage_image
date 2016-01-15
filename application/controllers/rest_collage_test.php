<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH.'/core/REST_Controller.php';

class Rest_Collage_Test extends REST_Controller{

	// physical server directory
	protected $dir_path = '';
	// for showing virtual directory 
	protected $file_path = '';

	function __construct(){
		parent::__construct();
		$this->dir_path = FCPATH.'assets/upload/tmp/';
		$this->file_path = 'http://'.$_SERVER["HTTP_HOST"].'/assets/upload/tmp/';
	}

	private function _response_for_browser($data,$code){
		if (isset($_SERVER['HTTP_ACCEPT']) && (strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false)) {
			$this->response($data,$code);
		} else {
			$this->response->format = "custom";
			$data = $this->format->factory($data)->to_json();
			header('Content-Type: text/html; charset=' . strtolower($this->config->item('charset')));

			$this->response($data, $code);
		}
	}

	function index_get(){
		$this->temporary_img_upload_for_ie($this->get()['path']);
	}

	function temporary_img_upload_for_ie($img_path){
		$content = file_get_contents($img_path);
		if($content !== false){
			$file_name = end(explode('/', $img_path));
			file_put_contents($this->dir_path.$file_name,$content);
			$this->_response_for_browser(array('file_path'=>$this->file_path.$file_name),200);
		}else{
			$this->_response_for_browser(array('error_msg'=>'File can not read.'),400);
		}
	}

	function index_post(){
		$this->temporary_file_upload();
	}

	function temporary_file_upload(){
	    try {
			// Undefined | Multiple Files | $_FILES Corruption Attack
			// If this request falls under any of them, treat it invalid.
			if (
			    !isset($_FILES['files']['error']) ||
			    is_array($_FILES['files']['error'])
			) {
			    throw new RuntimeException('Invalid parameters.');
			}

			switch ($_FILES['files']['error']) {
			    case UPLOAD_ERR_OK:
				break;
			    case UPLOAD_ERR_NO_FILE:
				throw new RuntimeException('No file sent.');
			    case UPLOAD_ERR_INI_SIZE:
			    case UPLOAD_ERR_FORM_SIZE:
				throw new RuntimeException('Exceeded filesize limit.');
			    default:
				throw new RuntimeException('Unknown errors.');
			}
			// You should also check filesize here. 
			if ($_FILES['files']['size'] >10000000) {
			    throw new RuntimeException('Exceeded filesize limit.');
			}

			// DO NOT TRUST $_FILES['upfile']['mime'] VALUE !!
			// Check MIME Type by yourself.
			$finfo = new finfo(FILEINFO_MIME_TYPE);
			if (false === $ext = array_search(
			    $finfo->file($_FILES['files']['tmp_name']),
			    array(
				'jpg' => 'image/jpeg',
				'png' => 'image/png',
				'gif' => 'image/gif',
			    ),
			    true
			)) {
			    throw new RuntimeException('Invalid file format.');
			}

			// You should name it uniquely.
			// DO NOT USE $_FILES['upfile']['name'] WITHOUT ANY VALIDATION !!
			// On this example, obtain safe unique name from its binary data.

			$file_path = sprintf('%s.%s',
				sha1_file($_FILES['files']['tmp_name']),
				$ext
			    );
			if (!move_uploaded_file($_FILES['files']['tmp_name'],$this->dir_path.$file_path)) {
			    throw new RuntimeException('Failed to move uploaded file.');
			}

			$response_data = array('file_path'=>$this->file_path.$file_path);
			$response_code = 200;
			$this->_response_for_browser($response_data, $response_code);
	    } catch (RuntimeException $e) {
			$response_data = array('error_msg'=>$e->getMessage());
			$response_code = 400;
			$this->_response_for_browser($response_data, $response_code);
	    }
	}
}
