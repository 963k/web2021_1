const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let sql = `
select animefilm.id, animefilm.name, animefilm.income, maker.name as name2 from animefilm inner join maker on animefilm.maker_id=maker.id;
`

db.serialize( () => {
	db.all( sql, (error, row) => {
		if(error) {
			console.log('Error: ', error );
			return;
		}
		for( let data of row ) {
			console.log( data.id + ' : ' + data.name + ' : ' + data.income + ' : ' + data.name2 );
		}
	});
});
