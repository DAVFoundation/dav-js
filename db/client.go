package db

// redis api

import (
	"time"
	"fmt"
	"github.com/garyburd/redigo/redis"
	"github.com/DAVFoundation/captain/config"
)

var conn redis.Conn

// initiates a connection to redis. It should be called once in every captain service
func Init() error {

	addr := fmt.Sprintf("%s:%d", config.Redis.Host, config.Redis.Port)

	var err error

	conn, err = redis.Dial("tcp", addr)

	if err != nil {
		return err
	}

	_, err = conn.Do("PING")

	return err

}

// an atomic implementation of pop an item from a sorted set using MULTI command
func ZPop(key string) (result string, err error) {

	defer func() {
		// Return connection to normal state on error.
		if err != nil {
			conn.Do("DISCARD")
		}
	}()

	// Loop until transaction is successful.
	for {
		if _, err := conn.Do("WATCH", key); err != nil {
			return "", err
		}

		members, err := redis.Strings(conn.Do("ZRANGE", key, 0, 0))
		if err != nil {
			return "", err
		}
		if len(members) != 1 {
			return "", redis.ErrNil
		}

		conn.Send("MULTI")
		conn.Send("ZREM", key, members[0])
		queued, err := conn.Do("EXEC")
		if err != nil {
			return "", err
		}

		if queued != nil {
			result = members[0]
			break
		}
	}

	return result, nil
}

// adds a string to a sorted set
func ZAdd (key string, score int64, value string) error {

	_, err := conn.Do("ZADD", key, score, value)

	return err

}

// gets an value by its key
func Get (key string) ([]byte, error) {

	data, err := redis.Bytes(conn.Do("GET", key))

	if err != nil {
		return nil, err
	}

	return data, nil

}

// sets a value for a key
func Set (key string, value []byte) error {

	_, err := conn.Do("SET", key, value)

	return err

}

// sets a value for a key and sets an expiration on the key
func SetEx (key string, value []byte, expiration time.Duration) error {

	_, err := conn.Do("SETEX", key, expiration, value)

	return err

}

// deletes an item by its key
func Del (key string) error {

	_, err := conn.Do("DEL", key)

	return err

}