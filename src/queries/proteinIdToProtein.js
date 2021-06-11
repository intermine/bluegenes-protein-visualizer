const queryProteinToAccession = proteinId => ({
	description: 'for a specified protein give its identifer and accession.',
	from: 'Protein',
	select: ['primaryAccession', 'canonicalProtein.primaryAccession'],
	joins: ['canonicalProtein'],
	where: [
		{
			path: 'Protein.id',
			op: '=',
			value: proteinId
		}
	]
});

// eslint-disable-next-line
function queryData(proteinId, serviceUrl, imjsClient = imjs) {
	return new Promise((resolve, reject) => {
		const service = new imjsClient.Service({ root: serviceUrl });
		service
			.records(queryProteinToAccession(proteinId))
			.then(data => {
				if (data.length) resolve(data[0]);
				else reject('Protein not found.');
			})
			.catch(reject);
	});
}

module.exports = queryData;
