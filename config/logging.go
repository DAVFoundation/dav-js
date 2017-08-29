package config

const (
	DEBUG = "DEBUG"
	INFO = "INFO"
	WARNING = "WARNING"
	ERROR = "ERROR"
	FATAL = "FATAL"
)


var Logging = struct {
	LevelOrder []string
	Threshold string
}{[]string{DEBUG, INFO, WARNING, ERROR, FATAL}, ERROR}