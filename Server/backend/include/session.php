<?php

class Session
{

    function __construct()
    {
        $this->isAdmin = "is_admin";
        $this->user = "user";
        $this->time = "last_activity";
        $this->duration = 20 * 60 * 1000;
        session_start();
    }

    // inizializza la sessione
    function create($isAdmin, $user)
    {
        $_SESSION[$this->isAdmin] = $isAdmin;
        $_SESSION[$this->user] = $user;
        $_SESSION[$this->time] = time();
        session_write_close();
    }

    // distrugge la sessione
    function destroy()
    {
        session_unset();
        session_destroy();
        setcookie(session_name(), "", time()-3600);
        session_write_close();
    }

    //true se l'utente loggato è admin
    function is_admin()
    {
        return isset($_SESSION[$this->isAdmin]) && $_SESSION[$this->isAdmin];
    }

    //true se la sessione non è scaduta. Se è OK fa il refresh e riparte da 0, altrimenti distrugge la sessione
    function is_valid()
    {
        $new_time = time();
        $has_old_time  = isset($_SESSION[$this->time]);
        $status = session_status();
        if ($has_old_time && ($new_time - $_SESSION[$this->time]) > $this->duration) {
            $this->destroy();
            return false;
        } elseif ($has_old_time) {
            $_SESSION[$this->time] = $new_time;
            session_write_close();
            return true;
        } else {
            return false;
        }
    }

    function get_user() {
        if(isset($_SESSION[$this->user])) {
            return $_SESSION[$this->user];
        } else {
            return "NO USER";
        }
    }
}
