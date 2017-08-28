package config

var Redis = struct {
	Host string
	Port int
	Password string
	DB int
}{"localhost", 6379,"", 0}