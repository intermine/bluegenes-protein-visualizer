const queryGeneToProtein = proteinId => ({
	name: 'Protein_Sequence',
	title: 'Protein --> Sequence',
	description:
		'for a specified protein or list proteins give the protein sequence and length.',
	from: 'Protein',
	select: ['primaryIdentifier', 'primaryAccession'],
	where: [
		{
			path: 'Protein.id',
			op: '=',
			value: proteinId,
			switched: 'LOCKED',
			switchable: false
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
				else reject('No associated proteins found!');
			})
			.catch(reject);
	});
}

module.exports = queryData;
