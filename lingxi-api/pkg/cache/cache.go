package cache

import (
	"time"

	"github.com/coocood/freecache"
)

var cache *freecache.Cache

func Init(size int) {
	cache = freecache.NewCache(size)
}

func Set(key string, value []byte, expireSeconds int) error {
	return cache.Set([]byte(key), value, expireSeconds)
}

func Get(key string) ([]byte, error) {
	return cache.Get([]byte(key))
}

func Delete(key string) bool {
	return cache.Del([]byte(key))
}

func Exists(key string) bool {
	_, err := cache.Get([]byte(key))
	return err == nil
}

func SetWithExpire(key string, value []byte, duration time.Duration) error {
	return cache.Set([]byte(key), value, int(duration.Seconds()))
}

func GetOrSet(key string, fn func() ([]byte, error), expireSeconds int) ([]byte, error) {
	data, err := cache.Get([]byte(key))
	if err == nil {
		return data, nil
	}

	data, err = fn()
	if err != nil {
		return nil, err
	}

	_ = cache.Set([]byte(key), data, expireSeconds)
	return data, nil
}

func Clear() {
	cache.Clear()
}