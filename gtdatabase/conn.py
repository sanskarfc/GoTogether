import mysql.connector
from mysql.connector.cursor_cext import CMySQLCursor
# Database interface 
class Database:
    def get_session(self):
        pass
    
    def get_atomic_session(self):
        pass
    
    def close_connection(self):
        pass
  
# To get database object you need to read this interface  
class Getdatabase:
    
    def get_obj(self, dbname,**kwargs):
        if(dbname == 'localdb'):
            return LocalMySql(kwargs['database'],kwargs['user'], kwargs['password'])

#################### Implementation detail. Not useful for user #########################

# To implement automatic commit after one execution
class AutoCommitCursor(CMySQLCursor):
    def execute(self, operation, params=None, multi=False):
        super().execute(operation, params, multi)
        self._cnx.commit()

# Atomic session with automatically commit after exit
class AtomicCursor(CMySQLCursor):
    def __enter__(self):
        return self
    
    def __exit__(self):
        self._cnx.commit()
        
# Local db class. Implements Database
class LocalMySql(Database):
    
    connection = None
    
    def __init__(self, database, user, password):
        try:
            self.connection = mysql.connector.connect(
                host='localhost',
                database=database,
                user=user,
                password=password
            )
            
            if self.connection.is_connected():
                print("Connected to MySQL")

        except Exception as e:
            print("Error while connecting to MySQL", e)
        
    
    def get_session(self):
        return self.connection.cursor()
    
    def get_atomic_session(self):
        return  self.connection.cursor()
    
    def close_connection(self):
        self.connection.close()
