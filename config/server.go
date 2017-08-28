package config

var Server = struct {
	Host     string
	Port     int
	CertPath string
	KeyPath  string
}{"localhost", 4800, "", ""}