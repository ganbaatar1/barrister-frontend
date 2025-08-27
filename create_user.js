db.getSiblingDB("admin").createUser({user:"db_admin",pwd:"B@rr15ter",roles:[{role:"readWrite",db:"barrister_db"},{role:"dbAdmin",db:"barrister_db"}]})
