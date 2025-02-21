package sqlite

import (
	"database/sql"
	"fmt"
	"os"
	"solo/pkg"

	_ "github.com/mattn/go-sqlite3"
)

const DRIVER = "sqlite3"

type SqliteDB struct {
	dbName string
	db     *sql.DB
}

func NewSqliteDB(dbName string) (*SqliteDB, error) {
	s := new(SqliteDB)
	s.dbName = dbName
	return s, nil
}

func (s *SqliteDB) GetDB() *sql.DB {
	return s.db
}

func (s *SqliteDB) GetDBName() string {
	return s.dbName
}

func (s *SqliteDB) SetDBName(str string) {
	s.dbName = str
}

func (s *SqliteDB) Close() {
	s.db.Close()
}

func (s *SqliteDB) Connect() (*sql.DB, error) {
	dbDir := fmt.Sprintf("%s/db", pkg.CurrentDir())
	if _, err := os.Stat(dbDir); os.IsNotExist(err) {
		err = os.MkdirAll(dbDir, 0755)
		if err != nil {
			return nil, fmt.Errorf("failed to create db directory: %v", err)
		}
	}

	dbName := fmt.Sprintf("%s/%s", dbDir, s.dbName)
	db, err := sql.Open(DRIVER, dbName)
	if err != nil {
		return nil, err
	}

	s.db = db
	return s.db, nil
}

/*
sqlStmt := `

	CREATE TABLE IF NOT EXISTS users (
	    id INTEGER PRIMARY KEY AUTOINCREMENT,
	    name TEXT,
	    age INTEGER
	);`
*/
func (s *SqliteDB) CreateTable(sqlStmt string) (interface{}, error) {
	r, err := s.db.Exec(sqlStmt)
	if err != nil {
		return nil, err
	}
	return r, nil
}

/*
*
"SELECT id, name, age FROM users"
*/
func (s *SqliteDB) Query(sqlStmt string) (*sql.Rows, error) {
	rows, err := s.db.Query(sqlStmt)
	if err != nil {
		return nil, err
	}

	return rows, nil
}

/*
*
"INSERT INTO users(name, age) VALUES(?, ?)"
*/
func (s *SqliteDB) Insert(sqlStmt string, args ...any) (sql.Result, error) {
	stmt, err := s.db.Prepare(sqlStmt)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	result, err := stmt.Exec(args...)
	if err != nil {
		return nil, err
	}

	return result, nil
}
