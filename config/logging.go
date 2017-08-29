package config

const (
	INFO = "INFO"
	WARNING = "WARNING"
	ERROR = "ERROR"
	FATAL = "FATAL"
)


var Logging = struct {
	LevelOrder []string
	Threshold string
}{[]string{INFO, WARNING, ERROR, FATAL}, ERROR}