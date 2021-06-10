// dependency injections - `fetch`
function queryData(accessionId, fetch) {
	if (!fetch) fetch = window.fetch;
	return fetch(
		'https://search.rcsb.org/rcsbsearch/v1/query?json='.concat(
			encodeURIComponent(
				JSON.stringify({
					query: {
						type: 'group',
						logical_operator: 'and',
						nodes: [
							{
								type: 'terminal',
								service: 'text',
								parameters: {
									operator: 'exact_match',
									value: accessionId,
									attribute:
										'rcsb_polymer_entity_container_identifiers.reference_sequence_identifiers.database_accession'
								}
							},
							{
								type: 'terminal',
								service: 'text',
								parameters: {
									operator: 'exact_match',
									value: 'UniProt',
									attribute:
										'rcsb_polymer_entity_container_identifiers.reference_sequence_identifiers.database_name'
								}
							}
						]
					},
					return_type: 'entry'
				})
			)
		)
	)
		.then(res => {
			if (!res.ok) throw 'No relevant results returned from PDB.';
			return res.json();
		})
		.then(data => {
			return data.result_set
				.map(result => result.identifier)
				.filter(id => String(id).length === 4);
		});
}

module.exports = queryData;
