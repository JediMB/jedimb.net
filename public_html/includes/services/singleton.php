<?php

class Singleton {
    protected static array $instances = [];

    protected function __construct() { }
    protected function __clone() { }
    public function __wakeup() {
        throw new Exception('Cannot serialize a singleton.');
    }

    public static function getInstance() {
        $subclass = static::class;

        if (isset(self::$instances[$subclass]))
            return self::$instances[$subclass];

        return (self::$instances[$subclass] = new static());
    }
}

?>