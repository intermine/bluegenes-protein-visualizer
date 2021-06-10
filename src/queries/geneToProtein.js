const queryGeneToProtein = geneId => ({
	description:
		'For a given Gene (or List of Genes) returns the corresponding Protein(s) products.',
	from: 'Gene',
	select: [
		'primaryIdentifier',
		'symbol',
		'proteins.primaryIdentifier',
		'proteins.primaryAccession',
		'proteins.name',
		'proteins.length'
	],
	where: [
		{
			path: 'Gene.id',
			op: '=',
			value: geneId
		}
	]
});

// eslint-disable-next-line
function queryData(geneId, serviceUrl, imjsClient = imjs) {
	return new Promise((resolve, reject) => {
		const service = new imjsClient.Service({ root: serviceUrl });
		service
			.records(queryGeneToProtein(geneId))
			.then(data => {
				if (data.length) resolve(data[0]);
				else reject('No associated proteins found.');
			})
			.catch(reject);
	});
}

module.exports = queryData;
