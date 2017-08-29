package util

// logger for usage by any of the captain services. it uses 'glog' to output events to stdout

import (
	"fmt"
	"github.com/golang/glog"
	"github.com/DAVFoundation/captain/config"
)

type Scribe interface {
	Log(identifier *string)
}

type Info struct {
	Args *[]interface{}
}

func (i Info) Log (identifier *string)  {
	glog.Info(*identifier, *i.Args)
}

type Warning struct {
	Args *[]interface{}
}

func (w Warning) Log (identifier *string)  {
	glog.Warning(*identifier, *w.Args)
}

type WarningDepth struct {
	Depth *int
	Args *[]interface{}
}

func (w WarningDepth) Log (identifier *string)  {
	glog.WarningDepth(*w.Depth, *identifier, *w.Args)
}

type WarningF struct {
	Format *string
	Args *[]interface{}
}

func (w WarningF) Log (identifier *string)  {
	glog.Warning(*identifier, fmt.Sprintf(*w.Format, *w.Args))
}

type Error struct {
	Args *[]interface{}
}

func (e Error) Log (identifier *string)  {
	glog.Error(*identifier, *e.Args)
}

type ErrorDepth struct {
	Depth *int
	Args *[]interface{}
}

func (e ErrorDepth) Log (identifier *string)  {
	glog.ErrorDepth(*e.Depth, *identifier, *e.Args)
}

type ErrorF struct {
	Format *string
	Args *[]interface{}
}

func (e ErrorF) Log (identifier *string)  {
	glog.Error(*identifier, fmt.Sprintf(*e.Format, *e.Args))
}

type InfoF struct {
	Format *string
	Args *[]interface{}
}

func (e InfoF) Log (identifier *string)  {
	glog.Info(*identifier, fmt.Sprintf(*e.Format, *e.Args))
}

var loggers = map[string]*Logger{}

func GetNamedLogger (identifier string) *Logger {

	if _, ok := loggers["foo"]; !ok {
		loggers[identifier] = &Logger{&identifier}
	}

	return loggers[identifier]
}

func GetCurrentPackageLogger () *Logger {

	callInfo := retrieveCallInfo(1)

	return GetNamedLogger(callInfo.PackageName)

}

type Logger struct {
	identifier *string
}


func (l *Logger) log (scribe Scribe) {
	scribe.Log(l.identifier)
}

var levelFlags = map[string]bool{}

func (l *Logger) shouldLog (level string) bool {

	if val, ok := levelFlags[level]; ok {
		return val
	}

	for i := len(config.Logging.LevelOrder)-1; i >= 0; i-- {
		if config.Logging.LevelOrder[i] == level {
			levelFlags[level] = true
			return true
		}
		if config.Logging.LevelOrder[i] == config.Logging.Threshold {
			levelFlags[level] = false
			return false
		}
	}

	return false
}

func (l *Logger) SetIdentifier(identifier string) {
	l.identifier = &identifier
}

func (l *Logger) Info (args ...interface{}) {
	if !l.shouldLog(config.INFO) {
		return
	}
	l.log(Info{&args})
}

func (l *Logger) Warning (args ...interface{}) {
	if !l.shouldLog(config.WARNING) {
		return
	}
	l.log(Warning{&args})
}

func (l *Logger) Error (args ...interface{}) {
	l.log(Error{&args})
}

func (l *Logger) ErrorDepth (depth int, args ...interface{}) {
	l.log(ErrorDepth{&depth, &args})
}

func (l *Logger) Errorf (format string, args ...interface{}) {
	l.log(ErrorF{&format, &args})
}

func (l *Logger) Infof (format string, args ...interface{}) {
	if !l.shouldLog(config.INFO) {
		return
	}
	l.log(InfoF{&format, &args})
}

func (l *Logger) WarningF (format string, args ...interface{}) {
	if !l.shouldLog(config.WARNING) {
		return
	}
	l.log(WarningF{&format, &args})
}

func (l *Logger) WarningDepth (depth int, args ...interface{}) {
	if !l.shouldLog(config.WARNING) {
		return
	}
	l.log(WarningDepth{&depth, &args})
}