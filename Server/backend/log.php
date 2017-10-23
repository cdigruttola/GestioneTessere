<?php
    require_once('include/config.php');
    require_once('include/lib.php');
    
class Log extends RESTItem {
        
    protected function do_get() {
    	$to_return = $this->logger->get_log_messages();
    	$this->log_debug('Ricerca di tutti i log.');
    	return $to_return;
    }
        
    protected function do_post($data) {
    	throw new RESTException(HttpStatusCode::$METHOD_NOT_ALLOWED);
    }
        
    protected function do_del() {
    	if(!$this->logger->clear_log()) {
    		throw new RESTException(HttpStatusCode::$INTERNAL_SERVER_ERROR, $this->db->error);
    	}
    	$this->log_info('Eliminazione di tutti i log più vecchi di tre mesi.');
    	return $this->do_get();
    }

    protected function is_session_authorized() {
        return $this->session->is_valid();
    }
}
    
    // $db ho dovuto portarla dentro col costruttore di RESTItem
    // è definita in config.php
    $temp = new Log($db);
    $temp->dispatch();
