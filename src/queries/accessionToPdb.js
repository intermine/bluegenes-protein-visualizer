function queryData(accessionId) {
	const headers = new Headers();
	headers.append('Accept', '*/*');
	headers.append('Content-Type', 'application/x-www-form-urlencoded');
	return fetch('http://www.rcsb.org/pdb/rest/search?req=browser', {
		method: 'POST',
		body: `
			<orgPdbQuery>
				<queryType>org.pdb.query.simple.UpAccessionIdQuery</queryType>
				<description>Simple query for a list of UniprotKB Accession IDs: P50225</description>
				<accessionIdList>${accessionId}</accessionIdList>
			</orgPdbQuery>
			`,
		headers: headers
	}).then(res => res.text());
}

export default queryData;
